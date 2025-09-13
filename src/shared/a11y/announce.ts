// Simple live region announcer. Injects messages into an existing #global-status-region
// Falls back to creating a hidden polite region if not present.
let politeRegion: HTMLElement | null = null;
let assertiveRegion: HTMLElement | null = null;

function ensureRegion(priority: 'polite' | 'assertive') {
    const id = priority === 'polite' ? 'global-status-region' : 'global-assertive-region';
    let el = document.getElementById(id);
    if (!el) {
        el = document.createElement('div');
        el.id = id;
        el.setAttribute('aria-live', priority);
        el.setAttribute('aria-atomic', 'true');
        el.className = 'sr-only';
        document.body.appendChild(el);
    }
    return el as HTMLElement;
}

export function announceStatus(message: string, options: { priority?: 'polite' | 'assertive'; clearDelayMs?: number } = {}) {
    if (typeof window === 'undefined') return; // SSR safe
    const { priority = 'polite', clearDelayMs = 4000 } = options;
    const region = priority === 'polite'
        ? (politeRegion ||= ensureRegion('polite'))
        : (assertiveRegion ||= ensureRegion('assertive'));
    // Clear first to force SR re-announce
    region.textContent = '';
    // Using requestAnimationFrame to ensure DOM update cycle
    requestAnimationFrame(() => {
        region.textContent = message;
        if (clearDelayMs > 0) {
            setTimeout(() => {
                if (region.textContent === message) {
                    region.textContent = '';
                }
            }, clearDelayMs);
        }
    });
}
