import { render, screen } from '@testing-library/react'
import { NotificationsPanel } from './NotificationsPanel'
import * as notifMod from '../../../shared/api/endpoints/notification'

const mockList = {
    notifications: [{ id: '1', title: 'Welcome', body: 'Hello there', created_at: new Date().toISOString(), read: false }],
    unread_count: 1
}

jest.spyOn(notifMod.notificationApi, 'list').mockResolvedValue(Promise.resolve(mockList))

describe('NotificationsPanel', () => {
    it('renders notifications', async () => {
        render(<NotificationsPanel />)
        expect(await screen.findByText(/welcome/i)).toBeInTheDocument()
    })
})
