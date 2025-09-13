import axios, { AxiosRequestConfig } from 'axios'

export interface ApiSuccessEnvelope<T = unknown> { status: 'success'; message?: string; data: T }
export interface ApiErrorEnvelope { status: 'error' | 'fail'; message?: string; data?: unknown }

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
})

api.interceptors.response.use(
    (res) => {
        const payload = res.data
        if (payload?.status === 'success') {
            return payload.data ?? payload
        }
        const message = payload?.message || 'API error'
        return Promise.reject(new Error(message))
    },
    (error) => {
        try {
            const status = error?.response?.status
            if (status === 401 && typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('auth:unauthorized'))
            }
        } catch { /* noop */ }
        return Promise.reject(error)
    }
)

// Generic typed request wrapper to get strong typing at call sites
export async function apiRequest<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    const res = await api.request<ApiSuccessEnvelope<T> | ApiErrorEnvelope>(config)
    return res as unknown as T
}

export default api
