import { screen } from '@testing-library/react';
import AppHeader from '../../shared/ui/AppHeader';
import { renderWithProviders } from '../../test/utils/renderWithProviders';

describe('Branding Header', () => {
    it('renders logo and brand text', () => {
        renderWithProviders(<AppHeader />, { user: { id: 'u1', email: 'user@test' } });
        const logoImg = screen.getByAltText(/altruishare logo/i);
        expect(logoImg).toBeInTheDocument();
        const brandTexts = screen.getAllByText(/AltruiShare/i);
        expect(brandTexts.length).toBeGreaterThan(0);
    });
});
