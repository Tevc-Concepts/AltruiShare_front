import api from '../client'

const prefix = '.donation.'

export interface Donation {
    id: string
    amount?: number
    type: 'monetary' | 'in_kind'
    status: string
    created_at?: string
}

export const donationApi = {
    create: (data: Partial<Donation>) => api.post<Donation>(`${prefix}create_donation`, data),
    list: (params: Record<string, unknown> = {}) => api.post<Donation[]>(`${prefix}list_donations`, params)
}
