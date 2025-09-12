import api from '../client'

const prefix = '.as_api.notification_api.'

export interface Notification {
    id: string
    title: string
    body: string
    created_at: string
    read: boolean
    type?: string
    metadata?: Record<string, unknown>
}

export interface NotificationListResponse {
    notifications: Notification[]
    unread_count: number
}

export const notificationApi = {
    list: async (): Promise<NotificationListResponse> =>
        api.get(`${prefix}list_notifications`) as unknown as NotificationListResponse,
    markRead: async (id: string): Promise<{ success: boolean }> =>
        api.post(`${prefix}mark_read`, { id }) as unknown as { success: boolean },
    markAllRead: async (): Promise<{ success: boolean }> =>
        api.post(`${prefix}mark_all_read`, {}) as unknown as { success: boolean }
}
