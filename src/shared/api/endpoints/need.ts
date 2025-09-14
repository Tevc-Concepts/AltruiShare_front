import api from '../client'

const prefix = '.as_api.need_api.'

export interface Need {
    id: string
    title: string
    description: string
    status: string
    category?: string
    created_at?: string
    organisation?: string
    organisation_name?: string
    amount?: number
    percentage?: number
    urgency?: string
    start_date?: string
    end_date?: string
}

export const needApi = {
    create: async (data: Partial<Need>): Promise<Need> => api.post(`${prefix}create_need`, data) as unknown as Need,
    update: async (id: string, data: Partial<Need>): Promise<Need> => api.post(`${prefix}update_need`, { id, ...data }) as unknown as Need,
    listByFilters: async (filters: Record<string, unknown>): Promise<Need[]> => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') params.set(k, String(v))
        })
        return api.get(`${prefix}get_needs_by_filters?${params.toString()}`) as unknown as Need[]
    },
    getById: async (need_id: string): Promise<Need> => api.get(`${prefix}get_need?need_id=${encodeURIComponent(need_id)}`) as unknown as Need
}
