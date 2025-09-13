"use client";
import React, { useState } from 'react';
import Hero from '../shared/ui/Hero';
import GuestNeedsPreview from '../shared/ui/GuestNeedsPreview';
import { FeatureGrid, RoleMatrix } from '../shared/ui/FeatureGrid';
import RoleCard, { RoleCapability } from '../shared/ui/RoleCard';
import { motion, AnimatePresence } from 'framer-motion';

const featureItems = [
  { title: 'Need Management', description: 'Create, verify and track needs with lifecycle transparency.' },
  { title: 'Donations', description: 'Monetary & in-kind donations with payment verification and tracking.' },
  { title: 'Logistics', description: 'Coordinate fulfillment, allocation and last-mile delivery updates.' },
  { title: 'Volunteers', description: 'Engage volunteers, schedule shifts, log hours and certify impact.' },
  { title: 'Impact Analytics', description: 'Unified dashboard measuring outcomes, SDG alignment and trends.' },
  { title: 'Notifications', description: 'Real-time updates for approvals, status changes and achievements.' }
];

const capabilityOrder = [
  'Create Need', 'Approve Need', 'Create Donation', 'Allocate Resources', 'Log Hours', 'View Analytics'
];

const roleMatrixEntries = [
  { role: 'Individual Donor', capabilities: { 'Create Need': false, 'Approve Need': false, 'Create Donation': true, 'Allocate Resources': false, 'Log Hours': false, 'View Analytics': true } },
  { role: 'Corporate CSR Manager', capabilities: { 'Create Need': true, 'Approve Need': true, 'Create Donation': true, 'Allocate Resources': true, 'Log Hours': false, 'View Analytics': true } },
  { role: 'NGO Program Director', capabilities: { 'Create Need': true, 'Approve Need': true, 'Create Donation': true, 'Allocate Resources': true, 'Log Hours': true, 'View Analytics': true } },
  { role: 'Logistics Manager', capabilities: { 'Create Need': false, 'Approve Need': false, 'Create Donation': false, 'Allocate Resources': true, 'Log Hours': false, 'View Analytics': true } },
  { role: 'Volunteer', capabilities: { 'Create Need': false, 'Approve Need': false, 'Create Donation': false, 'Allocate Resources': false, 'Log Hours': true, 'View Analytics': true } }
];

interface RoleDef { role: string; description: string; capabilities: RoleCapability[]; }
const roles: RoleDef[] = [
  { role: 'Individual Donor', description: 'Contribute funds or goods to verified needs.', capabilities: [{ id: 'donate', label: 'Donate securely' }, { id: 'track', label: 'Track impact' }, { id: 'notifications', label: 'Get status alerts' }] },
  { role: 'Corporate CSR Manager', description: 'Align corporate giving with verified community needs.', capabilities: [{ id: 'bulk', label: 'Bulk donation tools' }, { id: 'analytics', label: 'Advanced analytics' }, { id: 'governance', label: 'Governance workflows' }] },
  { role: 'NGO Program Director', description: 'Publish needs and manage resource allocation.', capabilities: [{ id: 'create', label: 'Create & update needs' }, { id: 'verify', label: 'Verification oversight' }, { id: 'report', label: 'Outcome reporting' }] },
  { role: 'Logistics Manager', description: 'Coordinate distribution and fulfillment logistics.', capabilities: [{ id: 'allocate', label: 'Allocate inventory' }, { id: 'routes', label: 'Optimize routes' }, { id: 'updates', label: 'Real-time status' }] },
  { role: 'Volunteer', description: 'Offer time & expertise to fulfill needs.', capabilities: [{ id: 'browse', label: 'Browse opportunities' }, { id: 'hours', label: 'Log hours' }, { id: 'badges', label: 'Earn badges' }] }
];

export default function HomePage() {
  const [activeRole, setActiveRole] = useState<RoleDef | null>(null);
  const [guestMode, setGuestMode] = useState(false);

  return (
    <div className="space-y-20">
      <Hero onGuestExplore={() => setGuestMode(true)} />

      <section aria-labelledby="features-heading" className="space-y-8">
        <header className="max-w-3xl">
          <h2 id="features-heading" className="text-2xl md:text-3xl font-bold text-brand-indigo">Unified impact platform</h2>
          <p className="mt-2 text-neutral-700 dark:text-neutral-300">Everything you need to surface needs, mobilize surplus and measure real outcomes.</p>
        </header>
        <FeatureGrid items={featureItems} />
      </section>

      <section aria-labelledby="roles-heading" className="space-y-10">
        <header className="max-w-3xl">
          <h2 id="roles-heading" className="text-2xl md:text-3xl font-bold text-brand-indigo">Role spotlight</h2>
          <p className="mt-2 text-neutral-700 dark:text-neutral-300">Tailored workflows for every stakeholder.</p>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map(r => (
            <RoleCard key={r.role} role={r.role} description={r.description} capabilities={r.capabilities} onView={(role) => setActiveRole(roles.find(rr => rr.role === role) || null)} />
          ))}
        </div>
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-brand-indigo">Capability matrix</h3>
          <RoleMatrix entries={roleMatrixEntries} capabilityOrder={capabilityOrder} />
        </div>
      </section>

      <AnimatePresence>
        {activeRole && (
          <motion.div className="fixed inset-0 z-50 p-4 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50" onClick={() => setActiveRole(null)} />
            <motion.div role="dialog" aria-modal="true" aria-labelledby="role-dialog-title" initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-neutral-900 shadow-elevated p-8 focus:outline-none">
              <h4 id="role-dialog-title" className="text-xl font-semibold text-brand-indigo">{activeRole.role} features</h4>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{activeRole.description}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {activeRole.capabilities.map(c => (
                  <li key={c.id} className="flex gap-2 items-start">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-pink" />
                    <span>{c.label}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setActiveRole(null)} className="px-4 py-2 text-sm rounded-md bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo/60">Close</button>
                <button className="px-4 py-2 text-sm rounded-md bg-brand-indigo text-white shadow-soft hover:shadow-glow-indigo focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo/70">Proceed</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {guestMode && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-indigo/30 bg-white/70 dark:bg-neutral-900/70 backdrop-blur p-6 shadow-soft">
            <h3 className="font-semibold text-brand-indigo mb-2">Guest preview mode</h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">You are exploring a limited preview. Sign up to personalize your dashboard and access advanced capabilities.</p>
          </div>
          <GuestNeedsPreview />
        </div>
      )}
    </div>
  );
}
