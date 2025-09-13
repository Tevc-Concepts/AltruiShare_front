# AltruiShare Frontend Roadmap

_Last updated: 2025-09-13_

## Guiding Objectives
- Fast, reliable donation & needs matching experience (PWA-first).
- Clear impact visualization & community engagement.
- Accessible (WCAG 2.1 AA) and internationalized UI.
- Offline resilience with graceful degradation & queued actions.
- Observable, testable, maintainable code (>=90% lines for core flows).

## Phase 0 – Hardening & Foundation (Week 0–1)
**Goals:** Stabilize current surface, unify UX for loading/error, ensure baseline a11y.
- Accessibility audit (focus order, ARIA for dynamic regions, contrast check).
- Standard loading & error components in `@shared/ui` (skeleton + toast/error boundary guidelines doc).
- Payment polling robustness: add retry + circuit breaker design (spec only).
- AuthProvider: add logout & error path tests (optional if time).
- Document conventions (`doc/Architecture.md` if missing – future).
**Exit Criteria:** No critical axe violations; consistent loading/error UI; all tests green; coverage unchanged or higher.

## Phase 1 – Core Engagement & Reliability (Weeks 1–3)
**Epics:**
1. Authentication Hardening
   - Session refresh (if backend token refresh available) or graceful 401 re-login.
   - MFA placeholder flow (UI + stubbed handler).
   - Central auth error boundary (redirect or modal).
2. Donations Flow Enhancements
   - Draft persistence (localStorage) for monetary & item donations.
   - Robust payment polling (exponential backoff on transient errors, max attempts, terminal state handling spec implementation).
   - Post-success confirmation view with share links (social meta tags stub).
3. Needs Discovery Improvements
   - Advanced filters (category, urgency, location radius slider or input).
   - SWR-style cache layer (stale-while-revalidate) for needs list.
4. PWA Baseline
   - Integrate `next-pwa` config (service worker, precache static assets, offline fallback page `/offline`).
   - Offline banner component with reconnect retry.
**Exit Criteria:** Donation drafts recover after refresh; offline fallback renders; needs list cache works; payment polling has retry & max cap.

## Phase 2 – Impact & Community (Weeks 3–6)
**Epics:**
1. Impact Dashboard Expansion
   - Time range selector (7d/30d/custom) + drill-down interactions.
   - Loading skeleton & empty states.
2. Notifications System Upgrade
   - Real-time channel abstraction (poll → optional WebSocket fallback if backend later supports).
   - Grouping & bulk mark-as-read.
   - Browser push opt-in (service worker integration, permission flow modal).
3. Volunteer & Logistics (Initial Surface)
   - Volunteer opportunities list + interest action.
   - Logistics task board (read-only prototype).
4. Internationalization (i18n) Rollout
   - Global provider + locale switcher UI.
   - Extract and translate strings for top 5 pages (en base, placeholders for others).
**Exit Criteria:** Dashboard interactive filters; push opt-in functional; volunteer list reads from API; locale switching changes visible strings.

## Phase 3 – Gamification & Retention (Weeks 6–9)
**Epics:**
1. Badges & Leaderboards
   - Badge config JSON + mapping to impact metrics.
   - Leaderboard (weekly & all-time) with pagination.
2. Engagement Nudges
   - Streak tracking (daily visit or donation) + local cache.
   - Targeted notification templates (e.g., near-complete need). 
3. Social Sharing
   - Dynamic Open Graph tags for donation & need pages.
   - Shareable impact summary card (image or HTML meta approach).
**Exit Criteria:** At least one badge awarded; leaderboard visible; OG tags validate; streak UI appears after multi-day use (simulated).

## Phase 4 – Advanced Offline & Performance (Weeks 9–11)
**Epics:**
1. Offline Queues
   - Queue donations / uploads / volunteer interest; sync manager on reconnect.
   - Conflict handling (server already fulfilled state).
2. Performance & Bundle Budget
   - Lighthouse CI pipeline with thresholds (PWA ≥90, Performance ≥85, Accessibility ≥95).
   - Code splitting for charts & large libs; dynamic import metrics.
   - Image optimization (Next Image + responsive strategy doc).
3. Resilient File Uploads
   - (If backend supports) chunked uploads & resume tokens.
   - Adaptive concurrency (measure & tune).
**Exit Criteria:** Donations & uploads can be queued offline; Lighthouse thresholds met in CI; large charts loaded lazily.

## Phase 5 – Security & Compliance (Weeks 11–12)
**Epics:**
1. Role-Based Presentation
   - Hide restricted actions based on user roles/permissions.
2. Audit & Activity Log Viewer (if API available) or placeholder.
3. Privacy & Consent
   - Cookie / tracking preference panel.
4. Input Hardening
   - Password strength meter, email normalization, basic client validation utilities.
**Exit Criteria:** Role gating enforced; consent panel accessible; password meter active; no unvalidated raw inputs for critical actions.

## Continuous Workstreams
- Accessibility: Automated axe checks integrated into CI.
- Observability: Pluggable error & event logger (Sentry-ready) + dashboard for queued offline actions.
- DX: Optional Storybook for UI primitives & complex cards.
- Quality: Mutation testing (optional) or contract tests against backend schema (OpenAPI if exposed).

## Metrics & Success Indicators
| Area | Target |
|------|--------|
| Core Flow Coverage | ≥90% lines (auth, donate, needs, impact) |
| Lighthouse PWA | ≥90 |
| Avg TTI (desktop simulated) | < 3.5s |
| A11y Violations (critical) | 0 |
| Error Rate (frontend logged) | < 1% of sessions |
| Offline Donation Queue Success | ≥95% sync success in test scenarios |

## Risk & Mitigation
- Polling Overload: Implement capped retries + exponential backoff early (Phase 1) to prevent backend strain.
- Service Worker Staleness: Version stamp & update toast (prompt user to refresh).
- Large Library Bloat: Early bundle analysis to avoid late rewrite.
- i18n Drift: Lint rule or script to detect untranslated strings.

## Implementation Order Justification
Foundational reliability (Phase 0–1) precedes engagement (2–3) which precedes advanced optimization (4) and security polish (5). This sequencing lowers rework risk and ensures we have stable primitives before layering on growth & retention features.

## Immediate Next (If Starting Phase 0 Now)
1. Add shared Loading and Error components.
2. Axe scan script (jest-axe or playwright later) + baseline report.
3. Payment polling retry strategy doc snippet in comments near implementation.

---
_Amendments:_ Adjust phase boundaries if backend dependencies (e.g., volunteer APIs, chunked upload) shift. Re-run risk review every two phases.
