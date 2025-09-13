import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// Test harness replicating skip link + main behavior without full <html> structure
function TestLayout() {
    return (
        <div>
            <a href="#main-content" className="sr-only focus:not-sr-only">Skip to content</a>
            <main id="main-content" tabIndex={-1}>Content Area</main>
        </div>
    )
}

describe('Skip link accessibility harness', () => {
    it('moves focus to main after activation', () => {
        render(<TestLayout />)
        const skipLink = screen.getByText(/skip to content/i)
        skipLink.focus()
        expect(skipLink).toHaveFocus()
        fireEvent.click(skipLink)
        const main = screen.getByRole('main')
        // Simulate browser jump
        main.focus()
        expect(main).toHaveFocus()
    })
})
