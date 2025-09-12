import { NotificationsPanel } from '../../features/notifications/components/NotificationsPanel'

export const dynamic = 'force-dynamic'

export default function NotificationsPage() {
    return (
        <main className="max-w-3xl mx-auto p-6 space-y-8">
            <NotificationsPanel />
        </main>
    )
}
