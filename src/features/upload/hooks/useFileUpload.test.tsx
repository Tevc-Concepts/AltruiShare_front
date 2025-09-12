import { renderHook, act } from '@testing-library/react'
import { useFileUpload } from './useFileUpload'

describe('useFileUpload', () => {
    it('queues files', () => {
        const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })
        const { result } = renderHook(() => useFileUpload())
        act(() => {
            result.current.enqueue([file])
        })
        expect(result.current.queue.length).toBe(1)
        expect(result.current.queue[0].file.name).toBe('hello.txt')
        expect(result.current.queue[0].status).toBe('queued')
    })
})
