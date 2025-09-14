import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../test/utils/renderWithProviders'
import { VolunteerList } from './VolunteerList'
import { VolunteerDetail } from './VolunteerDetail'

jest.mock('../../../shared/api/endpoints/volunteer', () => {
    return {
        volunteerApi: {
            list: jest.fn(),
            get: jest.fn(),
            signup: jest.fn()
        }
    }
})

// Re-import after mock so types are aligned
import { volunteerApi } from '../../../shared/api/endpoints/volunteer'

describe('Volunteer feature components', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('VolunteerList loads and renders opportunities and selection works', async () => {
        ; (volunteerApi.list as jest.Mock).mockResolvedValueOnce([
            { id: 'opp1', title: 'Food Packing', remote: true, required_skills: ['Teamwork', 'Packing'] },
            { id: 'opp2', title: 'Community Outreach', location: 'Downtown', required_skills: ['Communication'] }
        ])
        const onSelect = jest.fn()
        renderWithProviders(<VolunteerList onSelect={onSelect} />, { user: { id: 'u1', email: 'user@test' } })

        expect(screen.getByText(/Loading opportunities/i)).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByText('Food Packing')).toBeInTheDocument()
            expect(screen.getByText('Community Outreach')).toBeInTheDocument()
        })

        fireEvent.click(screen.getByRole('button', { name: /Food Packing/i }))
        expect(onSelect).toHaveBeenCalledWith('opp1')
    })

    it('VolunteerDetail loads, allows signup, and updates state', async () => {
        ; (volunteerApi.get as jest.Mock).mockResolvedValueOnce({
            id: 'opp1',
            title: 'Food Packing',
            description: 'Help pack food boxes.',
            capacity: 10,
            filled: 2,
            required_skills: ['Teamwork']
        })
            ; (volunteerApi.signup as jest.Mock).mockResolvedValueOnce({ opportunity_id: 'opp1', status: 'registered' })

        renderWithProviders(<VolunteerDetail id="opp1" onClose={() => { }} />, { user: { id: 'u1', email: 'user@test' } })

        expect(screen.getByText(/Loading/)).toBeInTheDocument()

        await waitFor(() => expect(screen.getByRole('heading', { name: 'Food Packing' })).toBeInTheDocument())

        const btn = screen.getByRole('button', { name: /Sign Up/i })
        fireEvent.click(btn)
        expect(volunteerApi.signup).toHaveBeenCalledWith('opp1')

        await waitFor(() => expect(screen.getByRole('button', { name: /Registered/i })).toBeInTheDocument())
    })

    it('VolunteerDetail shows login prompt if user not logged in', async () => {
        ; (volunteerApi.get as jest.Mock).mockResolvedValueOnce({
            id: 'opp2',
            title: 'Outreach',
            description: 'Talk to community members.'
        })

        renderWithProviders(<VolunteerDetail id="opp2" onClose={() => { }} />)

        await waitFor(() => screen.getByRole('heading', { name: 'Outreach' }))
        expect(screen.getByText(/Log in to sign up/i)).toBeInTheDocument()
    })
})
