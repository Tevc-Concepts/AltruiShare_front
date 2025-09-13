import { NotificationsPanel } from '../../features/notifications/components/NotificationsPanel'
import Protected from '../../shared/ui/Protected'

export const dynamic = 'force-dynamic'

export default function NotificationsPage() {
    return (
        <main className="max-w-3xl mx-auto p-6 space-y-8">
            <h1 className="text-2xl font-semibold">Notifications</h1>
            <Protected fallback={<p className="text-sm text-neutral-600">Sign in to view and manage your notifications.</p>}>
                <NotificationsPanel />
            </Protected>
        </main>
    )
}
