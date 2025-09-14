import React from 'react'
import { renderWithProviders, screen, fireEvent, waitFor } from '../../../test/utils/renderWithProviders'
import { ItemDonationForm } from './ItemDonationForm'
import * as donationMod from '../../../shared/api/endpoints/donation'

describe('ItemDonationForm', () => {
    const needId = 'NEED-123'
    beforeEach(() => {
        jest.spyOn(donationMod.donationApi, 'create').mockResolvedValue({ donation_id: 'D1', payment_required: false, logistics_required: false })
    })
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('validates that description is required for each item', async () => {
        renderWithProviders(<ItemDonationForm needId={needId} />)
        // Clear the default description (form has empty item already)
        const desc = screen.getByPlaceholderText(/e\.g\. blankets/i)
        fireEvent.change(desc, { target: { value: '' } })
        fireEvent.click(screen.getByRole('button', { name: /submit item donation/i }))
        await waitFor(() => expect(screen.getByText(/each item needs a description/i)).toBeInTheDocument())
        expect(donationMod.donationApi.create).not.toHaveBeenCalled()
    })

    it('submits correct payload with one item', async () => {
        const onSuccess = jest.fn()
        renderWithProviders(<ItemDonationForm needId={needId} onSuccess={onSuccess} />)
        const desc = screen.getByPlaceholderText(/e\.g\. blankets/i)
        fireEvent.change(desc, { target: { value: 'Blankets' } })
        fireEvent.click(screen.getByRole('button', { name: /submit item donation/i }))
        await waitFor(() => expect(donationMod.donationApi.create).toHaveBeenCalled())
        const call = (donationMod.donationApi.create as jest.Mock).mock.calls[0][0]
        expect(call.need_id).toBe(needId)
        expect(call.donation_type).toBe('Items')
        expect(call.items[0].description).toBe('Blankets')
        expect(onSuccess).toHaveBeenCalledWith('D1')
    })

    it('adds and removes additional item rows', async () => {
        renderWithProviders(<ItemDonationForm needId={needId} />)
        fireEvent.click(screen.getByRole('button', { name: /add another item/i }))
        const inputs = screen.getAllByPlaceholderText(/e\.g\. blankets/i)
        expect(inputs.length).toBe(2)
        // Remove second
        const removeBtn = screen.getAllByRole('button', { name: /remove/i })[0]
        fireEvent.click(removeBtn)
        expect(screen.getAllByPlaceholderText(/e\.g\. blankets/i).length).toBe(1)
    })
})
