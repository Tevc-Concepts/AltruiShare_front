"use client"
import { useState } from 'react'
import { useNotifications } from '../hooks/useNotifications'
import { Button } from '../../../shared/ui/button'
import { NotificationItem } from './NotificationItem'

export function NotificationsPanel() {
    const { notifications, loading, error, unreadCount, markRead, markAllRead, reload } = useNotifications({ pollMs: 60000 })
    const [showUnreadOnly, setShowUnreadOnly] = useState(false)

    const list = showUnreadOnly ? notifications.filter(n => !n.read) : notifications

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-brand-hero">Notifications</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo font-medium">{unreadCount} unread</span>
                <div className="ml-auto flex gap-2">
                    <Button size="sm" variant={showUnreadOnly ? 'secondary' : 'ghost'} onClick={() => setShowUnreadOnly(v => !v)}>{showUnreadOnly ? 'All' : 'Unread'}</Button>
                    <Button size="sm" variant="secondary" onClick={reload} disabled={loading}>Refresh</Button>
                    <Button size="sm" onClick={markAllRead} disabled={unreadCount === 0}>Mark all</Button>
                </div>
            </div>
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            {loading && notifications.length === 0 && <p className="text-sm">Loading notifications...</p>}
            {list.length === 0 && !loading && <p className="text-sm text-neutral-500">No notifications.</p>}
            <ul className="space-y-2">
                {list.map(n => (
                    <li key={n.id}>
                        <NotificationItem n={n} onClick={() => !n.read && markRead(n.id)} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
