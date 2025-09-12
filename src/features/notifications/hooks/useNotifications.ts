"use client"
import { useCallback, useEffect, useState } from 'react'
import { notificationApi, Notification } from '../../../shared/api/endpoints/notification'
import { enqueue, setupAutoFlush } from '../../../shared/offline/notificationQueue'

interface UseNotificationsOptions { pollMs?: number }

export function useNotifications(options?: UseNotificationsOptions) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [unreadCount, setUnreadCount] = useState(0)

    const load = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await notificationApi.list()
            setNotifications(res.notifications)
            setUnreadCount(res.unread_count)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to load notifications')
        } finally { setLoading(false) }
    }, [])

    const processAction = useCallback(async (action: { type: 'markRead'; id: string } | { type: 'markAll' }) => {
        if (action.type === 'markRead') await notificationApi.markRead(action.id)
        else await notificationApi.markAllRead()
    }, [])

    useEffect(() => {
        const dispose = setupAutoFlush(processAction)
        return dispose
    }, [processAction])

    const markRead = useCallback(async (id: string) => {
        // optimistic update
        setNotifications(list => list.map(n => n.id === id ? { ...n, read: true } : n))
        setUnreadCount(c => Math.max(0, c - 1))
        try {
            if (navigator.onLine) await notificationApi.markRead(id)
            else enqueue({ type: 'markRead', id })
        } catch {
            // revert on failure
            load()
        }
    }, [load])

    const markAllRead = useCallback(async () => {
        setNotifications(list => list.map(n => n.read ? n : { ...n, read: true }))
        setUnreadCount(0)
        try {
            if (navigator.onLine) await notificationApi.markAllRead()
            else enqueue({ type: 'markAll' })
        } catch { load() }
    }, [load])

    useEffect(() => { load() }, [load])

    useEffect(() => {
        if (!options?.pollMs) return
        const id = setInterval(load, options.pollMs)
        return () => clearInterval(id)
    }, [options?.pollMs, load])

    return { notifications, unreadCount, loading, error, reload: load, markRead, markAllRead }
}
