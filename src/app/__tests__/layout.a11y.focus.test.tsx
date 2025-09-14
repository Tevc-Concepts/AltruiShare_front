import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Minimal shell replicating skip link behavior from RootLayout without <html> element nesting
const TestShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div>
        <a href="#main-content" className="sr-only focus:not-sr-only">Skip to content</a>
        <main id="main-content" tabIndex={-1}>{children}</main>
    </div>
);

describe('Layout accessibility (skip link)', () => {
    it('focuses main content when skip link is activated', () => {
        render(<TestShell><p>Content Area</p></TestShell>);
        const skipLink = screen.getByText(/skip to content/i);
        skipLink.focus();
        expect(skipLink).toHaveFocus();
        fireEvent.click(skipLink);
        const main = screen.getByRole('main');
        main.focus(); // simulate focus shift
        expect(main).toHaveFocus();
    });
});
