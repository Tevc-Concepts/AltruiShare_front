import api from '../client'

const prefix = '.as_api.donation_api.'

export interface DonationItem {
    type: string
    description: string
    quantity: number
    unit: string
    condition?: string
}

export interface Donation {
    donation_id?: string
    name?: string
    donation_type: 'Monetary' | 'Items' | string
    amount?: number
    status?: string
    need_id?: string
    payment_status?: string
    created_at?: string
    items?: DonationItem[]
}

export interface CreateDonationResponse {
    donation_id: string
    payment_required: boolean
    logistics_required: boolean
}

type MonetaryDonationPayload = {
    need_id: string
    donation_type: 'Monetary'
    amount: number
    payment_method?: string
    anonymous?: boolean
    notes?: string
}

type ItemDonationPayload = {
    need_id: string
    donation_type: 'Items'
    items: DonationItem[]
    pickup_required?: boolean
    donor_address_id?: string
    anonymous?: boolean
    notes?: string
}

export const donationApi = {
    create: async (data: MonetaryDonationPayload | ItemDonationPayload): Promise<CreateDonationResponse> =>
        api.post(`${prefix}create_donation`, data) as unknown as CreateDonationResponse,
    list: async (query?: { start?: number; page_length?: number; order_by?: string; filters?: unknown }): Promise<{ donations: Donation[]; total: number }> => {
        const search = new URLSearchParams()
        if (query?.start !== undefined) search.set('start', String(query.start))
        if (query?.page_length !== undefined) search.set('page_length', String(query.page_length))
        if (query?.order_by) search.set('order_by', query.order_by)
        if (query?.filters) search.set('filters', JSON.stringify(query.filters))
        const qs = search.toString()
        return api.get(`${prefix}list_donations${qs ? `?${qs}` : ''}`) as unknown as { donations: Donation[]; total: number }
    }
}
