import { NeedsFeature } from '../../features/needs/needs.feature'
import Protected from '../../shared/ui/Protected'
import DashboardLayout from '../../shared/ui/layouts/DashboardLayout'

export default function NeedsPage() {
    return (
        <DashboardLayout>
            <div className="p-6">
                <h1 className="text-2xl font-semibold mb-4">Needs</h1>
                <Protected fallback={<p className="text-sm text-neutral-600">Sign in to create or manage needs. Public sample list below.</p>}>
                    <NeedsFeature />
                </Protected>
            </div>
        </DashboardLayout>
    )
}
