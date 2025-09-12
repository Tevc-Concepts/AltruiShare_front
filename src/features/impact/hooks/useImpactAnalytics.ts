"use client"
import { useCallback, useEffect, useState } from 'react'
import { impactApi, ImpactAnalyticsResponse } from '../../../shared/api/endpoints/impact'

export function useImpactAnalytics(refreshMs?: number) {
    const [data, setData] = useState<ImpactAnalyticsResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await impactApi.getAnalytics()
            setData(res)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to load impact analytics')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchData() }, [fetchData])

    useEffect(() => {
        if (!refreshMs) return
        const id = setInterval(fetchData, refreshMs)
        return () => clearInterval(id)
    }, [fetchData, refreshMs])

    return { data, loading, error, refetch: fetchData }
}
