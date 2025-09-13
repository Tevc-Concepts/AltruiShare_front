"use client";
import React from 'react';
import { useAuth } from '../context/AuthProvider';

interface ProtectedProps {
    children: React.ReactNode;
    roles?: string[]; // required roles (any match)
    fallback?: React.ReactNode;
}

export const Protected: React.FC<ProtectedProps> = ({ children, roles, fallback }) => {
    const { user, loading, roles: userRoles } = useAuth();
    if (loading) return <div role="status" aria-live="polite" className="text-sm text-neutral-500">Loading...</div>;
    if (!user) return <>{fallback || <p className="text-sm">Please log in to continue.</p>}</>;
    if (roles && !roles.some(r => userRoles.includes(r))) {
        return fallback || <p className="text-sm text-red-600">You don&apos;t have permission for this area.</p>;
    }
    return <>{children}</>;
};

export default Protected;
