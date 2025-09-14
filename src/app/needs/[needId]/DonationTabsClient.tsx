"use client"
import React, { useState } from 'react'
import { DonationFormMonetary } from '../../../features/donations/components/DonationFormMonetary'
import { ItemDonationForm } from '../../../features/donations/components/ItemDonationForm'

export default function DonationTabs({ needId }: { needId: string }) {
    const [tab, setTab] = useState<'monetary' | 'items'>('monetary')
    return (
        <div className="space-y-6">
            <div className="flex gap-2 text-xs">
                <button
                    onClick={() => setTab('monetary')}
                    className={`px-4 py-1.5 rounded-full font-medium transition shadow-sm ${tab === 'monetary' ? 'bg-gradient-to-r from-amber-500 to-coral-500 text-white shadow-coral/30' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'}`}
                >Monetary</button>
                <button
                    onClick={() => setTab('items')}
                    className={`px-4 py-1.5 rounded-full font-medium transition shadow-sm ${tab === 'items' ? 'bg-gradient-to-r from-emerald to-teal text-white shadow-emerald/30' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'}`}
                >Items</button>
            </div>
            {tab === 'monetary' && <DonationFormMonetary needId={needId} />}
            {tab === 'items' && <ItemDonationForm needId={needId} />}
        </div>
    )
}
