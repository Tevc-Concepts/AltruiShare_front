import React from 'react';
import { motion } from 'framer-motion';

export interface FeatureItem { title: string; description: string; icon?: React.ReactNode }

export const FeatureGrid: React.FC<{ items: FeatureItem[] }> = ({ items }) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }} className="rounded-2xl p-6 bg-white/70 dark:bg-neutral-900/60 backdrop-blur border border-white/30 dark:border-white/10 shadow-soft hover:shadow-elevated transition focus-within:ring-2 focus-within:ring-brand-indigo/60" tabIndex={0}>
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-indigo to-brand-pink text-white flex items-center justify-center font-semibold text-sm shadow-glow-pink">
                        {f.icon || f.title.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-brand-indigo text-lg">
                        {f.title}
                    </h3>
                </div>
                <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{f.description}</p>
            </motion.div>
        ))}
    </div>
);

export interface RoleMatrixEntry { role: string; capabilities: Record<string, boolean> }

export const RoleMatrix: React.FC<{ entries: RoleMatrixEntry[]; capabilityOrder: string[] }> = ({ entries, capabilityOrder }) => {
    return (
        <div className="overflow-x-auto rounded-2xl border border-white/20 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 backdrop-blur shadow-soft">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="bg-gradient-to-r from-brand-indigo/20 via-brand-purple/20 to-brand-pink/20 text-left">
                        <th className="px-4 py-3 font-semibold">Role</th>
                        {capabilityOrder.map(cap => (
                            <th key={cap} className="px-4 py-3 font-semibold whitespace-nowrap align-bottom">{cap}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {entries.map((row, i) => (
                        <tr key={row.role} className={i % 2 ? 'bg-white/40 dark:bg-neutral-800/40' : ''}>
                            <th scope="row" className="px-4 py-3 font-medium text-brand-indigo whitespace-nowrap">{row.role}</th>
                            {capabilityOrder.map(cap => (
                                <td key={cap} className="px-4 py-3 text-center">
                                    <span aria-label={row.capabilities[cap] ? 'Yes' : 'No'} className={`inline-block h-3 w-3 rounded-full ${row.capabilities[cap] ? 'bg-brand-indigo shadow-glow-indigo' : 'bg-neutral-300 dark:bg-neutral-700'} `} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FeatureGrid;
