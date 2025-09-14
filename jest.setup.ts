import React from 'react';
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

// Recharts ResponsiveContainer mock to provide stable dimensions and silence width/height(0) warnings
jest.mock('recharts', () => {
    const actual = jest.requireActual('recharts');
    type Size = { width: number | string; height: number | string };
    type RCProps = { width?: number | string; height?: number | string; children?: React.ReactNode | ((s: Size) => React.ReactNode) };
    const ResponsiveContainer = ({ width = 400, height = 300, children }: RCProps) => {
        const size: Size = { width, height };
        const content = typeof children === 'function' ? (children as (s: Size) => React.ReactNode)(size) : children;
        return React.createElement('div', { style: { width, height }, 'data-testid': 'responsive-container' }, content);
    };
    return { ...actual, ResponsiveContainer };
});

// Targeted console noise suppression (keep genuine errors)
const originalError = console.error;
console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (msg.includes('not configured to support act') || msg.includes('In HTML, <html> cannot be a child of <div>.')) {
        return; // suppress known redundant test environment noise
    }
    originalError(...args as []);
};

const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (msg.includes('width(0) and height(0)')) {
        return; // suppress recharts size warning now that container is mocked
    }
    originalWarn(...args as []);
};
