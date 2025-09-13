"use client";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BASE_MENU_SECTIONS, MenuItem, MenuSection } from './menu.config';
import { Capability, UserRole, hasCapability } from '../../../entities/role';

interface SideNavProps {
    roles?: UserRole[];
    collapsedWidth?: number;
    expandedWidth?: number;
    initialCollapsed?: boolean;
    onToggle?(collapsed: boolean): void;
}

const STORAGE_KEY = 'altruishare:sidenav:collapsed';

export const SideNav: React.FC<SideNavProps> = ({
    roles,
    collapsedWidth = 72,
    expandedWidth = 240,
    initialCollapsed,
    onToggle
}) => {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState<boolean>(() => {
        if (typeof window === 'undefined') return initialCollapsed ?? false;
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored ? stored === 'true' : (initialCollapsed ?? false);
    });

    useEffect(() => {
        try { window.localStorage.setItem(STORAGE_KEY, String(collapsed)); } catch { /* ignore */ }
    }, [collapsed]);

    const toggle = useCallback(() => {
        setCollapsed(c => {
            const next = !c;
            onToggle?.(next);
            return next;
        });
    }, [onToggle]);

    const filteredSections: MenuSection[] = useMemo(() => {
        return BASE_MENU_SECTIONS.map(sec => ({
            ...sec,
            items: sec.items.filter(item => canShowItem(item, roles))
        })).filter(sec => sec.items.length > 0);
    }, [roles]);

    return (
        <nav
            aria-label="Main navigation"
            className={`h-full border-r border-indigo-100 dark:border-indigo-900 bg-white dark:bg-neutral-900 shadow-sm flex flex-col transition-[width] duration-200 ease-in-out ${collapsed ? 'items-center' : ''}`}
            style={{ width: collapsed ? collapsedWidth : expandedWidth }}
        >
            <div className="flex items-center justify-between w-full px-3 py-4">
                <span className="font-bold text-indigo-600 dark:text-indigo-300 text-sm" aria-hidden={collapsed}>{collapsed ? 'AS' : 'AltruiShare'}</span>
                <button
                    onClick={toggle}
                    aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
                    className="p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-800 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500"
                >
                    {collapsed ? '»' : '«'}
                </button>
            </div>
            <div className="overflow-y-auto flex-1 w-full space-y-4 px-2" role="list">
                {filteredSections.map(section => (
                    <div key={section.id} role="listitem">
                        {!collapsed && (
                            <div className="px-2 pb-1 text-[10px] uppercase tracking-wide font-semibold text-indigo-500 dark:text-indigo-400">
                                {section.label}
                            </div>
                        )}
                        <ul className="space-y-1" role="menu" aria-label={section.label}>
                            {section.items.map(item => {
                                const active = pathname === item.path;
                                return (
                                    <li key={item.path} role="none">
                                        <Link
                                            href={item.path}
                                            role="menuitem"
                                            className={`group flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 transition-colors
                      ${active ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100' : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-800'}`}
                                            aria-current={active ? 'page' : undefined}
                                            title={collapsed ? item.label : undefined}
                                        >
                                            <span className="w-4 h-4 text-xs flex items-center justify-center font-bold">•</span>
                                            {!collapsed && <span>{item.label}</span>}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </nav>
    );
};

function canShowItem(item: MenuItem, roles?: UserRole[]): boolean {
    if (!item.capability) return true;
    return hasCapability(roles, item.capability as Capability);
}
