# Test Utilities

Centralized helpers for rendering components within required providers and stabilizing async auth state.

## `renderWithProviders`
Wraps UI in `AuthProvider`, allows optional `{ user, roles }` injection. It mocks:
* `authApi.getLoggedUser` once per call (user or null)
* Global `fetch` for roles endpoint returning provided roles (default empty array)

Use it instead of RTL `render` when a component relies on auth context.

## `waitForAuthSettled`
Utility to await initial `AuthProvider` async effect completion. Call after `renderWithProviders` if your test needs the post-initialization state (e.g., loading spinner removal) without triggering React act warnings.

```ts
import { renderWithProviders, waitForAuthSettled, screen } from 'src/test/utils'

const { container } = renderWithProviders(<Dashboard />)
await waitForAuthSettled()
expect(screen.getByText(/welcome/i)).toBeInTheDocument()
```

## Recharts Mock
`jest.setup.ts` supplies a fixed-size `ResponsiveContainer` to avoid width/height(0) warnings while keeping child render logic. Charts should still render their internals for accessibility queries.

## Console Noise Filtering
Selective suppression in `jest.setup.ts` for redundant environment warnings. Real errors still surface. Adjust list if signal is lost.

## Adding New Helpers
Add them to this folder and re-export from `index.ts` (or update existing exports) to keep imports concise.
