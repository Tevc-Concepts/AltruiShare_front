import axios from 'axios'

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
        return Promise.reject(error)
    }
)

export default api
