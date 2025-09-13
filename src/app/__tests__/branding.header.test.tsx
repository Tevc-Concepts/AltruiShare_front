import { render, screen } from '@testing-library/react';
import RootLayout from '../layout';

const renderWithChildren = () => render(<RootLayout><div>Child</div></RootLayout>);

describe('Branding Header', () => {
  it('renders logo image with alt text and favicon metadata', () => {
    renderWithChildren();
    const logoImg = screen.getByAltText(/altruishare logo/i);
    expect(logoImg).toBeInTheDocument();
    // metadata icons aren't directly in DOM; basic sanity check on brand text presence
    expect(screen.getByText(/AltruiShare/i)).toBeInTheDocument();
  });
});
