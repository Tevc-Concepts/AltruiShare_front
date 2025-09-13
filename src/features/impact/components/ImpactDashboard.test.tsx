import { render, screen } from '@testing-library/react'
import { ImpactDashboard } from './ImpactDashboard'
import * as impactMod from '../../../shared/api/endpoints/impact'

const mockData: impactMod.ImpactAnalyticsResponse = {
    kpi: { total_donations: 10, active_needs: 5, fulfilled_needs: 3, volunteers: 8, impact_score: 92.4 },
    timeline: [{ date: '2025-01-01', donations: 2, items: 1 }],
    categories: [{ category: 'Health', amount: 100, count: 4 }]
}

jest.spyOn(impactMod.impactApi, 'getAnalytics').mockResolvedValue(Promise.resolve(mockData))

describe('ImpactDashboard', () => {
    it('renders KPIs after load', async () => {
        render(<ImpactDashboard />)
        const donationKpiHeadings = await screen.findAllByRole('heading', { name: 'Donations' })
        expect(donationKpiHeadings.length).toBeGreaterThan(0)
        // KPI value
        expect(await screen.findByText('10')).toBeInTheDocument()
        expect(await screen.findByText(/Impact Analytics/i)).toBeInTheDocument()
    })
})
