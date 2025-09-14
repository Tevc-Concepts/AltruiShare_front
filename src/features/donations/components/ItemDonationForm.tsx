"use client"
import React, { useState } from 'react'
import { donationApi, DonationItem } from '../../../shared/api/endpoints/donation'
import { Button } from '../../../shared/ui/button'
import { Input } from '../../../shared/ui/input'

interface Props { needId: string; onSuccess?: (donationId: string) => void }

interface ItemRow extends Omit<DonationItem, 'type'> {
    id: string
    type: string
}

const emptyItem = (): ItemRow => ({ id: crypto.randomUUID(), type: 'Generic', description: '', quantity: 1, unit: 'unit', condition: '' })

export const ItemDonationForm: React.FC<Props> = ({ needId, onSuccess }) => {
    const [items, setItems] = useState<ItemRow[]>([emptyItem()])
    const [anonymous, setAnonymous] = useState(false)
    const [notes, setNotes] = useState('')
    const [pickupRequired, setPickupRequired] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const addItem = () => setItems(i => [...i, emptyItem()])
    const updateItem = (id: string, patch: Partial<ItemRow>) => setItems(curr => curr.map(it => it.id === id ? { ...it, ...patch } : it))
    const removeItem = (id: string) => setItems(curr => curr.length === 1 ? curr : curr.filter(i => i.id !== id))

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        if (items.some(i => !i.description.trim())) {
            setError('Each item needs a description.')
            return
        }
        setSubmitting(true)
        try {
            const payloadItems: DonationItem[] = items.map(({ description, quantity, unit, condition, type }) => ({ description, quantity: Number(quantity), unit, condition, type }))
            const res = await donationApi.create({ need_id: needId, donation_type: 'Items', items: payloadItems, anonymous, notes, pickup_required: pickupRequired })
            onSuccess?.(res.donation_id)
            setItems([emptyItem()])
            setNotes('')
        } catch (err) {
            setError((err as Error).message || 'Failed to create item donation')
        } finally { setSubmitting(false) }
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="space-y-4">
                {items.map((item, idx) => (
                    <div key={item.id} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 space-y-3 relative">
                        <div className="grid sm:grid-cols-5 gap-3">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium mb-1">Description</label>
                                <Input value={item.description} onChange={e => updateItem(item.id, { description: e.target.value })} placeholder="e.g. Blankets" aria-required="true" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Quantity</label>
                                <Input type="number" min={1} value={item.quantity}
                                    onChange={e => updateItem(item.id, { quantity: Number(e.target.value) })} required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Unit</label>
                                <Input value={item.unit} onChange={e => updateItem(item.id, { unit: e.target.value })} placeholder="pcs" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Condition</label>
                                <Input value={item.condition} onChange={e => updateItem(item.id, { condition: e.target.value })} placeholder="New / Good" />
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-neutral-500">
                            <span>Item #{idx + 1}</span>
                            {items.length > 1 && (
                                <button type="button" onClick={() => removeItem(item.id)} className="text-coral-600 hover:underline">Remove</button>
                            )}
                        </div>
                    </div>
                ))}
                <div>
                    <button type="button" onClick={addItem} className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-800/40 dark:text-emerald-300">+ Add another item</button>
                </div>
            </div>
            <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} /> Anonymous donation
                </label>
                <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={pickupRequired} onChange={e => setPickupRequired(e.target.checked)} /> Pickup required
                </label>
                <div>
                    <label className="block text-xs font-medium mb-1">Notes (optional)</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm p-2 h-20" />
                </div>
            </div>
            {error && <div role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</div>}
            <Button disabled={submitting} type="submit">{submitting ? 'Submitting...' : 'Submit Item Donation'}</Button>
        </form>
    )
}
