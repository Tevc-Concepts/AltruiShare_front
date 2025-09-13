import { authApi } from './auth'
import { donationApi } from './donation'
import { paymentApi } from './payment'
import { notificationApi } from './notification'
import api from '../client'

// Mock axios before anything else so that importing client attaches interceptors to our mock instance.
interface AxiosMockInstance {
    interceptors: { response: { use: (f: (v: unknown) => unknown, r: (e: unknown) => unknown) => void } }
    get: jest.Mock
    post: jest.Mock
    _fulfilled?: (arg: unknown) => unknown
    _rejected?: (arg: unknown) => Promise<unknown>
}

jest.mock('axios', () => {
    const mockInstance: AxiosMockInstance = {
        interceptors: {
            response: {
                use: (fulfilled, rejected) => {
                    mockInstance._fulfilled = fulfilled
                    mockInstance._rejected = (e: unknown) => Promise.resolve(rejected(e) as unknown)
                }
            }
        },
        get: jest.fn(),
        post: jest.fn()
    }
    return { create: jest.fn(() => mockInstance) }
})

// Import the mocked module type-safely
import axiosModule from 'axios'
// The created mock axios instance (first create call result)
const axiosInstance = (axiosModule as unknown as { create: jest.Mock }).create.mock.results[0].value as AxiosMockInstance

describe('api client interceptors', () => {
    test('success interceptor returns payload.data when status success and data present', async () => {
        const fulfilled = axiosInstance._fulfilled as (arg: unknown) => unknown
        const result = await fulfilled({ data: { status: 'success', data: { foo: 'bar' } } })
        expect(result).toEqual({ foo: 'bar' })
    })

    test('success interceptor returns whole payload when status success and no data field', async () => {
        const payload = { status: 'success', message: 'ok' }
        const fulfilled = axiosInstance._fulfilled as (arg: unknown) => unknown
        const result = await fulfilled({ data: payload })
        expect(result).toEqual(payload)
    })

    test('success interceptor rejects with Error when status not success', async () => {
        const fulfilled = axiosInstance._fulfilled as (arg: unknown) => Promise<unknown>
        await expect(fulfilled({ data: { status: 'error', message: 'Boom' } })).rejects.toThrow('Boom')
    })

    test('error interceptor dispatches unauthorized event on 401', async () => {
        const listener = jest.fn()
        window.addEventListener('auth:unauthorized', listener)
        const error = { response: { status: 401 } }
        const rejected = axiosInstance._rejected as (arg: unknown) => Promise<unknown>
        await expect(rejected(error)).rejects.toBe(error)
        expect(listener).toHaveBeenCalled()
    })

    test('error interceptor passes through other errors without event', async () => {
        const listener = jest.fn()
        window.addEventListener('auth:unauthorized', listener)
        const error = { response: { status: 500 }, message: 'Server' }
        const rejected = axiosInstance._rejected as (arg: unknown) => Promise<unknown>
        await expect(rejected(error)).rejects.toBe(error)
        expect(listener).not.toHaveBeenCalled()
    })
})

describe('endpoint wrappers', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('authApi.login & logout & getLoggedUser', async () => {
        ; (api.post as jest.Mock).mockResolvedValue({ user: { id: 'u1', email: 'a@b.com' }, sid: 'sid123' })
        const res = await authApi.login({ email: 'a@b.com', password: 'pw' })
        expect(res.sid).toBe('sid123')
        expect(api.post).toHaveBeenCalledWith('.as_api.auth_api.login', { email: 'a@b.com', password: 'pw' })

            ; (api.get as jest.Mock).mockResolvedValue({ id: 'u1', email: 'a@b.com' })
        const user = await authApi.getLoggedUser()
        expect(user.id).toBe('u1')

            ; (api.post as jest.Mock).mockResolvedValue(undefined)
        await authApi.logout()
        expect(api.post).toHaveBeenCalledWith('.as_api.auth_api.logout', {})
    })

    test('authApi.login propagates rejection', async () => {
        const err = new Error('Bad creds')
            ; (api.post as jest.Mock).mockRejectedValue(err)
        await expect(authApi.login({ email: 'x@y.z', password: 'nope' })).rejects.toThrow('Bad creds')
    })

    test('donationApi.create monetary and item donations', async () => {
        ; (api.post as jest.Mock).mockResolvedValue({ donation_id: 'd1', payment_required: true, logistics_required: false })
        const monetary = await donationApi.create({ need_id: 'n1', donation_type: 'Monetary', amount: 50, anonymous: true })
        expect(monetary.donation_id).toBe('d1')
        expect(api.post).toHaveBeenCalledWith('.as_api.donation_api.create_donation', expect.objectContaining({ amount: 50, anonymous: true }))

            ; (api.post as jest.Mock).mockResolvedValue({ donation_id: 'd2', payment_required: false, logistics_required: true })
        const item = await donationApi.create({ need_id: 'n2', donation_type: 'Items', items: [{ type: 'Food', description: 'Rice', quantity: 2, unit: 'kg' }] })
        expect(item.donation_id).toBe('d2')
    })

    test('donationApi.list builds query string with filters', async () => {
        ; (api.get as jest.Mock).mockResolvedValue({ donations: [], total: 0 })
        await donationApi.list({ start: 5, page_length: 10, order_by: 'created_at desc', filters: { status: 'Pending' } })
        expect(api.get).toHaveBeenCalledWith(expect.stringContaining('.as_api.donation_api.list_donations'))
        const called = (api.get as jest.Mock).mock.calls[0][0]
        expect(called).toContain('start=5')
        expect(called).toContain('page_length=10')
        // URLSearchParams encodes space as '+'
        expect(called).toContain('order_by=created_at+desc')
        expect(called).toContain('filters=')
    })

    test('donationApi.list without params', async () => {
        ; (api.get as jest.Mock).mockResolvedValue({ donations: [], total: 0 })
        await donationApi.list()
        expect(api.get).toHaveBeenCalledWith('.as_api.donation_api.list_donations')
    })

    test('paymentApi request / status / verify / methods', async () => {
        ; (api.post as jest.Mock).mockResolvedValue({ donation_id: 'd1', payment_reference: 'pref', amount: 10, currency: 'USD' })
        const req = await paymentApi.createRequest({ amount: 10, currency: 'USD', payment_method: 'card', donor_email: 'a@b.com', donor_name: 'A', need_id: 'n1' })
        expect(req.payment_reference).toBe('pref')
        expect(api.post).toHaveBeenCalledWith('.as_api.payment_api.create_payment_request', expect.objectContaining({ amount: 10 }))

            ; (api.get as jest.Mock).mockResolvedValue({ payment_status: 'Pending' })
        const status = await paymentApi.getStatus('pref')
        expect(status.payment_status).toBe('Pending')
        expect(api.get).toHaveBeenCalledWith(expect.stringContaining('.as_api.payment_api.get_payment_status?reference=pref'))

            ; (api.post as jest.Mock).mockResolvedValue({ payment_status: 'Completed' })
        const verify = await paymentApi.verify('pref')
        expect(verify.payment_status).toBe('Completed')

            ; (api.get as jest.Mock).mockResolvedValue({ payment_methods: [{ name: 'Card', type: 'Online', enabled: true, currencies: ['USD'] }] })
        const methods = await paymentApi.getMethods()
        expect(methods.payment_methods[0].name).toBe('Card')
    })

    test('notificationApi list / markRead / markAllRead', async () => {
        ; (api.get as jest.Mock).mockResolvedValue({ notifications: [], unread_count: 0 })
        const list = await notificationApi.list()
        expect(list.unread_count).toBe(0)
        expect(api.get).toHaveBeenCalledWith('.as_api.notification_api.list_notifications')

            ; (api.post as jest.Mock).mockResolvedValue({ success: true })
        const r = await notificationApi.markRead('nid1')
        expect(r.success).toBe(true)
        expect(api.post).toHaveBeenCalledWith('.as_api.notification_api.mark_read', { id: 'nid1' })

            ; (api.post as jest.Mock).mockResolvedValue({ success: true })
        const all = await notificationApi.markAllRead()
        expect(all.success).toBe(true)
        expect(api.post).toHaveBeenCalledWith('.as_api.notification_api.mark_all_read', {})
    })
})
