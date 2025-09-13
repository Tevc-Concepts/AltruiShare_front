## Donations Feature

### Flow Overview
1. User fills Monetary or In‑Kind (Items) form.
2. Monetary: create donation (POST donation.create) then create payment request.
3. If `payment_reference` returned, UI displays checkout link and starts polling every 3000ms.
4. Polling stops on terminal statuses: `completed`, `success`, or `failed`.
5. Verification request (payment.verify) is only attempted for successful (`completed|success`) statuses; failures skip verify.

### Polling Logic (src/features/donations/donations.feature.tsx)
- Starts when `paymentRef` is set and `paymentStatus` still null.
- Interval cleared and state `poller` nulled on terminal status.
- Errors during status or verify calls are swallowed to keep UX resilient.

### Testing Strategy
File: `src/features/donations/donations.feature.test.tsx`

Scenarios covered:
- Happy path monetary donation (checkout link rendered)
- Failed payment (ensures no verify call)
- Immediate completion (verify executed)
- Completion after pending cycles (multiple polls)
- Verify failure swallowed without rejecting test
- Extended pending chain then success
- Interval cleanup (no extra polls post-terminal)
- Items donation submission (no payment flow)

Techniques:
- `jest.useFakeTimers()` with helper `advance(ms)` wrapping `jest.advanceTimersByTime` in `act` and flushing microtasks.
- Mocked `framer-motion` for deterministic rendering eliminating animation delays.
- API endpoint spies for donation & payment modules to assert calls and inject statuses.
- Robust DOM queries: rely on text & placeholders instead of fragile label-for pairing.

### Why Skip Verify On Failed
Skipping verification for failed statuses prevents unnecessary network calls and simplifies error handling. Tests assert `verify` not invoked on failure, matching updated component guard.

### Future Enhancements
- Surface intermediate pending status messages to user with spinner.
- Add retry button for failed payments.
- Track number of poll attempts and auto-timeout after threshold with user feedback.

<h1 align="center">AltruiShare Frontend</h1>

Production-ready Next.js (App Router + TypeScript) frontend for the AltruiShare platform.

## Quick Start

Create a local env file:
```bash
cp .env.local.example .env.local
```

Install deps & run dev server:
```bash
npm install
npm run dev
```
App runs at http://localhost:3000

## Scripts
```bash
npm run dev       # Start development (Next.js)
npm run build     # Production build
npm start         # Run built app
npm run lint      # Lint
npm test          # (Will run Jest tests once added)
```

## Environment Variables
See `.env.local.example` for required vars.

## Stack
- Next.js (App Router, SSR/SSG)
- TypeScript
- TailwindCSS & shadcn/ui (UI primitives)
- framer-motion (animations)
- next-pwa (offline-first PWA)
- Axios (API client) with Frappe backend (`status/message/data` contract)

## Project Goals
Build a PWA-ready, accessible, domain-driven frontend integrating with Frappe BaaS endpoints for auth, needs, donations, payments, impact analytics, volunteers, notifications & files.

## Domain Structure (planned)
```
src/
	app/
	features/
	entities/
	shared/
	styles/
	config/
```

## Development Roadmap (high-level)
1. Core scaffold & env
2. Tailwind + base UI
3. PWA config
4. Typed API layer
5. Auth flows
6. Needs discovery
7. Donation flow
8. File uploads
9. Impact dashboard
10. Notifications & offline queue
11. Tests & CI
12. Docs & release

## License
MIT (TBD)

---
Further documentation will be added as features land.
