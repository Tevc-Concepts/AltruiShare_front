import { render, screen } from '@testing-library/react'
import React from 'react'
import NeedDetailPage from '../needs/[needId]/page'
import * as needMod from '../../shared/api/endpoints/need'
import * as donationMod from '../../shared/api/endpoints/donation'
import * as paymentMod from '../../shared/api/endpoints/payment'
import * as authMod from '../../shared/api/endpoints/auth'
import { AuthProvider } from '../../shared/context/AuthProvider'

jest.mock('next/navigation', () => ({
    useParams: () => ({ needId: 'NEED-1' }),
    usePathname: () => '/needs/NEED-1'
}))

describe('Need Detail Integration', () => {
    const getByIdSpy = jest.spyOn(needMod.needApi, 'getById')
    const createDonationSpy = jest.spyOn(donationMod.donationApi, 'create')
    const createPaymentSpy = jest.spyOn(paymentMod.paymentApi, 'createRequest')

    beforeEach(() => {
        getByIdSpy.mockResolvedValue({ id: 'NEED-1', title: 'Water Kits', description: 'Provide clean water kits', status: 'Active', percentage: 40 })
        createDonationSpy.mockResolvedValue({ donation_id: 'DON-1', payment_required: true, logistics_required: false })
        createPaymentSpy.mockResolvedValue({ donation_id: 'DON-1', payment_reference: 'REFX', amount: 1000, currency: 'NGN', gateway_config: { checkout_url: 'https://pay/REFX' } })
    })

    it('renders need details and donation form (SSR simulation)', async () => {
        // Mock authenticated user so Protected child renders
        jest.spyOn(authMod.authApi, 'getLoggedUser').mockResolvedValueOnce({ id: 'U1', email: 'u@test' })
        const Component = await NeedDetailPage({ params: { needId: 'NEED-1' } })
        render(<AuthProvider>{Component as unknown as React.ReactElement}</AuthProvider>)
        expect(await screen.findByText(/Water Kits/)).toBeInTheDocument()
        // Heading always visible; presence confirms section
        expect(screen.getByText(/Donate to this Need/i)).toBeInTheDocument()
    })
})
