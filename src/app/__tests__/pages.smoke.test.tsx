import { render, screen } from '@testing-library/react'
import HomePage from '../page'
import DonatePage from '../donate/page'
import ImpactPage from '../impact/page'
import NeedsPage from '../needs/page'
import NotificationsPage from '../notifications/page'
import UploadDemoPage from '../upload-demo/page'
import LoginPage from '../login/page'
import RegisterPage from '../register/page'

// Minimal mocks for hooks/components used within pages to isolate rendering
jest.mock('next/navigation', () => ({
    useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
    usePathname: () => '/',
}));
jest.mock('../../shared/context/AuthProvider', () => ({ useAuth: () => ({ login: jest.fn(), register: jest.fn(), loading: false, user: null }) }))

describe('Next.js pages smoke render', () => {
    it('renders Home', () => {
        render(<HomePage />)
        expect(screen.getByRole('heading', { name: /AltruiShare/i })).toBeInTheDocument()
    })
    it('renders Donate page', () => {
        render(<DonatePage />)
        // Updated heading text after gating refactor
        expect(screen.getByText(/Donate/i)).toBeInTheDocument()
    })
    it('renders Impact page', () => {
        render(<ImpactPage />)
        expect(screen.getByText(/Impact/i)).toBeInTheDocument()
    })
    it('renders Needs page placeholder', () => {
        // NeedsFeature may not be implemented; just ensure component boundary loads
        render(<NeedsPage />)
    })
    it('renders Notifications page', () => {
        render(<NotificationsPage />)
        expect(screen.getAllByText(/Notifications/i).length).toBeGreaterThanOrEqual(1)
    })
    it('renders Upload Demo page', () => {
        render(<UploadDemoPage />)
        expect(screen.getByText(/Upload Demo/i)).toBeInTheDocument()
    })
    it('renders Login page', () => {
        render(<LoginPage />)
        expect(screen.getAllByText(/Login/i).length).toBeGreaterThanOrEqual(1)
    })
    it('renders Register page', () => {
        render(<RegisterPage />)
        expect(screen.getByText(/Register/i)).toBeInTheDocument()
    })
})
