import { ImpactDashboard } from '../../features/impact/components/ImpactDashboard'

export const dynamic = 'force-dynamic'

export default function ImpactPage() {
    return (
        <main className="max-w-7xl mx-auto p-6 space-y-8">
            <ImpactDashboard />
        </main>
    )
}
