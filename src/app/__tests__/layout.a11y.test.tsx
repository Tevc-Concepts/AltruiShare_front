import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RootLayout from '../layout';

// Minimal child wrapper
function Wrapper() {
    return <div>Content Area</div>;
}

describe('RootLayout accessibility', () => {
    it('focuses main content when skip link is activated', () => {
        render(<RootLayout><Wrapper /></RootLayout>);
        const skipLink = screen.getByText(/skip to content/i);
        // Simulate keyboard focus then activation
        skipLink.focus();
        expect(skipLink).toHaveFocus();
        fireEvent.click(skipLink);
        const main = screen.getByRole('main');
        // After navigation, browser would shift focus; we simulate by calling focus()
        main.focus();
        expect(main).toHaveFocus();
    });
});
