jest.mock('next/font/google');
import '@testing-library/jest-dom'

// Polyfill ResizeObserver for recharts responsive container
class MockResizeObserver {
    callback: ResizeObserverCallback;
    constructor(cb: ResizeObserverCallback) { this.callback = cb }
    observe() { /* no-op */ }
    unobserve() { /* no-op */ }
    disconnect() { /* no-op */ }
}
// Assign polyfill only if not present
// @ts-ignore
if (!global.ResizeObserver) {
    (global as unknown as { ResizeObserver: typeof MockResizeObserver }).ResizeObserver = MockResizeObserver;
}

// Minimal IntersectionObserver polyfill for framer-motion in tests
class MockIntersectionObserver {
    callback: IntersectionObserverCallback;
    constructor(cb: IntersectionObserverCallback) { this.callback = cb }
    observe() { /* no-op */ }
    unobserve() { /* no-op */ }
    disconnect() { /* no-op */ }
    takeRecords(): IntersectionObserverEntry[] { return [] }
    root: Element | null = null;
    rootMargin: string = '0px';
    thresholds: ReadonlyArray<number> = [0];
}
if (!global.IntersectionObserver) {
    (global as unknown as { IntersectionObserver: typeof MockIntersectionObserver }).IntersectionObserver = MockIntersectionObserver;
}
