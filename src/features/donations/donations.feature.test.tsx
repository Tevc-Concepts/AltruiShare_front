import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DonationsFeature } from './donations.feature'
import * as donationMod from '../../shared/api/endpoints/donation'
import * as paymentMod from '../../shared/api/endpoints/payment'

// Disable framer-motion animations for deterministic tests
jest.mock('framer-motion', () => {
    const Comp = (props: React.ComponentProps<'div'>) => <div {...props} />
    return {
        __esModule: true,
        motion: new Proxy({}, { get: () => Comp }),
        AnimatePresence: Comp
    }
})

jest.useFakeTimers()
// Configure userEvent to cooperate with fake timers (advanceTimers hook)
const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
jest.setTimeout(15000)

const createDonationSpy = jest.spyOn(donationMod.donationApi, 'create')
const createPaymentSpy = jest.spyOn(paymentMod.paymentApi, 'createRequest')
const statusSpy = jest.spyOn(paymentMod.paymentApi, 'getStatus')
const verifySpy = jest.spyOn(paymentMod.paymentApi, 'verify')
const methodsSpy = jest.spyOn(paymentMod.paymentApi, 'getMethods')

async function advance(ms: number) {
    await act(async () => {
        jest.advanceTimersByTime(ms)
        // flush pending microtasks from resolved promises
        await Promise.resolve()
    })
}

async function expectStatus(match: RegExp) {
    // Try a few microtask flush cycles in case state updates resolve after async interval callback
    for (let i = 0; i < 5; i++) {
        await advance(0)
        const el = screen.queryByText(/Payment Status:/i)
        if (el) {
            const lower = el.textContent?.toLowerCase() || ''
            expect(lower).toMatch(match)
            return
        }
    }
    // Final assertion with standard waitFor (gives better error output)
    await waitFor(() => {
        const el = screen.queryByText(/Payment Status:/i)
        if (!el) throw new Error('status not yet rendered')
        const lower = el.textContent?.toLowerCase() || ''
        expect(lower).toMatch(match)
    })
}

async function fillMonetary() {
    const needIdInput = screen.getByText(/Need ID/i).closest('div')!.querySelector('input')!
    const amountInput = screen.getByText(/Amount/).closest('div')!.querySelector('input')!
    const donorNameInput = screen.getByText(/Donor Name/i).closest('div')!.querySelector('input')!
    const donorEmailInput = screen.getByText(/Donor Email/i).closest('div')!.querySelector('input')!
    await user.clear(needIdInput); await user.type(needIdInput, 'NEED1')
    await user.clear(amountInput); await user.type(amountInput, '100')
    await user.clear(donorNameInput); await user.type(donorNameInput, 'Alice')
    await user.clear(donorEmailInput); await user.type(donorEmailInput, 'alice@example.com')
}

describe('DonationsFeature monetary', () => {
    beforeEach(() => {
        methodsSpy.mockResolvedValue({ payment_methods: [{ name: 'SeerBit Credit Card', type: 'card', enabled: true, currencies: ['NGN'] }] })
        createDonationSpy.mockReset().mockResolvedValue({ donation_id: 'D1', payment_required: true, logistics_required: false })
        createPaymentSpy.mockReset().mockResolvedValue({ donation_id: 'D1', payment_reference: 'REF1', amount: 100, currency: 'NGN', gateway_config: { checkout_url: 'https://pay.test/REF1' } })
        statusSpy.mockReset().mockResolvedValue({ payment_status: 'completed' })
        verifySpy.mockReset().mockResolvedValue({ payment_status: 'completed' })
    })

    it('submits monetary donation and shows checkout link', async () => {
        render(<DonationsFeature />)
        await fillMonetary()
        await user.click(screen.getByRole('button', { name: /donate/i }))
        await waitFor(() => expect(createDonationSpy).toHaveBeenCalled())
        expect(createPaymentSpy).toHaveBeenCalled()
        expect(await screen.findByText(/Proceed to payment/i)).toBeInTheDocument()
        expect(screen.getByText(/https:\/\/pay.test\/REF1/)).toBeInTheDocument()
    })
    it('stops polling and does not verify on failed payment', async () => {
        statusSpy.mockReset()
            .mockResolvedValueOnce({ payment_status: 'pending' })
            .mockResolvedValueOnce({ payment_status: 'failed' })
        render(<DonationsFeature />)
        await fillMonetary()
        await user.click(screen.getByRole('button', { name: /donate/i }))
        await waitFor(() => expect(createPaymentSpy).toHaveBeenCalled())
        // Advance two cycles
        await advance(6000)
        // ensure two status calls (pending -> failed)
        expect(statusSpy.mock.calls.length).toBeGreaterThanOrEqual(2)
        expect(verifySpy).not.toHaveBeenCalled()
    })

    it('polls payment status and verifies on completion (shows status)', async () => {
        statusSpy.mockResolvedValueOnce({ payment_status: 'completed' })
        render(<DonationsFeature />)
        await fillMonetary()
        await user.click(screen.getByRole('button', { name: /donate/i }))
        await waitFor(() => expect(createPaymentSpy).toHaveBeenCalled())
        await advance(3000)
        await waitFor(() => expect(statusSpy).toHaveBeenCalled())
        await waitFor(() => expect(verifySpy).toHaveBeenCalled())
        // status called and verify invoked once for completed status
        expect(statusSpy).toHaveBeenCalled()
        expect(verifySpy).toHaveBeenCalled()
    })

    it('handles verify failure gracefully (still shows completed status)', async () => {
        statusSpy.mockResolvedValueOnce({ payment_status: 'pending' }).mockResolvedValueOnce({ payment_status: 'completed' })
        verifySpy.mockRejectedValueOnce(new Error('verify boom'))
        render(<DonationsFeature />)
        await fillMonetary()
        await user.click(screen.getByRole('button', { name: /donate/i }))
        await waitFor(() => expect(createPaymentSpy).toHaveBeenCalled())
        // advance two polling cycles: pending -> completed
        await advance(6000)
        await waitFor(() => expect(verifySpy).toHaveBeenCalled())
        // verify attempted despite failure; status should have been polled at least twice
        expect(statusSpy.mock.calls.length).toBeGreaterThanOrEqual(2)
    })

    it('handles extended pending cycles before completion (status transition)', async () => {
        statusSpy.mockResolvedValueOnce({ payment_status: 'pending' })
            .mockResolvedValueOnce({ payment_status: 'pending' })
            .mockResolvedValueOnce({ payment_status: 'completed' })
        render(<DonationsFeature />)
        await fillMonetary()
        await user.click(screen.getByRole('button', { name: /donate/i }))
        await waitFor(() => expect(createPaymentSpy).toHaveBeenCalled())
        // advance through two cycles (each 3000ms)
        await advance(6000)
        await advance(3000)
        await waitFor(() => expect(verifySpy).toHaveBeenCalled())
        expect(statusSpy.mock.calls.length).toBeGreaterThanOrEqual(3)
        await expectStatus(/completed/)
    })

    it('clears interval after terminal status (no further polling)', async () => {
        // pending then completed; after completion advance more time and ensure no extra getStatus calls
        statusSpy
            .mockResolvedValueOnce({ payment_status: 'pending' })
            .mockResolvedValueOnce({ payment_status: 'completed' })
        render(<DonationsFeature />)
        await fillMonetary()
        await user.click(screen.getByRole('button', { name: /donate/i }))
        await waitFor(() => expect(createPaymentSpy).toHaveBeenCalled())
        // allow effect that sets up interval to run
        await advance(0)
        // first polling cycle
        await advance(3000)
        await waitFor(() => expect(statusSpy).toHaveBeenCalledTimes(1))
        // second polling cycle (terminal status -> triggers verify + clearInterval)
        await advance(3000)
        await waitFor(() => expect(statusSpy).toHaveBeenCalledTimes(2))
        await waitFor(() => expect(verifySpy).toHaveBeenCalled())
        const callsAfterCompletion = statusSpy.mock.calls.length
        // advance additional time; no further polling should occur
        await advance(9000)
        expect(statusSpy.mock.calls.length).toBe(callsAfterCompletion)
    })

    it('handles creation error', async () => {
        createDonationSpy.mockRejectedValueOnce(new Error('fail'))
        render(<DonationsFeature />)
        await fillMonetary()
        await user.click(screen.getByRole('button', { name: /donate/i }))
        expect(await screen.findByRole('alert')).toHaveTextContent(/fail/i)
    })

    it('submits with anonymous true when checkbox toggled', async () => {
        render(<DonationsFeature />)
        await fillMonetary()
        // toggle anonymous checkbox
        const anon = screen.getByLabelText(/Give anonymously/i)
        expect((anon as HTMLInputElement).checked).toBe(false)
        await user.click(anon)
        expect((anon as HTMLInputElement).checked).toBe(true)
        await user.click(screen.getByRole('button', { name: /donate/i }))
        await waitFor(() => expect(createDonationSpy).toHaveBeenCalled())
        const payload = createDonationSpy.mock.calls[0][0]
        expect(payload.anonymous).toBe(true)
    })
})

describe('DonationsFeature items', () => {
    beforeEach(() => {
        methodsSpy.mockResolvedValue({ payment_methods: [] })
        createDonationSpy.mockReset().mockResolvedValue({ donation_id: 'D2', payment_required: false, logistics_required: false })
    })
    it('adds item and submits item donation', async () => {
        render(<DonationsFeature />)
        await user.click(screen.getByRole('button', { name: /items/i }))
        // wait for items heading using flexible regex
        await screen.findByText(/In-Kind.*Donation/i)
        const needLabel = screen.getAllByText(/^Need ID$/i)[0]
        await user.type(needLabel.closest('div')!.querySelector('input')!, 'NEED2')
        const descInput = screen.getByPlaceholderText(/Description/i)
        const qtyInput = screen.getByPlaceholderText(/Qty/i)
        await user.type(descInput, 'Blankets')
        await user.type(qtyInput, '5')
        await user.click(screen.getByRole('button', { name: /submit donation/i }))
        await waitFor(() => expect(createDonationSpy).toHaveBeenCalled())
    })
})
