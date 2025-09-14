"use client"
import React, { useState, useEffect } from 'react'
import { donationApi } from '../../../shared/api/endpoints/donation'
import { paymentApi, PaymentRequest } from '../../../shared/api/endpoints/payment'
import { Input } from '../../../shared/ui/input'
import { Button } from '../../../shared/ui/button'

interface Props { needId: string; onSuccess?: (donationId: string) => void }

export function DonationFormMonetary({ needId, onSuccess }: Props) {
    const [amount, setAmount] = useState('')
    const [donorName, setDonorName] = useState('')
    const [donorEmail, setDonorEmail] = useState('')
    const [anonymous, setAnonymous] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [payment, setPayment] = useState<PaymentRequest | null>(null)
    const [status, setStatus] = useState<string | null>(null)

    // basic polling for payment status when pending
    useEffect(() => {
        if (!payment) return
        let active = true
        const interval = setInterval(async () => {
            if (!active || !payment) return
            try {
                const res = await paymentApi.getStatus(payment.payment_reference)
                if (!active) return
                setStatus(res.payment_status)
                const terminal = ['completed', 'failed', 'canceled']
                if (terminal.includes(res.payment_status.toLowerCase())) {
                    if (res.payment_status.toLowerCase() === 'completed') {
                        try { await paymentApi.verify(payment.payment_reference) } catch { /* ignore */ }
                    }
                    clearInterval(interval)
                }
            } catch { /* ignore */ }
        }, 3000)
            // fire an immediate status fetch
            ; (async () => {
                try {
                    const res = await paymentApi.getStatus(payment.payment_reference)
                    if (!active) return
                    setStatus(res.payment_status)
                } catch { /* ignore */ }
            })()
        return () => { active = false; clearInterval(interval) }
    }, [payment])

    const quickPresets = ["1000", "5000", "10000"]

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            const donation = await donationApi.create({ need_id: needId, donation_type: 'Monetary', amount: Number(amount), anonymous })
            if (donation.payment_required) {
                const req = await paymentApi.createRequest({
                    amount: Number(amount),
                    currency: 'NGN',
                    payment_method: 'SeerBit Credit Card',
                    donor_email: donorEmail,
                    donor_name: donorName,
                    need_id: needId
                })
                setPayment(req)
            }
            onSuccess?.(donation.donation_id)
        } catch (err) {
            setError((err as Error)?.message || 'Failed to create donation')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="block text-xs font-medium mb-1">Amount (NGN)</label>
                <Input value={amount} onChange={e => setAmount(e.target.value)} required type="number" min={1} placeholder="Enter amount" />
                <div className="flex gap-2 mt-2">
                    {quickPresets.map(p => (
                        <button type="button" key={p} onClick={() => setAmount(p)} className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-800/30 dark:text-amber-300">
                            {Number(p).toLocaleString()}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium mb-1">Donor Name</label>
                    <Input value={donorName} onChange={e => setDonorName(e.target.value)} required placeholder="Jane Doe" />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1">Donor Email</label>
                    <Input value={donorEmail} onChange={e => setDonorEmail(e.target.value)} required type="email" placeholder="jane@example.com" />
                </div>
            </div>
            <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} />
                <span>Give anonymously</span>
            </label>
            {error && <div role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</div>}
            <Button disabled={submitting} type="submit">{submitting ? 'Processing...' : 'Donate'}</Button>
            {payment && (
                <div className="mt-4 p-3 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-xs space-y-1">
                    <p className="font-medium">Proceed to payment:</p>
                    {payment.gateway_config?.checkout_url && <p className="break-all">{payment.gateway_config.checkout_url}</p>}
                    {status && <p className="mt-2 font-medium">Payment Status: <span className="capitalize">{status}</span></p>}
                </div>
            )}
        </form>
    )
}
