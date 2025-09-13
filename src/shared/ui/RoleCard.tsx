"use client";
import { motion } from 'framer-motion';
import React from 'react';

export interface RoleCapability {
    id: string;
    label: string;
}

export interface RoleCardProps {
    role: string;
    description: string;
    capabilities: RoleCapability[];
    onView?: (role: string) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, description, capabilities, onView }) => {
    return (
        <motion.div layout initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group relative rounded-2xl shadow-soft-lg bg-surface-base dark:bg-surface-dark border border-white/20 dark:border-white/10 backdrop-blur p-5 focus-within:ring-2 focus-within:ring-brand-indigo/60">
            <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-brand-indigo/10 via-brand-purple/10 to-brand-pink/10" />
            <h3 className="font-semibold text-brand-indigo text-lg relative z-10">{role}</h3>
            <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300 relative z-10">{description}</p>
            <ul className="mt-3 space-y-1 relative z-10 text-sm" aria-label={`${role} key capabilities`}>
                {capabilities.map(c => (
                    <li key={c.id} className="flex items-start gap-2">
                        <span aria-hidden className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-purple" />
                        <span>{c.label}</span>
                    </li>
                ))}
            </ul>
            <div className="mt-4 relative z-10">
                <button onClick={() => onView?.(role)} className="text-sm font-medium text-brand-purple hover:text-brand-indigo focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/60 rounded-md px-2 py-1">
                    View Role Features
                </button>
            </div>
        </motion.div>
    );
};

export default RoleCard;
