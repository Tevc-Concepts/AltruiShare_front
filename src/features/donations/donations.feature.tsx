"use client"
import { useState, useEffect } from 'react'
import { Button } from '../../shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/ui/card'
import { Input } from '../../shared/ui/input'
import { donationApi } from '../../shared/api/endpoints/donation'
import { paymentApi } from '../../shared/api/endpoints/payment'
import { motion, AnimatePresence } from 'framer-motion'

interface MonetaryFormState {
    need_id: string
    amount: string
    payment_method: string
    anonymous: boolean
    donor_name: string
    donor_email: string
    currency: string
}

interface ItemFormState {
    need_id: string
    anonymous: boolean
    items: { description: string; quantity: string; unit: string; type: string; condition: string }[]
}

const defaultMonetary: MonetaryFormState = {
    need_id: '',
    amount: '',
    payment_method: 'SeerBit Credit Card',
    anonymous: false,
    donor_name: '',
    donor_email: '',
    currency: 'NGN'
}

const defaultItem: ItemFormState = {
    need_id: '',
    anonymous: false,
    items: [{ description: '', quantity: '', unit: 'Nos', type: 'General', condition: 'New' }]
}

export const DonationsFeature = () => {
    const [tab, setTab] = useState<'monetary' | 'items'>('monetary')
    const [monetary, setMonetary] = useState(defaultMonetary)
    const [itemForm, setItemForm] = useState(defaultItem)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [paymentRef, setPaymentRef] = useState<string | null>(null)
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
    const [methods, setMethods] = useState<{ name: string }[]>([])
    const [poller, setPoller] = useState<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        paymentApi.getMethods().then(res => setMethods(res.payment_methods || [])).catch(() => { })
    }, [])

    useEffect(() => {
        if (paymentRef && !paymentStatus) {
            const interval = setInterval(async () => {
                try {
                    const statusRes = await paymentApi.getStatus(paymentRef)
                    if (statusRes.payment_status) {
                        setPaymentStatus(statusRes.payment_status)
                        if (['completed', 'failed', 'success'].includes(statusRes.payment_status.toLowerCase())) {
                            clearInterval(interval)
                            setPoller(null)
                            try { await paymentApi.verify(paymentRef) } catch { }
                        }
                    }
                } catch { }
            }, 3000)
            setPoller(interval)
        }
        return () => {
            if (poller) clearInterval(poller)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentRef])

    const submitMonetary = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            // Create donation first
            await donationApi.create({
                need_id: monetary.need_id,
                donation_type: 'Monetary',
                amount: parseFloat(monetary.amount),
                anonymous: monetary.anonymous
            })
            // Create payment request
            const payReq = await paymentApi.createRequest({
                amount: parseFloat(monetary.amount),
                currency: monetary.currency,
                payment_method: monetary.payment_method,
                donor_email: monetary.donor_email,
                donor_name: monetary.donor_name,
                need_id: monetary.need_id,
                callback_url: typeof window !== 'undefined' ? `${window.location.origin}/payment/callback` : undefined
            })
            if (payReq.payment_reference) setPaymentRef(payReq.payment_reference)
            // Some payment gateways return an optional gateway_config with a checkout_url
            const maybeConfig = (payReq as unknown as { gateway_config?: { checkout_url?: string } }).gateway_config
            setCheckoutUrl(maybeConfig?.checkout_url || null)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to create donation')
        } finally {
            setSubmitting(false)
        }
    }

    const submitItems = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            await donationApi.create({
                need_id: itemForm.need_id,
                donation_type: 'Items',
                items: itemForm.items.map(it => ({
                    description: it.description,
                    quantity: parseFloat(it.quantity),
                    unit: it.unit,
                    type: it.type,
                    condition: it.condition
                })),
                anonymous: itemForm.anonymous
            })
            setItemForm(defaultItem)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to create item donation')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section>
            <h1 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-brand-hero">Make a Donation</h1>
            <div className="flex gap-3 mb-6">
                <Button variant={tab === 'monetary' ? 'primary' : 'secondary'} onClick={() => setTab('monetary')} size="sm">Monetary</Button>
                <Button variant={tab === 'items' ? 'primary' : 'secondary'} onClick={() => setTab('items')} size="sm">Items</Button>
            </div>
            {error && <p className="text-sm text-red-600 mb-4" role="alert">{error}</p>}
            <AnimatePresence mode="wait">
                {tab === 'monetary' && (
                    <motion.div key="monetary" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Monetary Donation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submitMonetary} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Need ID</label>
                                            <Input required value={monetary.need_id} onChange={e => setMonetary(m => ({ ...m, need_id: e.target.value }))} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Amount ({monetary.currency})</label>
                                            <Input required type="number" min={1} value={monetary.amount} onChange={e => setMonetary(m => ({ ...m, amount: e.target.value }))} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Donor Name</label>
                                            <Input required value={monetary.donor_name} onChange={e => setMonetary(m => ({ ...m, donor_name: e.target.value }))} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Donor Email</label>
                                            <Input required type="email" value={monetary.donor_email} onChange={e => setMonetary(m => ({ ...m, donor_email: e.target.value }))} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Payment Method</label>
                                            <select className="h-10 w-full rounded-xl2 border border-brand-indigo/30 bg-white/70 dark:bg-neutral-900/60 px-3 text-sm" value={monetary.payment_method} onChange={e => setMonetary(m => ({ ...m, payment_method: e.target.value }))}>
                                                {methods.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Currency</label>
                                            <select className="h-10 w-full rounded-xl2 border border-brand-indigo/30 bg-white/70 dark:bg-neutral-900/60 px-3 text-sm" value={monetary.currency} onChange={e => setMonetary(m => ({ ...m, currency: e.target.value }))}>
                                                <option value="NGN">NGN</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                                <option value="GBP">GBP</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input id="anon" type="checkbox" checked={monetary.anonymous} onChange={e => setMonetary(m => ({ ...m, anonymous: e.target.checked }))} />
                                        <label htmlFor="anon" className="text-xs">Give anonymously</label>
                                    </div>
                                    <Button type="submit" loading={submitting}>Donate</Button>
                                </form>
                                {checkoutUrl && (
                                    <div className="mt-6 space-y-2">
                                        <p className="text-sm">Proceed to payment:</p>
                                        <a href={checkoutUrl} target="_blank" rel="noopener" className="text-brand-indigo underline break-all">{checkoutUrl}</a>
                                        {paymentStatus && <p className="text-sm">Payment Status: <span className="font-medium capitalize">{paymentStatus}</span></p>}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
                {tab === 'items' && (
                    <motion.div key="items" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Card>
                            <CardHeader>
                                <CardTitle>In-Kind (Items) Donation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submitItems} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium mb-1">Need ID</label>
                                        <Input required value={itemForm.need_id} onChange={e => setItemForm(f => ({ ...f, need_id: e.target.value }))} />
                                    </div>
                                    <div className="space-y-3">
                                        {itemForm.items.map((it, idx) => (
                                            <div key={idx} className="grid md:grid-cols-5 gap-2 items-end">
                                                <Input placeholder="Description" value={it.description} onChange={e => setItemForm(f => ({ ...f, items: f.items.map((v, i2) => i2 === idx ? { ...v, description: e.target.value } : v) }))} />
                                                <Input type="number" min={1} placeholder="Qty" value={it.quantity} onChange={e => setItemForm(f => ({ ...f, items: f.items.map((v, i2) => i2 === idx ? { ...v, quantity: e.target.value } : v) }))} />
                                                <Input placeholder="Unit" value={it.unit} onChange={e => setItemForm(f => ({ ...f, items: f.items.map((v, i2) => i2 === idx ? { ...v, unit: e.target.value } : v) }))} />
                                                <Input placeholder="Type" value={it.type} onChange={e => setItemForm(f => ({ ...f, items: f.items.map((v, i2) => i2 === idx ? { ...v, type: e.target.value } : v) }))} />
                                                <Input placeholder="Condition" value={it.condition} onChange={e => setItemForm(f => ({ ...f, items: f.items.map((v, i2) => i2 === idx ? { ...v, condition: e.target.value } : v) }))} />
                                            </div>
                                        ))}
                                        <Button type="button" variant="ghost" size="sm" onClick={() => setItemForm(f => ({ ...f, items: [...f.items, { description: '', quantity: '', unit: 'Nos', type: 'General', condition: 'New' }] }))}>Add Item</Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input id="anon2" type="checkbox" checked={itemForm.anonymous} onChange={e => setItemForm(f => ({ ...f, anonymous: e.target.checked }))} />
                                        <label htmlFor="anon2" className="text-xs">Give anonymously</label>
                                    </div>
                                    <Button type="submit" loading={submitting}>Submit Donation</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
