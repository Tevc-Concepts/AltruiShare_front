import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import { AuthProvider, useAuth } from '../context/AuthProvider'
import Protected from './Protected'

// Helper to set guest mode quickly
const GuestSetter = () => {
    const { setGuest } = useAuth()
    React.useEffect(() => { setGuest(true) }, [setGuest])
    return null
}

describe('Protected component', () => {
    test('renders fallback when not authenticated', async () => {
        render(
            <AuthProvider>
                <Protected fallback={<p>Login needed</p>}>
                    <p>Secret</p>
                </Protected>
            </AuthProvider>
        )
        const fallback = await screen.findByText(/Login needed/i)
        expect(fallback).toBeInTheDocument()
    })

    test('guest flag can be set without crashing', async () => {
        render(
            <AuthProvider>
                <GuestSetter />
                <Protected fallback={<p>Login needed</p>}>
                    <p>Secret</p>
                </Protected>
            </AuthProvider>
        )
        const fallback = await screen.findByText(/Login needed/i)
        expect(fallback).toBeInTheDocument()
    })
})
