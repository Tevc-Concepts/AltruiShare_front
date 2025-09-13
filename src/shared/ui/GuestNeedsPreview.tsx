"use client";
import React from 'react';
import { useAuth } from '../context/AuthProvider';

const sampleNeeds = [
    { id: 'sample-1', title: 'Warm Blankets for Shelter', status: 'Open', impact: 'Helps 40 families stay warm' },
    { id: 'sample-2', title: 'School Supplies', status: 'Open', impact: 'Supports 120 students' },
    { id: 'sample-3', title: 'Medical Kits', status: 'Pending', impact: 'Improves first-aid readiness' }
];

export const GuestNeedsPreview: React.FC = () => {
    const { user, guest, setGuest } = useAuth();
    if (user) return null;
    return (
        <div className="mt-12 rounded-2xl border border-brand-indigo/30 bg-white/70 dark:bg-neutral-900/70 backdrop-blur p-6 shadow-soft" aria-labelledby="guest-preview-heading">
            <div className="flex items-center justify-between gap-4">
                <h3 id="guest-preview-heading" className="font-semibold text-brand-indigo">Sample Open Needs (Guest Preview)</h3>
                {!guest && <button onClick={() => setGuest(true)} className="text-xs px-3 py-1 rounded-full bg-brand-indigo text-white shadow-soft hover:shadow-glow-indigo focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo/70">Enable Guest Mode</button>}
            </div>
            <ul className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
                {sampleNeeds.map(n => (
                    <li key={n.id} className="rounded-xl p-4 bg-gradient-to-br from-white/90 to-white/60 dark:from-neutral-800/80 dark:to-neutral-800/60 border border-white/40 dark:border-white/10 shadow-soft">
                        <h4 className="font-medium text-brand-purple mb-1">{n.title}</h4>
                        <p className="text-neutral-600 dark:text-neutral-300 text-xs">{n.impact}</p>
                        <span className="inline-block mt-2 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-brand-indigo/15 text-brand-indigo">{n.status}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GuestNeedsPreview;
