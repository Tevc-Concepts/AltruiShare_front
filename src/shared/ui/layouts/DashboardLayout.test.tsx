import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardLayout } from './DashboardLayout';
import { UserRole } from '../../../entities/role';
import '@testing-library/jest-dom';

// Mock SideNav to isolate layout logic
let receivedRoles: UserRole[] | undefined;
jest.mock('../navigation/SideNav', () => ({
    SideNav: (props: { roles: UserRole[] }) => {
        receivedRoles = props.roles;
        return <nav data-testid="mock-sidenav">{(props.roles || []).join(',')}</nav>;
    }
}));

// Mock Auth context
// Mock useAuth hook directly (simpler than provider wiring)
jest.mock('../../context/AuthProvider', () => ({
    useAuth: () => ({ roles: ['donor', 'volunteer', 'UNKNOWN_ROLE'] })
}));

describe('DashboardLayout', () => {
    it('passes typed enum roles to SideNav and renders children', () => {
        render(<DashboardLayout><div>ChildContent</div></DashboardLayout>);
        screen.getByTestId('mock-sidenav');
        // UNKNOWN_ROLE should be filtered out by DashboardLayout type narrowing
        expect(receivedRoles).toEqual(['donor', 'volunteer']);
        expect(screen.getByText('ChildContent')).toBeInTheDocument();
    });
});
