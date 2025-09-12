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
