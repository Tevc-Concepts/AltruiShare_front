import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import LoginPage from '../login/page'
import RegisterPage from '../register/page'

interface RouterMock { push: jest.Mock; replace: jest.Mock }
declare global { var __routerMock: RouterMock | undefined }
global.__routerMock = { push: jest.fn(), replace: jest.fn() }
jest.mock('next/navigation', () => ({
    useRouter: () => global.__routerMock!
}))

interface AuthMocks { mockLogin: jest.Mock; mockRegister: jest.Mock }
declare global { var __authMocks: AuthMocks | undefined }
global.__authMocks = { mockLogin: jest.fn(), mockRegister: jest.fn() }
jest.mock('../../shared/context/AuthProvider', () => ({
    useAuth: () => ({ login: global.__authMocks!.mockLogin, register: global.__authMocks!.mockRegister, loading: false, user: null })
}))

describe('LoginPage interactions', () => {
    beforeEach(() => { global.__routerMock!.push.mockReset(); global.__authMocks!.mockLogin.mockReset() })

    it('logs in successfully and redirects', async () => {
        global.__authMocks!.mockLogin.mockResolvedValueOnce(undefined)
        render(<LoginPage />)
        await userEvent.type(screen.getByLabelText(/Email/i), 'user@example.com')
        await userEvent.type(screen.getByLabelText(/Password/i), 'secret')
        await userEvent.click(screen.getByRole('button', { name: /login/i }))
        await waitFor(() => expect(global.__authMocks!.mockLogin).toHaveBeenCalledWith('user@example.com', 'secret'))
        expect(global.__routerMock!.push).toHaveBeenCalledWith('/')
    })

    it('shows error on login failure', async () => {
        global.__authMocks!.mockLogin.mockRejectedValueOnce(new Error('bad creds'))
        render(<LoginPage />)
        await userEvent.type(screen.getByLabelText(/Email/i), 'user@example.com')
        await userEvent.type(screen.getByLabelText(/Password/i), 'wrong')
        await userEvent.click(screen.getByRole('button', { name: /login/i }))
        await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/bad creds/i))
    })
})

describe('RegisterPage interactions', () => {
    beforeEach(() => { global.__routerMock!.push.mockReset(); global.__authMocks!.mockRegister.mockReset() })

    it('registers successfully and redirects', async () => {
        global.__authMocks!.mockRegister.mockResolvedValueOnce(undefined)
        render(<RegisterPage />)
        await userEvent.type(screen.getByLabelText(/Full Name/i), 'Jane Doe')
        await userEvent.type(screen.getByLabelText(/^Email$/i), 'jane@example.com')
        await userEvent.type(screen.getByLabelText(/Password/i), 'pass123')
        await userEvent.click(screen.getByRole('button', { name: /create account/i }))
        await waitFor(() => expect(global.__authMocks!.mockRegister).toHaveBeenCalledWith('jane@example.com', 'pass123', 'Jane Doe'))
        expect(global.__routerMock!.push).toHaveBeenCalledWith('/')
    })

    it('shows error on register failure', async () => {
        global.__authMocks!.mockRegister.mockRejectedValueOnce(new Error('email taken'))
        render(<RegisterPage />)
        await userEvent.type(screen.getByLabelText(/Full Name/i), 'Jake')
        await userEvent.type(screen.getByLabelText(/^Email$/i), 'jake@example.com')
        await userEvent.type(screen.getByLabelText(/Password/i), 'pass123')
        await userEvent.click(screen.getByRole('button', { name: /create account/i }))
        await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/email taken/i))
    })
})
