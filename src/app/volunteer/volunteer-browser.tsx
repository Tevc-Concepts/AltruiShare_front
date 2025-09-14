"use client"
import React, { useState } from 'react'
import { VolunteerList } from '../../features/volunteer/components/VolunteerList'
import { VolunteerDetail } from '../../features/volunteer/components/VolunteerDetail'

export default function VolunteerBrowser() {
    const [selected, setSelected] = useState<string | null>(null)
    return (
        <div className="grid gap-8 md:grid-cols-5 items-start">
            <div className="md:col-span-2">
                <VolunteerList onSelect={id => setSelected(id)} />
            </div>
            <div className="md:col-span-3">
                {selected ? (
                    <VolunteerDetail id={selected} onClose={() => setSelected(null)} />
                ) : <p className="text-sm text-neutral-500">Select an opportunity to view details.</p>}
            </div>
        </div>
    )
}
