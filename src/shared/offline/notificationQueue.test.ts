import { enqueue, getQueue, clearQueue, flush, setupAutoFlush } from './notificationQueue'

describe('notificationQueue', () => {
    beforeEach(() => {
        localStorage.clear()
        clearQueue()
        Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true })
    })

    it('enqueues actions and persists them', () => {
        enqueue({ type: 'markRead', id: 'n1' })
        enqueue({ type: 'markAll' })
        const q = getQueue()
        expect(q).toHaveLength(2)
        expect(JSON.parse(localStorage.getItem('altruishare_notification_queue_v1') || '[]')).toHaveLength(2)
    })

    it('flush processes all actions and clears them on success', async () => {
        enqueue({ type: 'markRead', id: 'a' })
        enqueue({ type: 'markAll' })
        const processed: string[] = []
        await flush(async (a) => { processed.push(a.type) })
        expect(processed).toEqual(['markRead', 'markAll'])
        expect(getQueue()).toHaveLength(0)
    })

    it('flush stops on first failure and leaves remaining', async () => {
        enqueue({ type: 'markRead', id: '1' })
        enqueue({ type: 'markRead', id: '2' })
        enqueue({ type: 'markAll' })
        const calls: string[] = []
        await flush(async (a) => {
            calls.push(a.type + ('id' in a ? ':' + a.id : ''))
            if (a.type === 'markRead' && a.id === '2') throw new Error('fail')
        })
        // first action removed, second failed so stays plus remaining third
        const remaining = getQueue()
        expect(remaining).toHaveLength(2)
        expect(calls).toHaveLength(2)
        expect(calls[0]).toBe('markRead:1')
        expect(calls[1]).toBe('markRead:2')
    })

    it('setupAutoFlush triggers immediate flush when online and registers listener', async () => {
        enqueue({ type: 'markRead', id: 'x' })
        const processed: string[] = []
        const disposer = setupAutoFlush(async (a) => { processed.push(a.type) })
        // allow microtasks
        await Promise.resolve()
        expect(processed).toContain('markRead')
        expect(getQueue()).toHaveLength(0)
        expect(typeof disposer).toBe('function')
    })

    it('setupAutoFlush defers until coming online', async () => {
        Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true })
        enqueue({ type: 'markAll' })
        const processed: string[] = []
        setupAutoFlush(async (a) => { processed.push(a.type) })
        expect(processed).toHaveLength(0)
        // simulate going online
        Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true })
        window.dispatchEvent(new Event('online'))
        await Promise.resolve()
        expect(processed).toEqual(['markAll'])
    })
})
