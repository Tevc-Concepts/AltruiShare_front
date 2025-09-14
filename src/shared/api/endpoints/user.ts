import api from '../client'

const prefix = '.as_api.user_api.'

export interface UserProfile {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
    organization?: string
    roles?: string[]
    // Impact summary fields (optional, may be added progressively)
    total_donations_amount?: number
    total_donations_count?: number
    volunteer_hours?: number
}

export interface UpdateUserProfileInput {
    full_name?: string
    organization?: string
    avatar_url?: string // set after upload_file returns URL / file id
}

export const userApi = {
    getProfile: async (): Promise<UserProfile> => (await api.get(`${prefix}get_user_profile`)) as unknown as UserProfile,
    updateProfile: async (data: UpdateUserProfileInput): Promise<UserProfile> => (
        await api.post(`${prefix}update_user_profile`, data)
    ) as unknown as UserProfile
}

export type { UserProfile as Profile }
