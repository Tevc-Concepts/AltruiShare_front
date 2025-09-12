import { renderHook, act } from '@testing-library/react'
import * as notifMod from '../../../shared/api/endpoints/notification'
import { useNotifications } from './useNotifications'

const mockList = {
    notifications: [
        { id: '1', title: 'Test', body: 'Body', created_at: new Date().toISOString(), read: false }
    ],
    unread_count: 1
}

describe('useNotifications', () => {
    it('loads notifications', async () => {
        jest.spyOn(notifMod.notificationApi, 'list').mockResolvedValue(Promise.resolve(mockList))
        const { result } = renderHook(() => useNotifications())
        expect(result.current.loading).toBe(true)
        await act(async () => { })
        expect(result.current.notifications.length).toBe(1)
        expect(result.current.unreadCount).toBe(1)
    })
})
