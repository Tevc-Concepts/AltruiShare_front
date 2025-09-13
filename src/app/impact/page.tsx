import { ImpactDashboard } from '../../features/impact/components/ImpactDashboard'
import Protected from '../../shared/ui/Protected'
import DashboardLayout from '../../shared/ui/layouts/DashboardLayout'

export const dynamic = 'force-dynamic'

export default function ImpactPage() {
    return (
        <DashboardLayout>
            <main className="max-w-7xl mx-auto p-6 space-y-8">
                <h1 className="text-2xl font-semibold">Impact Analytics</h1>
                <Protected fallback={<p className="text-sm text-neutral-600">Sign in with appropriate role to view detailed analytics.</p>}>
                    <ImpactDashboard />
                </Protected>
            </main>
        </DashboardLayout>
    )
}
