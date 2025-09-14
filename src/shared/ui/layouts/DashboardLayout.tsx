"use client";
import React from 'react';
import { SideNav } from '../navigation/SideNav';
import { ErrorBoundary } from '../../ui/errors/ErrorBoundary';
import { useAuth } from '../../context/AuthProvider';
import { UserRole } from '../../../entities/role';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const { roles } = useAuth();
    const typedRoles = (roles || []).filter((r): r is UserRole => Object.values(UserRole).includes(r as UserRole));
    return (
        <div className="w-full h-full flex bg-gradient-to-br from-indigo-50 to-white dark:from-neutral-900 dark:to-neutral-950">
            <SideNav roles={typedRoles} />
            <main className="flex-1 min-h-screen focus:outline-none">
                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
            </main>
        </div>
    );
};

export default DashboardLayout;