import React from 'react'
import DashboardLayout from '../../../shared/ui/layouts/DashboardLayout'
import { needApi, Need } from '../../../shared/api/endpoints/need'
import DonationTabs from './DonationTabsClient'
import Protected from '../../../shared/ui/Protected'

interface Props { params: { needId: string } }

async function fetchNeed(needId: string): Promise<Need | null> {
    try { return await needApi.getById(needId) } catch {
        try {
            const list = await needApi.listByFilters({ name: needId })
            return list.find(n => n.id === needId || (n as unknown as { name?: string }).name === needId) || null
        } catch { return null }
    }
}

export default async function NeedDetailPage({ params }: Props) {
    const need = await fetchNeed(params.needId)
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                {!need && <p className="text-sm text-neutral-600">Need not found or unavailable.</p>}
                {need && (
                    <div className="space-y-6">
                        <header className="space-y-2">
                            <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-coral-600">{need.title}</h1>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-prose">{need.description}</p>
                            <div className="flex flex-wrap gap-2 text-xs">
                                {need.category && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-800/40 dark:text-emerald-300">{need.category}</span>}
                                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-800/40 dark:text-indigo-300">{need.status}</span>
                                {need.urgency && <span className="px-2 py-0.5 rounded-full bg-coral-100 text-coral-700 dark:bg-coral-800/40 dark:text-coral-300">{need.urgency}</span>}
                            </div>
                            <ProgressBar value={need.percentage ?? 0} />
                        </header>
                        <DonationSection needId={params.needId} />
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

function ProgressBar({ value }: { value: number }) {
    return (
        <div className="mt-4 max-w-md">
            <div className="h-3 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-coral-500" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
            </div>
            <p className="mt-1 text-xs font-medium text-neutral-600 dark:text-neutral-400">{value.toFixed(0)}% funded</p>
        </div>
    )
}

// Server component wrapper calling into client tabs component
function DonationSection({ needId }: { needId: string }) {
    return (
        <div className="rounded-2xl bg-white dark:bg-neutral-900 shadow-lg shadow-deep-navy/10 p-6">
            <h2 className="text-lg font-semibold mb-4">Donate to this Need</h2>
            <Protected fallback={<p className="text-sm text-neutral-600">Sign in to donate.</p>}>
                <DonationTabs needId={needId} />
            </Protected>
        </div>
    )
}
