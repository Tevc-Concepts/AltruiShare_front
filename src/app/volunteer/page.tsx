import React, { Suspense } from 'react'
import DashboardLayout from '../../shared/ui/layouts/DashboardLayout'

export default function VolunteerPage() {
    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto p-6 space-y-8">
                <header>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald to-teal text-transparent bg-clip-text">Volunteer Opportunities</h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Find a way to contribute time and skills.</p>
                </header>
                <Suspense fallback={<div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" aria-busy>Loading…</div>}>
                    <VolunteerBrowser />
                </Suspense>
            </div>
        </DashboardLayout>
    )
}

import VolunteerBrowser from './volunteer-browser'
