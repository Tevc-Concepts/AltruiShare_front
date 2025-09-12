import api from '../client'

const prefix = '.payment_api.'

export interface PaymentRequest {
    id: string
    amount: number
    currency: string
    status: string
    gateway_config?: { checkout_url?: string }
}

export const paymentApi = {
    createRequest: (data: { donation_id: string; amount: number; currency?: string }) =>
        api.post<PaymentRequest>(`${prefix}create_payment_request`, data),
    verify: (data: { payment_request_id: string }) =>
        api.post<PaymentRequest>(`${prefix}verify_payment`, data)
}
