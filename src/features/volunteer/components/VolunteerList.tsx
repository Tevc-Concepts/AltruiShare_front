"use client"
import React, { useEffect, useState } from 'react'
import { volunteerApi, type VolunteerOpportunity } from '../../../shared/api/endpoints/volunteer'
import { useAuth } from '../../../shared/context/AuthProvider'

interface Props { onSelect: (id: string) => void }

export const VolunteerList: React.FC<Props> = ({ onSelect }) => {
    const [items, setItems] = useState<VolunteerOpportunity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()

    useEffect(() => {
        let active = true
            ; (async () => {
                try {
                    const data = await volunteerApi.list()
                    if (active) setItems(data)
                } catch (e) {
                    setError((e as Error).message || 'Failed to load')
                } finally { if (active) setLoading(false) }
            })()
        return () => { active = false }
    }, [])

    if (loading) return <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" aria-busy>Loading opportunities…</div>
    if (error) return <div role="alert" className="text-sm text-red-600">{error}</div>
    if (!items.length) return <p className="text-sm text-neutral-500">No opportunities available.</p>

    return (
        <ul className="space-y-3">
            {items.map(o => (
                <li key={o.id}>
                    <button
                        onClick={() => onSelect(o.id)}
                        className="w-full text-left p-4 rounded-2xl bg-white dark:bg-neutral-900 shadow-lg shadow-deep-navy/10 hover:shadow-xl transition flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-deep-navy dark:text-white text-sm">{o.title}</h3>
                            {o.remote && <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-800/40 dark:text-teal-300">Remote</span>}
                        </div>
                        {o.location && <p className="text-[11px] text-neutral-500">{o.location}</p>}
                        <div className="flex flex-wrap gap-1">
                            {o.required_skills?.slice(0, 4).map(s => <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-800/40 dark:text-indigo-300">{s}</span>)}
                        </div>
                        {user && o.capacity !== undefined && (
                            <p className="text-[11px] text-neutral-500">{o.filled ?? 0}/{o.capacity} filled</p>
                        )}
                    </button>
                </li>
            ))}
        </ul>
    )
}
