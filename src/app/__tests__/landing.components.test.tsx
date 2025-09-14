import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Hero from '../../shared/ui/Hero';
import RoleCard from '../../shared/ui/RoleCard';

describe('Landing UI components', () => {
    test('Hero renders headline and CTA buttons', () => {
        const fn = jest.fn();
        render(<Hero onGuestExplore={fn} />);
        expect(screen.getByRole('heading', { name: /AltruiShare/i })).toBeInTheDocument();
        screen.getByRole('link', { name: /Get Started Free/i });
        screen.getByRole('link', { name: /Login/i });
        const guestBtn = screen.getByRole('button', { name: /Explore as Guest/i });
        fireEvent.click(guestBtn);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    test('RoleCard lists capabilities and view button triggers handler', () => {
        const onView = jest.fn();
        render(<RoleCard role="Volunteer" description="Help out" capabilities={[{ id: 'a', label: 'Do thing' }]} onView={onView} />);
        expect(screen.getByRole('heading', { name: /Volunteer/i })).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /View Role Features/i }));
        expect(onView).toHaveBeenCalledWith('Volunteer');
    });
});
