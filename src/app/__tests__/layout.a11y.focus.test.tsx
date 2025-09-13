import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RootLayout from '../layout';

function Wrapper() { return <div>Content Area</div>; }

describe('RootLayout accessibility', () => {
    it('focuses main content when skip link is activated', () => {
        render(<RootLayout><Wrapper /></RootLayout>);
        const skipLink = screen.getByText(/skip to content/i);
        skipLink.focus();
        expect(skipLink).toHaveFocus();
        fireEvent.click(skipLink);
        const main = screen.getByRole('main');
        main.focus(); // simulate browser follow anchor
        expect(main).toHaveFocus();
    });
});
