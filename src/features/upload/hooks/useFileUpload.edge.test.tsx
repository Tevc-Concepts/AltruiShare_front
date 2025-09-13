import { act, renderHook } from '@testing-library/react'
import { useFileUpload } from './useFileUpload'
import * as fileMod from '../../../shared/api/endpoints/file'

// Mock upload to control progress + resolution / rejection
const uploadSpy = jest.spyOn(fileMod.fileApi, 'upload')

function makeFile(name: string, size = 1024) {
    const blob = new Blob(['x'.repeat(size)], { type: 'text/plain' })
    return new File([blob], name)
}

describe('useFileUpload edge cases', () => {
    beforeEach(() => {
        uploadSpy.mockReset()
    })

    it('uploads queued files and updates progress then completion', async () => {
        uploadSpy.mockImplementation(async (data: { file: File; onProgress?: (p: number) => void }) => {
            const cb = data.onProgress
            cb?.(25)
            cb?.(60)
            cb?.(100)
            return { file_url: '/f/test.txt', filename: 'test.txt', size: 1024 }
        })

        const { result } = renderHook(() => useFileUpload({ maxConcurrent: 1 }))
        const file = makeFile('test.txt')

        act(() => { result.current.enqueue([file]) })
        // start upload
        act(() => { result.current.startAll() })
        // allow microtasks
        await act(async () => { await Promise.resolve() })

        expect(uploadSpy).toHaveBeenCalled()
        // progress should end at 100 and status done
        const entry = result.current.queue[0]
        expect(entry.progress).toBe(100)
        expect(entry.status).toBe('done')
    })

    it('handles upload error', async () => {
        uploadSpy.mockImplementation(async () => { throw new Error('boom') })
        const { result } = renderHook(() => useFileUpload({ maxConcurrent: 1 }))
        const file = makeFile('err.txt')
        act(() => { result.current.enqueue([file]) })
        act(() => { result.current.startAll() })
        await act(async () => { await Promise.resolve() })
        const entry = result.current.queue[0]
        expect(entry.status === 'error' || entry.status === 'canceled').toBeTruthy()
    })

    it('cancels uploading file', async () => {
        uploadSpy.mockImplementation(async (data: { file: File; onProgress?: (p: number) => void }) => {
            const cb = data.onProgress
            return new Promise<never>(() => {
                cb?.(10)
            })
        })
        const { result } = renderHook(() => useFileUpload({ maxConcurrent: 1 }))
        const file = makeFile('cancel.txt')
        act(() => { result.current.enqueue([file]) })
        act(() => { result.current.startAll() })
        // allow internal state to mark uploading
        await act(async () => { await Promise.resolve() })
        const uploading = result.current.queue[0]
        expect(uploading.status).toBe('uploading')
        act(() => { result.current.cancel(uploading.id) })
        await act(async () => { await Promise.resolve() })
        expect(result.current.queue[0].status).toBe('canceled')
    })

    it('removes and clears files', async () => {
        const { result } = renderHook(() => useFileUpload())
        const fileA = makeFile('a.txt')
        const fileB = makeFile('b.txt')
        act(() => { result.current.enqueue([fileA, fileB]) })
        expect(result.current.queue.length).toBe(2)
        const id = result.current.queue[0].id
        act(() => { result.current.remove(id) })
        expect(result.current.queue.length).toBe(1)
        act(() => { result.current.clear() })
        expect(result.current.queue.length).toBe(0)
    })
})
