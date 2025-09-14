import api from '../client'

const prefix = '.as_api.volunteer_api.'

export interface VolunteerOpportunity {
    id: string
    title: string
    description?: string
    location?: string
    remote?: boolean
    required_skills?: string[]
    start_date?: string
    end_date?: string
    capacity?: number
    filled?: number
    status?: string
}

export interface VolunteerSignupResponse {
    opportunity_id: string
    status: string
}

export const volunteerApi = {
    list: async (filters?: Record<string, unknown>): Promise<VolunteerOpportunity[]> => {
        if (filters && Object.keys(filters).length) {
            return api.get(`${prefix}list_opportunities?filters=${encodeURIComponent(JSON.stringify(filters))}`) as unknown as VolunteerOpportunity[]
        }
        return api.get(`${prefix}list_opportunities`) as unknown as VolunteerOpportunity[]
    },
    get: async (id: string): Promise<VolunteerOpportunity> => api.get(`${prefix}get_opportunity?id=${encodeURIComponent(id)}`) as unknown as VolunteerOpportunity,
    signup: async (id: string): Promise<VolunteerSignupResponse> => api.post(`${prefix}signup`, { opportunity_id: id }) as unknown as VolunteerSignupResponse
}

export type { VolunteerOpportunity as Opportunity }
