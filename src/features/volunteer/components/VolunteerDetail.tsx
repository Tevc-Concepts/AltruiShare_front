"use client"
import React, { useEffect, useState } from 'react'
import { volunteerApi, type VolunteerOpportunity } from '../../../shared/api/endpoints/volunteer'
import { Button } from '../../../shared/ui/button'
import { useAuth } from '../../../shared/context/AuthProvider'

interface Props { id: string; onClose: () => void }

export const VolunteerDetail: React.FC<Props> = ({ id, onClose }) => {
    const [opportunity, setOpportunity] = useState<VolunteerOpportunity | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [joining, setJoining] = useState(false)
    const [joined, setJoined] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        let active = true
            ; (async () => {
                try { const data = await volunteerApi.get(id); if (active) setOpportunity(data) }
                catch (e) { setError((e as Error).message || 'Failed to load opportunity') }
                finally { if (active) setLoading(false) }
            })()
        return () => { active = false }
    }, [id])

    async function signup() {
        setJoining(true)
        try {
            await volunteerApi.signup(id)
            setJoined(true)
        } catch (e) {
            setError((e as Error).message || 'Failed to sign up')
        } finally { setJoining(false) }
    }

    if (loading) return <div className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" aria-busy>Loading…</div>
    if (error) return <div className="p-4 rounded-xl bg-red-50 text-sm text-red-700" role="alert">{error}</div>
    if (!opportunity) return null

    return (
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 shadow-lg shadow-deep-navy/10 space-y-4">
            <div className="flex justify-between items-start gap-4">
                <h2 className="text-lg font-semibold text-deep-navy dark:text-white">{opportunity.title}</h2>
                <button onClick={onClose} className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">Close</button>
            </div>
            {opportunity.location && <p className="text-sm text-neutral-600 dark:text-neutral-400">Location: {opportunity.location}</p>}
            {opportunity.description && <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">{opportunity.description}</p>}
            {opportunity.required_skills && opportunity.required_skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {opportunity.required_skills.map(skill => (
                        <span key={skill} className="px-3 py-1 rounded-full text-[11px] bg-violet-100 text-violet-700 dark:bg-violet-800/40 dark:text-violet-300">{skill}</span>
                    ))}
                </div>
            )}
            {opportunity.capacity !== undefined && (
                <p className="text-xs text-neutral-500">{opportunity.filled ?? 0}/{opportunity.capacity} participants</p>
            )}
            <div className="pt-2">
                {user ? (
                    <Button disabled={joining || joined} onClick={signup}>
                        {joined ? 'Registered' : joining ? 'Registering…' : 'Sign Up'}
                    </Button>
                ) : <p className="text-xs text-neutral-500">Log in to sign up.</p>}
            </div>
        </div>
    )
}
