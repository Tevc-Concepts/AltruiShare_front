"use client"
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authApi, type User } from '../api/endpoints'
import { userApi, type Profile } from '../api/endpoints/user'
import { apiRequest } from '../api/client'

interface AuthContextValue {
    user: User | null
    profile: Profile | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, fullName?: string) => Promise<void>
    logout: () => Promise<void>
    refresh: () => Promise<void>
    roles: string[]
    guest: boolean
    setGuest: (g: boolean) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [roles, setRoles] = useState<string[]>([])
    const [guest, setGuest] = useState(false)
    const [profile, setProfile] = useState<Profile | null>(null)

    const fetchRoles = useCallback(async () => {
        // When running in stub mode we skip backend and provide a default role.
        if (process.env.NEXT_PUBLIC_API_MODE === 'stub') {
            setRoles(['donor'])
            return
        }
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            setRoles([])
            return
        }
        try {
            const data = await apiRequest<{ roles?: string[] }>({ method: 'GET', url: '.as_api.pwa_api.get_user_roles' })
            if (Array.isArray(data?.roles)) setRoles(data.roles)
        } catch {
            // Suppress 404 noise while backend endpoint not available
            setRoles([])
        }
    }, [])

    const refresh = useCallback(async () => {
        // Stub mode: short-circuit all network calls to avoid 404 noise during early UI work.
        if (process.env.NEXT_PUBLIC_API_MODE === 'stub') {
            setUser({ id: 'guest', name: 'Stub User' } as unknown as User)
            setLoading(false)
            fetchRoles()
            setProfile({ id: 'guest', email: 'guest@example.com', full_name: 'Guest User', roles: ['donor'] })
            return
        }
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            setUser(null)
            setLoading(false)
            return
        }
        try {
            const u = await authApi.getLoggedUser()
            setUser(u || null)
            if (u) {
                try {
                    const p = await userApi.getProfile()
                    setProfile(p)
                } catch {
                    setProfile(null)
                }
            } else {
                setProfile(null)
            }
        } catch {
            setUser(null)
            setProfile(null)
        } finally {
            setLoading(false)
        }
        fetchRoles()
    }, [fetchRoles])

    useEffect(() => {
        refresh()
    }, [refresh])

    // Auto logout on 401 events
    useEffect(() => {
        const handler = () => {
            setUser(null)
        }
        if (typeof window !== 'undefined') {
            window.addEventListener('auth:unauthorized', handler)
        }
        return () => {
            if (typeof window !== 'undefined') window.removeEventListener('auth:unauthorized', handler)
        }
    }, [])

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true)
        try {
            const { user: loggedUser } = await authApi.login({ email, password })
            setUser(loggedUser)
            try { setProfile(await userApi.getProfile()) } catch { /* ignore profile fetch error */ }
        } finally {
            setLoading(false)
        }
    }, [])

    const register = useCallback(async (email: string, password: string, fullName?: string) => {
        setLoading(true)
        try {
            const { user: registered } = await authApi.register({ email, password, full_name: fullName })
            setUser(registered)
            try { setProfile(await userApi.getProfile()) } catch { /* ignore profile fetch error */ }
        } finally {
            setLoading(false)
        }
    }, [])

    const logout = useCallback(async () => {
        setLoading(true)
        try {
            await authApi.logout()
            setUser(null)
            setProfile(null)
        } finally {
            setLoading(false)
        }
    }, [])

    const value: AuthContextValue = { user, profile, loading, login, logout, register, refresh, roles, guest, setGuest }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
