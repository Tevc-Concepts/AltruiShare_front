import { renderHook, act } from '@testing-library/react'
import * as impactMod from '../../../shared/api/endpoints/impact'
import { useImpactAnalytics } from './useImpactAnalytics'

const mockData: impactMod.ImpactAnalyticsResponse = {
    kpi: { total_donations: 10, active_needs: 5, fulfilled_needs: 3, volunteers: 8, impact_score: 92.4 },
    timeline: [{ date: '2025-01-01', donations: 2, items: 1 }],
    categories: [{ category: 'Health', amount: 100, count: 4 }]
}

describe('useImpactAnalytics', () => {
    it('fetches analytics', async () => {
        const spy = jest.spyOn(impactMod.impactApi, 'getAnalytics').mockResolvedValue(Promise.resolve(mockData))
        const { result } = renderHook(() => useImpactAnalytics())
        expect(result.current.loading).toBe(true)
        await act(async () => { })
        expect(spy).toHaveBeenCalled()
        expect(result.current.data?.kpi.total_donations).toBe(10)
    })
})
