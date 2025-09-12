import api from '../client'

const prefix = '.as_api.auth_api.'

export interface User {
    id: string
    email: string
    full_name?: string
    roles?: string[]
}

export interface AuthResponse {
    user: User
    sid?: string
}

export const authApi = {
    login: (data: { email: string; password: string }) =>
        api.post<AuthResponse>(`${prefix}login`, data),
    register: (data: { email: string; password: string; full_name?: string }) =>
        api.post<AuthResponse>(`${prefix}register`, data),
    logout: () => api.post(`${prefix}logout`, {}),
    getLoggedUser: () => api.get<User>(`${prefix}get_logged_user`)
}
