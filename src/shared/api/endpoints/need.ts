import api from '../client'

const prefix = '.need_api.'

export interface Need {
    id: string
    title: string
    description: string
    status: string
    category?: string
    created_at?: string
}

export const needApi = {
    create: (data: Partial<Need>) => api.post<Need>(`${prefix}create_need`, data),
    update: (id: string, data: Partial<Need>) => api.post<Need>(`${prefix}update_need`, { id, ...data }),
    listByFilters: (filters: Record<string, unknown>) =>
        api.post<Need[]>(`${prefix}get_needs_by_filters`, filters)
}
