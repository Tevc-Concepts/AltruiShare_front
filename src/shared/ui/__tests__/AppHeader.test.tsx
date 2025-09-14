import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import AppHeader from '../AppHeader';

jest.mock('../../context/AuthProvider', () => ({
    useAuth: () => ({ roles: ['donor'] })
}));

jest.mock('next/navigation', () => ({
    usePathname: () => '/',
}));

describe('AppHeader', () => {
    it('renders logo and primary links (desktop)', () => {
        render(<AppHeader />);
        expect(screen.getByAltText(/altruishare logo/i)).toBeInTheDocument();
        expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument();
    });

    it('toggles mobile menu visibility', () => {
        render(<AppHeader />);
        const toggle = screen.getByLabelText(/toggle navigation/i);
        fireEvent.click(toggle);
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
        const panel = screen.getByRole('navigation', { name: /mobile navigation/i });
        const homeLinks = within(panel).getAllByRole('link', { name: /home/i });
        expect(homeLinks.length).toBeGreaterThanOrEqual(1);
    });

    it('toggles dark mode class on html element', () => {
        render(<AppHeader />);
        const btn = screen.getByRole('button', { name: /activate dark mode/i });
        fireEvent.click(btn);
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        fireEvent.click(btn); // back to light
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
});
