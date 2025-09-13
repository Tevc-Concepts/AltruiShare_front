import { renderHook, act, waitFor } from '@testing-library/react'
import { useNotifications } from './useNotifications'
import * as notificationMod from '../../../shared/api/endpoints/notification'
// Mock announcer (spyOn caused redefine errors under swc ESM exports)
jest.mock('../../../shared/a11y/announce', () => ({
    announceStatus: jest.fn()
}))
import { announceStatus } from '../../../shared/a11y/announce'

// Mock queue module to allow tracking calls (SWC strict exports prevent spy redef)
jest.mock('../../../shared/offline/notificationQueue', () => {
    const actual = jest.requireActual('../../../shared/offline/notificationQueue')
    return {
        ...actual,
        enqueue: jest.fn(),
        setupAutoFlush: jest.fn(() => () => { })
    }
})
import * as queueMod from '../../../shared/offline/notificationQueue'

const listSpy = jest.spyOn(notificationMod.notificationApi, 'list')
const markReadSpy = jest.spyOn(notificationMod.notificationApi, 'markRead')
const markAllSpy = jest.spyOn(notificationMod.notificationApi, 'markAllRead')
const enqueueMock = queueMod.enqueue as jest.Mock
const setupAutoFlushMock = queueMod.setupAutoFlush as jest.Mock
const announceMock = announceStatus as jest.Mock

function sampleList(): notificationMod.NotificationListResponse {
    return {
        notifications: [
            { id: 'n1', title: 'Hello', body: 'World', read: false, created_at: '' },
            { id: 'n2', title: 'Foo', body: 'Bar', read: false, created_at: '' }
        ],
        unread_count: 2
    }
}

describe('useNotifications', () => {
    beforeEach(() => {
        jest.resetAllMocks()
        Object.defineProperty(global, 'navigator', { value: { onLine: true }, configurable: true })
        listSpy.mockResolvedValue(sampleList())
        markReadSpy.mockResolvedValue({ success: true })
        markAllSpy.mockResolvedValue({ success: true })
        enqueueMock.mockReset()
        setupAutoFlushMock.mockReset().mockImplementation(() => () => { })
    })

    it('loads notifications successfully', async () => {
        const { result } = renderHook(() => useNotifications())
        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.notifications.length).toBe(2)
        expect(result.current.unreadCount).toBe(2)
    })

    it('handles load error', async () => {
        listSpy.mockRejectedValueOnce(new Error('fail'))
        const { result } = renderHook(() => useNotifications())
        await waitFor(() => expect(result.current.loading).toBe(false))
        expect(result.current.error).toMatch(/fail/i)
    })

    it('optimistically marks single notification read (online)', async () => {
        const { result } = renderHook(() => useNotifications())
        await waitFor(() => expect(result.current.unreadCount).toBe(2))
        await act(async () => { await result.current.markRead('n1') })
        expect(result.current.notifications.find(n => n.id === 'n1')?.read).toBe(true)
        expect(result.current.unreadCount).toBe(1)
        expect(markReadSpy).toHaveBeenCalledWith('n1')
        expect(enqueueMock).not.toHaveBeenCalled()
        expect(announceMock).toHaveBeenCalled()
    })

    it('queues read action offline', async () => {
        Object.defineProperty(global.navigator, 'onLine', { value: false, configurable: true })
        const { result } = renderHook(() => useNotifications())
        await waitFor(() => expect(result.current.unreadCount).toBe(2))
        await act(async () => { await result.current.markRead('n2') })
        expect(enqueueMock).toHaveBeenCalledWith({ type: 'markRead', id: 'n2' })
    })

    it('marks all read (offline queues action)', async () => {
        Object.defineProperty(global.navigator, 'onLine', { value: false, configurable: true })
        const { result } = renderHook(() => useNotifications())
        await waitFor(() => expect(result.current.unreadCount).toBe(2))
        await act(async () => { await result.current.markAllRead() })
        expect(result.current.unreadCount).toBe(0)
        expect(enqueueMock).toHaveBeenCalledWith({ type: 'markAll' })
    })
})
