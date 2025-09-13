"use client"
import { Notification } from '../../../shared/api/endpoints/notification'
import { cn } from '../../../shared/utils/cn'

export function NotificationItem({ n, onClick }: { n: Notification; onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            role="listitem"
            aria-label={`${n.title}${n.read ? '' : ' (unread)'}`}
            data-unread={!n.read || undefined}
            className={cn(
                'w-full text-left p-3 rounded-xl2 border flex flex-col gap-1 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo/40',
                n.read ? 'bg-white/60 dark:bg-neutral-800/40 border-neutral-200/60 dark:border-neutral-700' : 'bg-gradient-to-r from-brand-indigo/10 to-brand-purple/10 border-brand-indigo/30'
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <p className={cn('text-sm font-medium', !n.read && 'text-brand-indigo')}>{n.title}</p>
                <time className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400" dateTime={n.created_at}>
                    {new Date(n.created_at).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                </time>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-3">{n.body}</p>
        </button>
    )
}
