"use client"
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authApi, type User } from '../api/endpoints'

interface AuthContextValue {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, fullName?: string) => Promise<void>
    logout: () => Promise<void>
    refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const refresh = useCallback(async () => {
        try {
            const u = await authApi.getLoggedUser()
            setUser(u || null)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        refresh()
    }, [refresh])

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true)
        try {
            const { user: loggedUser } = await authApi.login({ email, password })
            setUser(loggedUser)
        } finally {
            setLoading(false)
        }
    }, [])

    const register = useCallback(async (email: string, password: string, fullName?: string) => {
        setLoading(true)
        try {
            const { user: registered } = await authApi.register({ email, password, full_name: fullName })
            setUser(registered)
        } finally {
            setLoading(false)
        }
    }, [])

    const logout = useCallback(async () => {
        setLoading(true)
        try {
            await authApi.logout()
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    const value: AuthContextValue = { user, loading, login, logout, register, refresh }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
