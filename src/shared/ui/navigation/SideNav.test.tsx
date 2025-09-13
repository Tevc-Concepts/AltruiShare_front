import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SideNav } from './SideNav';
import { UserRole } from '../../../entities/role';
import '@testing-library/jest-dom';

// Helper to get all visible menu labels (excluding sections heading when collapsed)
function getMenuLabels() {
    return screen
        .queryAllByRole('menuitem')
        .map(el => el.textContent?.trim().replace(/^•/, ''))
        .filter(Boolean);
}

describe('SideNav', () => {
    it('renders basic items for donor role', () => {
        render(<SideNav roles={[UserRole.DONOR]} initialCollapsed={false} />);
        const labels = getMenuLabels();
        // Donor should see Home, Donate, Impact (Needs requires manage capability) but not Logistics
        expect(labels).toContain('Home');
        expect(labels).toContain('Donate');
        expect(labels).toContain('Impact');
        expect(labels).not.toContain('Logistics');
    });

    it('filters items requiring capabilities not present', () => {
        render(<SideNav roles={[UserRole.VOLUNTEER]} initialCollapsed={false} />);
        const labels = getMenuLabels();
        // Volunteer lacks MANAGE_NEED so Needs hidden; has volunteer signup so Volunteer Opps visible
        expect(labels).not.toContain('Needs');
        expect(labels).toContain('Volunteer Opps');
    });

    it('collapse toggle hides labels but keeps tooltips', () => {
        render(<SideNav roles={[UserRole.DONOR]} initialCollapsed={false} />);
        const toggleBtn = screen.getByRole('button', { name: /collapse navigation/i });
        fireEvent.click(toggleBtn);
        // After collapse, text labels (like Donate) should not appear, but links exist as menuitems with title attribute
        const donateLink = screen.getAllByRole('menuitem').find(el => el.getAttribute('title') === 'Donate');
        expect(donateLink).toBeTruthy();
        expect(screen.queryByText('Donate')).toBeNull();
    });
});
