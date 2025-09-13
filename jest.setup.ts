jest.mock('next/font/google');
import '@testing-library/jest-dom'

declare global {
    interface Window {
        ResizeObserver: typeof MockResizeObserver;
        IntersectionObserver: typeof MockIntersectionObserver;
    }
}

// Generic minimal constructor form used for polyfill assignment without using 'any'
// Accept up to two parameters to cover native observer constructor shapes
type AnyObserverCtor =
    | (new (callback: (...args: unknown[]) => void) => unknown)
    | (new (callback: (...args: unknown[]) => void, options: unknown) => unknown);

// Polyfill ResizeObserver for recharts responsive container
class MockResizeObserver {
    constructor(callback: ResizeObserverCallback) { void callback }
    observe(target: Element, options?: ResizeObserverOptions): void { void target; void options }
    unobserve(target: Element): void { void target }
    disconnect(): void { /* no-op */ }
    takeRecords(): ResizeObserverEntry[] { return [] }
}
if (!('ResizeObserver' in globalThis)) {
    (globalThis as unknown as Record<string, unknown>).ResizeObserver = MockResizeObserver as unknown as AnyObserverCtor;
}

// Minimal IntersectionObserver polyfill for framer-motion in tests
class MockIntersectionObserver {
    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) { void callback; void options }
    observe(target: Element): void { void target }
    unobserve(target: Element): void { void target }
    disconnect(): void { /* no-op */ }
    takeRecords(): IntersectionObserverEntry[] { return [] }
    root: Element | null = null;
    rootMargin: string = '0px';
    thresholds: ReadonlyArray<number> = [0];
}
if (!('IntersectionObserver' in globalThis)) {
    (globalThis as unknown as Record<string, unknown>).IntersectionObserver = MockIntersectionObserver as unknown as AnyObserverCtor;
}
