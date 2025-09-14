"use client";
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BASE_MENU_SECTIONS, MenuItem } from './navigation/menu.config';
import { useAuth } from '../context/AuthProvider';
import { Capability, UserRole, hasCapability } from '../../entities/role';
import { usePathname } from 'next/navigation';

interface AppHeaderProps {
    enableThemeToggle?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ enableThemeToggle = true }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dark, setDark] = useState(false);
    const { roles } = useAuth();
    const pathname = usePathname();

    // Cast roles to enum list (already handled in layout elsewhere; safe duplication here for isolation)
    const typedRoles = useMemo(() => (roles || []).filter(r => Object.values(UserRole).includes(r as UserRole)) as UserRole[], [roles]);

    const permittedItems: MenuItem[] = useMemo(() => {
        return BASE_MENU_SECTIONS.flatMap(sec => sec.items).filter(it => !it.capability || hasCapability(typedRoles, it.capability as Capability));
    }, [typedRoles]);

    const toggleDark = useCallback(() => {
        setDark(d => !d);
    }, []);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const root = document.documentElement;
            if (dark) root.classList.add('dark'); else root.classList.remove('dark');
        }
    }, [dark]);

    useEffect(() => {
        // Close drawer on route change
        setMobileOpen(false);
    }, [pathname]);

    return (
        <header className="w-full border-b border-white/20 dark:border-neutral-800 backdrop-blur bg-white/60 dark:bg-neutral-900/60 sticky top-0 z-30">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-semibold text-brand-navy dark:text-brand-emerald">
                    <Image src="/Altruishare.png" alt="AltruiShare logo" width={32} height={32} priority className="rounded-md shadow-soft" />
                    <span className="hidden sm:inline">AltruiShare</span>
                </Link>
                <nav className="hidden md:flex items-center gap-5 text-sm" aria-label="Primary">
                    {permittedItems.filter(i => ['/', '/needs', '/donate', '/impact'].includes(i.path)).map(i => (
                        <Link key={i.path} href={i.path} className={`relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition after:bg-brand-cobalt ${pathname === i.path ? 'text-brand-cobalt font-medium after:scale-x-100' : ''}`}>{i.label}</Link>
                    ))}
                </nav>
                <div className="flex items-center gap-2">
                    {enableThemeToggle && (
                        <button onClick={toggleDark} aria-pressed={dark} aria-label={dark ? 'Activate light mode' : 'Activate dark mode'} className="p-2 rounded-full bg-brand-navy/10 dark:bg-brand-emerald/20 hover:bg-brand-navy/20 dark:hover:bg-brand-emerald/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cobalt">
                            {dark ? '🌙' : '☀️'}
                        </button>
                    )}
                    <button onClick={() => setMobileOpen(o => !o)} aria-expanded={mobileOpen} aria-controls="mobile-menu" aria-label="Toggle navigation" className="md:hidden p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cobalt bg-white/70 dark:bg-neutral-800/70 border border-brand-navy/10 dark:border-neutral-700">
                        {mobileOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>
            {/* Mobile panel */}
            <div id="mobile-menu" className={`md:hidden fixed inset-y-0 right-0 w-72 max-w-full z-40 transform transition-transform duration-200 ease-in-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`} aria-hidden={!mobileOpen}>
                <div className="h-full flex flex-col bg-white dark:bg-neutral-900 shadow-elevated border-l border-neutral-200 dark:border-neutral-800">
                    <div className="px-4 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                        <span className="font-semibold text-brand-navy dark:text-brand-emerald">Menu</span>
                        <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cobalt">✕</button>
                    </div>
                    <nav className="flex-1 overflow-y-auto px-2 py-4" aria-label="Mobile navigation">
                        <ul className="space-y-1">
                            {permittedItems.map(item => {
                                const active = pathname === item.path;
                                return (
                                    <li key={item.path}>
                                        <Link href={item.path} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cobalt transition-colors ${active ? 'bg-brand-cobalt/15 text-brand-cobalt' : 'hover:bg-brand-navy/10 dark:hover:bg-neutral-800'}`}>{item.label}</Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                    <div className="p-4 text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-800">
                        <p>© {new Date().getFullYear()} AltruiShare</p>
                    </div>
                </div>
                {mobileOpen && <button aria-label="Close menu overlay" onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10" />}
            </div>
        </header>
    );
};

export default AppHeader;