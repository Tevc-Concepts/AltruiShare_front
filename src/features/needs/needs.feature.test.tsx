import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { useNeeds } from './hooks/useNeeds'
import { NeedsList } from './components/NeedsList'
import * as needMod from '../../shared/api/endpoints/need'

jest.mock('framer-motion', () => {
    const Comp = (p: React.ComponentProps<'div'>) => <div {...p} />
    return { __esModule: true, motion: new Proxy({}, { get: () => Comp }) }
})

const listSpy = jest.spyOn(needMod.needApi, 'listByFilters')

function HookConsumer() {
    const { needs, loading, error, setFilters, refetch } = useNeeds({ status: 'open' })
    return (
        <div>
            <div data-testid="loading">{loading ? 'yes' : 'no'}</div>
            <div data-testid="error">{error || 'none'}</div>
            <div data-testid="count">{needs.length}</div>
            <button onClick={() => setFilters({ status: 'fulfilled' })}>setFilters</button>
            <button onClick={() => refetch()}>refetch</button>
        </div>
    )
}

describe('useNeeds hook', () => {
    beforeEach(() => { listSpy.mockReset() })

    it('loads needs successfully and updates when filters change', async () => {
        listSpy.mockResolvedValueOnce([{ id: '1', title: 'Need1', description: 'Desc', status: 'open' }])
            .mockResolvedValueOnce([{ id: '2', title: 'Need2', description: 'Desc2', status: 'fulfilled' }])
        render(<HookConsumer />)
        expect(screen.getByTestId('loading').textContent).toBe('yes')
        await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('1'))
        expect(listSpy).toHaveBeenCalledWith({ status: 'open' })
        fireEvent.click(screen.getByText('setFilters'))
        await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('1'))
        expect(listSpy).toHaveBeenLastCalledWith({ status: 'fulfilled' })
    })

    it('sets error on failure and clears on refetch', async () => {
        listSpy.mockRejectedValueOnce(new Error('boom')).mockResolvedValueOnce([])
        render(<HookConsumer />)
        await waitFor(() => expect(screen.getByTestId('error').textContent).toBe('boom'))
        fireEvent.click(screen.getByText('refetch'))
        await waitFor(() => expect(screen.getByTestId('error').textContent).toBe('none'))
    })
})

describe('NeedsList component', () => {
    beforeEach(() => { listSpy.mockReset() })

    it('shows loading then empty state', async () => {
        listSpy.mockResolvedValueOnce([])
        render(<NeedsList />)
        expect(screen.getByRole('status')).toHaveTextContent(/loading/i)
        await waitFor(() => expect(screen.getByText(/No needs found/i)).toBeInTheDocument())
    })

    it('shows error and retries', async () => {
        listSpy.mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce([{ id: '1', title: 'Need1', description: 'D', status: 'open' }])
        render(<NeedsList />)
        await waitFor(() => expect(screen.getByText('fail')).toBeInTheDocument())
        fireEvent.click(screen.getByRole('button', { name: /retry/i }))
        await waitFor(() => expect(screen.getByText('Need1')).toBeInTheDocument())
    })

    it('applies filters and reset', async () => {
        listSpy
            .mockResolvedValueOnce([{ id: '1', title: 'A', description: 'd', status: 'open' }]) // initial
            .mockResolvedValueOnce([{ id: '2', title: 'Filtered', description: 'fd', status: 'fulfilled' }]) // after apply
            .mockResolvedValueOnce([{ id: '1', title: 'A', description: 'd', status: 'open' }]) // after reset
        render(<NeedsList />)
        await waitFor(() => expect(screen.getByText('A')).toBeInTheDocument())
        fireEvent.change(screen.getByPlaceholderText(/search needs/i), { target: { value: 'Filtered' } })
        fireEvent.change(screen.getByDisplayValue('All').closest('select')!, { target: { value: 'fulfilled' } })
        fireEvent.click(screen.getByRole('button', { name: /apply/i }))
        await waitFor(() => expect(screen.getByText('Filtered')).toBeInTheDocument())
        fireEvent.click(screen.getByRole('button', { name: /reset/i }))
        await waitFor(() => expect(screen.getByText('A')).toBeInTheDocument())
    })
})
