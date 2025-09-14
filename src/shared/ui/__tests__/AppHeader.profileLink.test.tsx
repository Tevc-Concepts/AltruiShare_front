import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders, waitForAuthSettled } from '../../../test/utils/renderWithProviders'
import AppHeader from '../AppHeader'

describe('AppHeader Profile link visibility', () => {
    function openMobileMenu() {
        const toggle = screen.getByLabelText(/toggle navigation/i)
        fireEvent.click(toggle)
    }

    it('does not show Profile link when unauthenticated (desktop)', () => {
        renderWithProviders(<AppHeader />)
        expect(screen.queryByText('Profile')).not.toBeInTheDocument()
    })

    it('shows Profile link when authenticated (desktop)', async () => {
        renderWithProviders(<AppHeader />, { user: { id: 'u1', email: 'user@test' } })
        await waitForAuthSettled()
        const links = screen.getAllByText('Profile')
        expect(links.length).toBeGreaterThanOrEqual(1)
    })

    it('mobile menu includes Profile only when authenticated', async () => {
        // Unauthenticated first
        renderWithProviders(<AppHeader />)
        openMobileMenu()
        expect(screen.queryByText('Profile')).not.toBeInTheDocument()
    })

    it('mobile menu shows Profile after authenticated render', async () => {
        renderWithProviders(<AppHeader />, { user: { id: 'u2', email: 'user2@test' } })
        await waitForAuthSettled()
        openMobileMenu()
        const links = screen.getAllByText('Profile')
        expect(links.length).toBeGreaterThanOrEqual(1)
    })
})
