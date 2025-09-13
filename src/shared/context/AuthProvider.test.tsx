import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthProvider'
import * as authMod from '../api/endpoints'
import React from 'react'

const loginSpy = jest.spyOn(authMod.authApi, 'login')
const logoutSpy = jest.spyOn(authMod.authApi, 'logout')
const getUserSpy = jest.spyOn(authMod.authApi, 'getLoggedUser')

function Consumer() {
    const { user, login, logout, loading } = useAuth()
    return (
        <div>
            <span data-testid="user">{user?.email || 'none'}</span>
            <span data-testid="loading">{loading ? 'loading' : 'idle'}</span>
            <button onClick={() => login('a@b.com', 'pw')}>login</button>
            <button onClick={() => logout()}>logout</button>
        </div>
    )
}

describe('AuthProvider', () => {
    beforeEach(() => {
        getUserSpy.mockReset().mockResolvedValue(undefined as unknown as authMod.User)
        loginSpy.mockReset().mockResolvedValue({ user: { email: 'a@b.com' } } as unknown as authMod.AuthResponse)
        logoutSpy.mockReset().mockResolvedValue(undefined)
    })

    it('logs in and sets user', async () => {
        render(<AuthProvider><Consumer /></AuthProvider>)
        await userEvent.click(screen.getByText('login'))
        await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('a@b.com'))
    })

    it('logs out and clears user', async () => {
        render(<AuthProvider><Consumer /></AuthProvider>)
        await userEvent.click(screen.getByText('login'))
        await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('a@b.com'))
        await userEvent.click(screen.getByText('logout'))
        await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('none'))
    })

    it('sets loading true during logout then false', async () => {
        logoutSpy.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve(undefined), 15)))
        render(<AuthProvider><Consumer /></AuthProvider>)
        await act(async () => { await userEvent.click(screen.getByText('login')) })
        await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('a@b.com'))
        expect(screen.getByTestId('loading').textContent).toBe('idle')
        await act(async () => { await userEvent.click(screen.getByText('logout')) })
        await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('loading'))
        await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('idle'))
        expect(screen.getByTestId('user').textContent).toBe('none')
    })

    it('auto clears on 401 event', async () => {
        render(<AuthProvider><Consumer /></AuthProvider>)
        await act(async () => { await userEvent.click(screen.getByText('login')) })
        await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('a@b.com'))
        await act(async () => {
            window.dispatchEvent(new CustomEvent('auth:unauthorized'))
        })
        await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('none'))
    })
})
