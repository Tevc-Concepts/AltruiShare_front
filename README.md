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

### In‑Kind (Items) Donations
Located in `src/features/donations/components/ItemDonationForm.tsx` and integrated via `DonationTabsClient` in the Need detail page. Users can:
- Add one or more item rows (description + optional quantity)
- Remove rows dynamically
- Submit payload as `donation_type: 'Items'` via `donationApi.create`
- Validation ensures every item has a description (alerts user otherwise)

Testing (`ItemDonationForm.test.tsx`) covers:
- Validation message for empty description
- Correct API payload structure (need_id, donation_type, items array)
- Dynamic row add/remove behavior

Future ideas:
- Add per-item condition/category fields
- Bulk paste parsing (multi-line -> multiple items)
- Client-side optimistic append to a donations list

## Volunteer Feature
Files: `src/shared/api/endpoints/volunteer.ts`, `src/features/volunteer/components/*`, `src/app/volunteer`.

Capabilities:
- List opportunities (`volunteerApi.list`) with remote badge, skills, capacity snippet
- View detailed opportunity (`volunteerApi.get`)
- Sign up (`volunteerApi.signup`) with optimistic UI state (button label transitions Sign Up → Registering… → Registered)

Resilience:
- Loading & error states per component
- Effect cleanup guards against state updates after unmount

Testing (`Volunteer.test.tsx`) validates:
- List fetch & selection callback
- Detail load + signup flow updates state
- Unauthenticated user sees login prompt instead of signup button

Future enhancements:
- Filter/search by skill or remote
- Disable signup when capacity full
- Add cancellations / withdrawals
- Track volunteer hours (`/volunteer/hours` placeholder path)

## Profile & Avatar
Profile components: `ProfileCard`, `ProfileForm`, `AvatarUpload` under `src/features/profile/components`.

Avatar Upload:
- Uses generic `useFileUpload` hook (`auto` + single concurrency) to upload one file
- On success, calls `userApi.updateProfile({ avatar_url })` then triggers `AuthProvider.refresh()` to sync context
- Shows progress bar (0–100%) with accessible live region semantics (implicit via text updates)

Profile Link:
- Added conditional `Profile` nav link in `AppHeader` (desktop + mobile) only when `user` is present
	- Tested in `AppHeader.profileLink.test.tsx`

Testing (`AvatarUpload.test.tsx`):
- Mocks `fileApi.upload` & `userApi.updateProfile`
- Asserts profile update with returned URL
- Verifies progress bar reaches 100%

Future profile additions:
- Editable bio, timezone, location
- Impact badges & leaderboard summary
- Accessibility: add alt text editor for avatar


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

---
### Recently Added (Changelog Snippet)
| Date | Feature | Summary |
| ---- | ------- | ------- |
| 2025-09 | In‑Kind Donations | Multi-item form + tests, validation & tabbed UI integration. |
| 2025-09 | Volunteer | Opportunity list/detail/signup with tests. |
| 2025-09 | Profile Enhancements | Avatar upload + Profile nav link & tests. |

