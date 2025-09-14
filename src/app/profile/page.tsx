import React, { Suspense } from 'react'
import { ProfileCard } from '../../features/profile/components/ProfileCard'
import { ProfileForm } from '../../features/profile/components/ProfileForm'
import { Protected } from '../../shared/ui/Protected'

export default function ProfilePage() {
    return (
        <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">Your Profile</h1>
            <Protected fallback={<p className="text-sm text-gray-500">Please log in to view your profile.</p>}>
                <Suspense fallback={<div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-600/10 animate-pulse" aria-busy="true">Loading…</div>}>
                    <div className="grid gap-10 md:grid-cols-5 md:items-start">
                        <div className="md:col-span-2">
                            <ProfileCard />
                        </div>
                        <div className="md:col-span-3">
                            <ProfileForm onUpdated={() => { /* Future: toast success */ }} />
                        </div>
                    </div>
                </Suspense>
            </Protected>
        </main>
    )
}
