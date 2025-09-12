import api from '../client'

const prefix = '.as_api.payment_api.'

export interface PaymentRequest {
    donation_id: string
    payment_reference: string
    amount: number
    currency: string
    gateway_config?: { checkout_url?: string; public_key?: string }
}

export interface PaymentStatusResponse {
    payment_status: string
    donation?: { name: string; amount?: number; status?: string; payment_reference?: string }
}

export interface PaymentMethod {
    name: string
    type: string
    enabled: boolean
    currencies: string[]
}

export const paymentApi = {
    createRequest: async (data: {
        amount: number
        currency: string
        payment_method: string
        donor_email: string
        donor_name: string
        organization?: string
        need_id: string
        callback_url?: string
    }): Promise<PaymentRequest> => api.post(`${prefix}create_payment_request`, data) as unknown as PaymentRequest,
    verify: async (payment_reference: string): Promise<PaymentStatusResponse> =>
        api.post(`${prefix}verify_payment`, { payment_reference }) as unknown as PaymentStatusResponse,
    getStatus: async (reference: string): Promise<PaymentStatusResponse> =>
        api.get(`${prefix}get_payment_status?reference=${encodeURIComponent(reference)}`) as unknown as PaymentStatusResponse,
    getMethods: async (): Promise<{ payment_methods: PaymentMethod[] }> =>
        api.get(`${prefix}get_payment_methods`) as unknown as { payment_methods: PaymentMethod[] }
}
