"use client"
import { useCallback, useRef } from 'react'
import { Button } from '../../../shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/ui/card'
import { useFileUpload } from '../hooks/useFileUpload'

interface FileUploadProps {
    attach_to_doctype?: string
    attach_to_name?: string
    auto?: boolean
    maxConcurrent?: number
    onComplete?: (files: { file_url: string; filename: string; size: number }[]) => void
}

export function FileUpload(props: FileUploadProps) {
    const { queue, enqueue, startAll, cancel, remove, clear } = useFileUpload({
        attach_to_doctype: props.attach_to_doctype,
        attach_to_name: props.attach_to_name,
        auto: props.auto,
        maxConcurrent: props.maxConcurrent
    })
    const inputRef = useRef<HTMLInputElement | null>(null)

    const onFiles = useCallback((files: FileList | null) => {
        if (!files) return
        enqueue(files)
    }, [enqueue])

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        if (e.dataTransfer.files) onFiles(e.dataTransfer.files)
    }, [onFiles])

    const onDragOver = (e: React.DragEvent) => { e.preventDefault() }

    return (
        <Card className="border-dashed border-2 border-brand-indigo/30 bg-white/40 dark:bg-neutral-900/40">
            <CardHeader>
                <CardTitle>Upload Files</CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    className="p-6 rounded-xl2 text-center cursor-pointer transition-colors bg-gradient-to-br from-white/50 to-white/20 dark:from-neutral-800/40 dark:to-neutral-800/20 hover:from-white/70 hover:to-white/30 dark:hover:from-neutral-800/60"
                    onClick={() => inputRef.current?.click()}
                    aria-label="File Upload Drop Zone"
                >
                    <p className="text-sm">Drag & drop files here or click to select</p>
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={e => onFiles(e.target.files)}
                    />
                </div>
                {queue.length > 0 && (
                    <div className="mt-4 space-y-3">
                        {queue.map(f => (
                            <div key={f.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/60 dark:bg-neutral-800/50 shadow-sm">
                                <div className="flex-1 text-xs">
                                    <p className="font-medium truncate">{f.file.name}</p>
                                    <p className="text-neutral-500 dark:text-neutral-400">{(f.file.size / 1024).toFixed(1)} KB</p>
                                    <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded mt-1 overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-brand-indigo to-brand-purple transition-all" style={{ width: `${f.progress}%` }} />
                                    </div>
                                    <p className="mt-1 text-[10px] uppercase tracking-wide text-neutral-600 dark:text-neutral-400">{f.status}{f.error ? `: ${f.error}` : ''}</p>
                                </div>
                                {f.status === 'uploading' && (
                                    <Button size="sm" variant="secondary" onClick={() => cancel(f.id)}>Cancel</Button>
                                )}
                                {(f.status === 'queued' || f.status === 'error' || f.status === 'canceled') && (
                                    <Button size="sm" variant="ghost" onClick={() => remove(f.id)}>Remove</Button>
                                )}
                            </div>
                        ))}
                        <div className="flex gap-2 pt-2">
                            <Button size="sm" onClick={startAll} disabled={!queue.some(f => f.status === 'queued')}>Start</Button>
                            <Button size="sm" variant="secondary" onClick={clear} disabled={!queue.length}>Clear</Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
