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
    login: async (data: { email: string; password: string }): Promise<AuthResponse> =>
        (await api.post(`${prefix}login`, data)) as unknown as AuthResponse,
    register: async (data: { email: string; password: string; full_name?: string }): Promise<AuthResponse> =>
        (await api.post(`${prefix}register`, data)) as unknown as AuthResponse,
    logout: async (): Promise<void> => { await api.post(`${prefix}logout`, {}) },
    getLoggedUser: async (): Promise<User | null> => (await api.get(`${prefix}get_logged_user`)) as unknown as User | null
}
