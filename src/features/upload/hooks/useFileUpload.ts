"use client"
import { useCallback, useRef, useState } from 'react'
import { fileApi, UploadedFile } from '../../../shared/api/endpoints/file'

export interface QueuedFile {
    id: string
    file: File
    progress: number
    status: 'queued' | 'uploading' | 'done' | 'error' | 'canceled'
    error?: string
    uploaded?: UploadedFile
    controller?: AbortController
}

export function useFileUpload(options?: { attach_to_doctype?: string; attach_to_name?: string; auto?: boolean; maxConcurrent?: number }) {
    const [queue, setQueue] = useState<QueuedFile[]>([])
    const maxConcurrent = options?.maxConcurrent ?? 2
    const uploadingRef = useRef(0)

    const enqueue = useCallback((files: FileList | File[]) => {
        const list = Array.from(files)
        setQueue(q => [
            ...q,
            ...list.map(f => ({ id: crypto.randomUUID(), file: f, progress: 0, status: 'queued' as const }))
        ])
    }, [])

    const startNext = useCallback(() => {
        setQueue(q => {
            if (uploadingRef.current >= maxConcurrent) return q
            const nextIndex = q.findIndex(f => f.status === 'queued')
            if (nextIndex === -1) return q
            const next = q[nextIndex]
            const controller = new AbortController()
            uploadingRef.current += 1
                ; (async () => {
                    try {
                        const uploaded = await fileApi.upload({
                            file: next.file,
                            attach_to_doctype: options?.attach_to_doctype,
                            attach_to_name: options?.attach_to_name,
                            onProgress: percent => {
                                setQueue(curr => curr.map(cf => cf.id === next.id ? { ...cf, progress: percent } : cf))
                            }
                        })
                        setQueue(curr => curr.map(cf => cf.id === next.id ? { ...cf, status: 'done', progress: 100, uploaded } : cf))
                    } catch (e: unknown) {
                        setQueue(curr => curr.map(cf => cf.id === next.id ? { ...cf, status: controller.signal.aborted ? 'canceled' : 'error', error: e instanceof Error ? e.message : 'Upload failed' } : cf))
                    } finally {
                        uploadingRef.current -= 1
                        startNext()
                    }
                })()
            return q.map((f, i) => i === nextIndex ? { ...f, status: 'uploading', controller } : f)
        })
    }, [maxConcurrent, options?.attach_to_doctype, options?.attach_to_name])

    const startAll = useCallback(() => {
        for (let i = 0; i < maxConcurrent; i++) startNext()
    }, [maxConcurrent, startNext])

    const cancel = useCallback((id: string) => {
        setQueue(q => q.map(f => {
            if (f.id === id && f.status === 'uploading' && f.controller) {
                f.controller.abort()
                return { ...f, status: 'canceled' as const }
            }
            if (f.id === id && f.status === 'queued') return { ...f, status: 'canceled' as const }
            return f
        }))
    }, [])

    const remove = useCallback((id: string) => {
        setQueue(q => q.filter(f => f.id !== id))
    }, [])

    const clear = useCallback(() => setQueue([]), [])

    // Auto start
    if (options?.auto) {
        const hasQueued = queue.some(f => f.status === 'queued')
        const canStart = uploadingRef.current < maxConcurrent
        if (hasQueued && canStart) startNext()
    }

    return { queue, enqueue, startAll, startNext, cancel, remove, clear }
}
