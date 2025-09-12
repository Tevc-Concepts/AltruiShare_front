import api from '../client'

const prefix = '.as_api.impact_api.'

export interface ImpactKPI {
    total_donations: number
    active_needs: number
    fulfilled_needs: number
    volunteers: number
    impact_score: number
}

export interface TimeSeriesPoint {
    date: string
    donations: number
    items: number
}

export interface CategoryBreakdown {
    category: string
    amount: number
    count: number
}

export interface ImpactAnalyticsResponse {
    kpi: ImpactKPI
    timeline: TimeSeriesPoint[]
    categories: CategoryBreakdown[]
}

export const impactApi = {
    getAnalytics: async (): Promise<ImpactAnalyticsResponse> =>
        api.get(`${prefix}get_impact_analytics`) as unknown as ImpactAnalyticsResponse
}
