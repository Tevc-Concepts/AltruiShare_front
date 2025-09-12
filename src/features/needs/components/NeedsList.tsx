"use client"
import React, { useState } from 'react'
import { useNeeds } from '../hooks/useNeeds'
import { Input } from '../../../shared/ui/input'
import { NeedCard } from './NeedCard'
import { Button } from '../../../shared/ui/button'

export function NeedsList() {
    const { needs, loading, error, setFilters, filters, refetch } = useNeeds({})
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')

    const applyFilters = () => {
        setFilters({ ...filters, search, status })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-3 items-end md:items-center">
                <div className="flex-1">
                    <label className="block text-xs font-medium mb-1">Search</label>
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search needs..." />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1">Status</label>
                    <select
                        className="h-10 rounded-xl2 border border-brand-indigo/30 bg-white/70 dark:bg-neutral-900/60 text-sm px-3"
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="fulfilled">Fulfilled</option>
                    </select>
                </div>
                <Button onClick={applyFilters} variant="secondary" className="md:self-end">Apply</Button>
                <Button onClick={() => { setSearch(''); setStatus(''); setFilters({}); }} variant="ghost">Reset</Button>
            </div>

            {loading && <p role="status" className="text-sm">Loading needs...</p>}
            {error && (
                <div className="text-sm text-red-600 flex items-center gap-2">
                    <span>{error}</span>
                    <Button size="sm" variant="ghost" onClick={refetch}>Retry</Button>
                </div>
            )}
            {!loading && !error && needs.length === 0 && (
                <p className="text-sm text-neutral-500">No needs found.</p>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {needs.map((n, i) => <NeedCard key={n.id} need={n} index={i} />)}
            </div>
        </div>
    )
}
