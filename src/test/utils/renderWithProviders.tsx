import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from '../../shared/context/AuthProvider'
import * as authMod from '../../shared/api/endpoints/auth'

interface Options extends Omit<RenderOptions, 'queries'> {
    user?: { id: string; email?: string; name?: string }
    roles?: string[]
}

/**
 * Unified test renderer that wraps components with AuthProvider and allows injecting
 * a mock authenticated user & roles. Reduces boilerplate and prevents act warnings
 * by short‑circuiting the initial auth fetch when a user is supplied.
 */
export function renderWithProviders(ui: React.ReactElement, { user, roles, ...rest }: Options = {}) {
    if (user) {
        jest.spyOn(authMod.authApi, 'getLoggedUser').mockResolvedValueOnce(user as authMod.User)
    } else {
        jest.spyOn(authMod.authApi, 'getLoggedUser').mockResolvedValueOnce(null)
    }
    // Mock roles endpoint via fetch if invoked. Some test environments may not have fetch polyfilled yet.
    const rolesResponder = () => {
        const body = JSON.stringify({ status: 'success', data: { roles: roles || [] } })
        return Promise.resolve(new Response(body, { status: 200 })) as unknown as Promise<Response>
    }
    interface G extends Global {
        fetch?: typeof fetch
    }
    const g = globalThis as unknown as G
    if (typeof g.fetch === 'function') {
        jest.spyOn(global, 'fetch').mockImplementation(rolesResponder)
    } else {
        g.fetch = rolesResponder as unknown as typeof fetch
    }
    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <AuthProvider>{children}</AuthProvider>
    return render(ui, { wrapper: Wrapper, ...rest })
}

export * from '@testing-library/react'

/**
 * Waits for AuthProvider to finish its initial async resolution cycle.
 * Uses a microtask + requestAnimationFrame chain to cover state updates queued
 * after initial effects without forcing consumers to explicitly wrap in act.
 */
export async function waitForAuthSettled() {
    // Two microtasks + a frame tick to flush queued state updates
    await Promise.resolve()
    await Promise.resolve()
    await new Promise(requestAnimationFrame)
}

