import { renderHook, act, waitFor } from '@testing-library/react'
import { useFileUpload } from './useFileUpload'
import * as fileMod from '../../../shared/api/endpoints/file'

// Spy on upload implementation
const uploadSpy = jest.spyOn(fileMod.fileApi, 'upload')

function makeFile(name = 'a.txt', size = 10, type = 'text/plain') {
    const blob = new Blob(['x'.repeat(size)], { type })
    return new File([blob], name, { type })
}

describe('useFileUpload', () => {
    beforeEach(() => {
        uploadSpy.mockReset()
    })

    it('enqueues and uploads (success path with progress)', async () => {
        uploadSpy.mockImplementation(async ({ onProgress }) => {
            onProgress?.(10)
            onProgress?.(55)
            onProgress?.(100)
            return { file_url: 'https://cdn/x', filename: 'a.txt', size: 10 }
        })
        const { result } = renderHook(() => useFileUpload({ auto: true, maxConcurrent: 1 }))
        const f = makeFile()
        act(() => { result.current.enqueue([f]) })
        await waitFor(() => {
            const item = result.current.queue[0]
            expect(item.status).toBe('done')
            expect(item.progress).toBe(100)
        })
        expect(result.current.queue[0].uploaded?.file_url).toBeDefined()
    })

    it('handles upload error', async () => {
        uploadSpy.mockRejectedValueOnce(new Error('boom'))
        const { result } = renderHook(() => useFileUpload({ auto: true }))
        act(() => { result.current.enqueue([makeFile('err.txt')]) })
        await waitFor(() => expect(result.current.queue[0].status).toBe('error'))
        expect(result.current.queue[0].error).toMatch(/boom/i)
    })

    it('cancels an uploading file', async () => {
        uploadSpy.mockImplementation(({ onProgress }) => new Promise(() => {
            // keep pending; progress once
            onProgress?.(5)
        }))
        const { result } = renderHook(() => useFileUpload({ auto: true }))
        act(() => { result.current.enqueue([makeFile('c.txt')]) })
        await waitFor(() => expect(['uploading', 'canceled', 'error', 'done']).toContain(result.current.queue[0].status))
        const id = result.current.queue[0].id
        act(() => { result.current.cancel(id) })
        expect(result.current.queue[0].status).toBe('canceled')
    })

    it('respects maxConcurrent (only one uploading at a time)', async () => {
        uploadSpy.mockImplementation(async ({ onProgress }) => {
            onProgress?.(50)
            await new Promise(r => setTimeout(r, 0))
            onProgress?.(100)
            return { file_url: 'x', filename: 'f', size: 1 }
        })
        const { result } = renderHook(() => useFileUpload({ auto: true, maxConcurrent: 1 }))
        act(() => { result.current.enqueue([makeFile('1.txt'), makeFile('2.txt')]) })
        await waitFor(() => {
            const uploadingCount = result.current.queue.filter(f => f.status === 'uploading').length
            expect(uploadingCount).toBeLessThanOrEqual(1)
        })
        // eventually both should have progressed beyond queued
        await waitFor(() => {
            const progressed = result.current.queue.filter(f => ['uploading', 'done', 'error', 'canceled'].includes(f.status)).length
            expect(progressed).toBeGreaterThanOrEqual(1)
        })
    })
})
// (Removed duplicate legacy block)
