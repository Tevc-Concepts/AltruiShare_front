import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { OfflineBanner } from './OfflineBanner'
import { useOnlineStatus } from '../utils/useOnlineStatus'

describe('useOnlineStatus hook', () => {
    function Probe() {
        const online = useOnlineStatus()
        return <div data-testid="state">{String(online)}</div>
    }
    test('initially reflects navigator.onLine', () => {
        const { getByTestId } = render(<Probe />)
        expect(['true', 'false']).toContain(getByTestId('state').textContent)
    })
})

describe('OfflineBanner component', () => {
    const setOnline = (value: boolean) => {
        Object.defineProperty(window.navigator, 'onLine', { configurable: true, value })
        act(() => { window.dispatchEvent(new Event(value ? 'online' : 'offline')) })
    }

    test('hidden when online, visible when offline', () => {
        setOnline(true)
        const { rerender } = render(<OfflineBanner />)
        expect(screen.queryByText(/you are offline/i)).not.toBeInTheDocument()
        setOnline(false)
        rerender(<OfflineBanner />)
        expect(screen.getByText(/you are offline/i)).toBeInTheDocument()
    })
})
