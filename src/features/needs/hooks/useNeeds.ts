"use client"
import { useEffect, useState, useCallback } from 'react'
import { needApi } from '../../../shared/api/endpoints/need'
import type { Need } from '../../../shared/api/endpoints/need'

export type UseNeedsFilters = Record<string, string | undefined>

export function useNeeds(initial: UseNeedsFilters = {}) {
    const [filters, setFilters] = useState<UseNeedsFilters>(initial)
    const [data, setData] = useState<Need[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchNeeds = useCallback(async (activeFilters: UseNeedsFilters) => {
        setLoading(true)
        setError(null)
        try {
            const payload = await needApi.listByFilters(activeFilters as Record<string, unknown>)
            setData(payload || [])
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to load needs')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchNeeds(filters)
    }, [filters, fetchNeeds])

    return {
        needs: data,
        loading,
        error,
        setFilters,
        filters,
        refetch: () => fetchNeeds(filters)
    }
}
