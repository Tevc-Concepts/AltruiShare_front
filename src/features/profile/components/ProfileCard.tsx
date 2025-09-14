"use client"
import React from 'react'
import { useAuth } from '../../../shared/context/AuthProvider'

export const ProfileCard: React.FC = () => {
    const { profile, user, loading } = useAuth()
    if (loading) return <div className="animate-pulse p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-600/10" aria-busy="true">Loading profile…</div>
    if (!user) return <p className="text-sm text-gray-500">You are not logged in.</p>
    if (!profile) return <p className="text-sm text-gray-500">No profile data available.</p>
    return (
        <div className="rounded-2xl shadow-lg shadow-deep-navy/10 bg-white dark:bg-gray-900 p-6 flex gap-6 items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cobalt to-violet flex items-center justify-center text-white text-3xl font-semibold overflow-hidden">
                {profile.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt={profile.full_name || profile.email} className="w-full h-full object-cover" />
                ) : (profile.full_name?.[0] || profile.email[0]).toUpperCase()}
            </div>
            <div className="flex-1 space-y-2">
                <h2 className="text-xl font-semibold text-deep-navy dark:text-white">{profile.full_name || 'Unnamed User'}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">{profile.email}</p>
                {profile.organization && <p className="text-sm text-forest-green">Org: {profile.organization}</p>}
                {profile.roles && profile.roles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {profile.roles.map(r => (
                            <span key={r} className="px-3 py-1 rounded-full text-xs bg-emerald/10 text-emerald font-medium shadow-sm">
                                {r}
                            </span>
                        ))}
                    </div>
                )}
                <div className="grid grid-cols-3 gap-4 pt-2 text-center">
                    <Stat label="Donations" value={profile.total_donations_count ?? 0} />
                    <Stat label="Amount" value={`$${(profile.total_donations_amount ?? 0).toFixed(2)}`} />
                    <Stat label="Hours" value={profile.volunteer_hours ?? 0} />
                </div>
            </div>
        </div>
    )
}

const Stat: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="rounded-xl bg-gradient-to-br from-emerald/5 to-teal/10 p-3 shadow-inner">
        <div className="text-sm font-semibold text-deep-navy dark:text-white">{value}</div>
        <div className="text-[11px] uppercase tracking-wide text-gray-500 mt-1">{label}</div>
    </div>
)
