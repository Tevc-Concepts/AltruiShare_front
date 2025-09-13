import { announceStatus } from './announce';

// JSDOM tests
describe('announceStatus', () => {
    it('creates polite region and sets text content', async () => {
        document.body.innerHTML = '';
        announceStatus('Hello world', { priority: 'polite', clearDelayMs: 0 });
        const region = document.getElementById('global-status-region');
        expect(region).not.toBeNull();
        // Because of rAF we need microtask + frame
        await new Promise(r => requestAnimationFrame(r));
        expect(region!.textContent).toBe('Hello world');
    });

    it('creates assertive region when requested', async () => {
        announceStatus('Urgent', { priority: 'assertive', clearDelayMs: 0 });
        const region = document.getElementById('global-assertive-region');
        await new Promise(r => requestAnimationFrame(r));
        expect(region).not.toBeNull();
        expect(region!.getAttribute('aria-live')).toBe('assertive');
        expect(region!.textContent).toBe('Urgent');
    });
});
