# AltruiShare Requirements Implementation Checklist

Status legend: [ ] not started · [~] in progress · [x] done · [>] deferred/later

## 1. Architecture & Foundation
- [x] DDA folder structure validated (/app /features /entities /shared /config)
- [~] Absolute imports & path aliases configured (base TS paths; verify remaining refs)
- [x] Tailwind theme tokens (gradients, shadows, semantic colors)
- [~] shadcn/ui integrated & documented (primitives started)
- [~] PWA config (next-pwa) & service worker strategy review (offline route + sw present)
- [x] API client with envelope normalization + error handling
- [ ] Global error boundary & loading states

## 2. Authentication & User Management
- [x] Auth login/register pages
- [x] Role fetch + guest preview
- [ ] MFA UI (modal or step) scaffold
- [ ] Social login placeholder buttons
- [ ] Profile dashboard shell
- [ ] Privacy & notification settings page

## 3. Roles & Capabilities
- [x] Role enum + capability enum definitions
- [x] Role→capability matrix mapping file
- [x] Utility to check capability (hasCapability)
- [ ] Dynamic capability-driven UI gating
- [ ] Documentation for roles & capabilities

## 4. Onboarding Flows
- [ ] Multi-step wizard component (progress, validation, persistence)
- [ ] Role selection step
- [ ] Donor onboarding (preferences, impact interests)
- [ ] NGO onboarding (organization info, verification kickoff)
- [ ] Corporate onboarding (org struct, campaign defaults)
- [ ] Volunteer onboarding (skills, availability)
- [ ] Logistics onboarding (fleet info, service areas)
- [ ] Service provider onboarding (donation types, pickup schedule)
- [ ] Auto-save draft state (localStorage)

## 5. Organization Verification
- [ ] Verification wizard (steps: intro → docs → attestations → review → submit)
- [ ] Document upload component (drag-drop + camera placeholder)
- [ ] Trust badge rendering based on status
- [ ] Status polling hook

## 6. Need Management
- [~] Create need form (baseline)
- [ ] Edit/update need form
- [ ] Need list with filters (status, category, role)
- [ ] Location-aware discovery (geolocation placeholder)
- [ ] Recommendations service placeholder
- [ ] Need detail page with donation progress

## 7. Donation Management
- [ ] Monetary donation form (amount presets, currency formatting)
- [ ] Payment request + verify integration (mock until backend ready)
- [ ] In-kind donation form (items, quantity, images upload)
- [ ] Donation receipts listing + print/PDF
- [ ] Donation progress timeline component

## 8. Logistics Coordination
- [ ] Pickup scheduling form
- [ ] Delivery list & status tags
- [ ] Route visualization placeholder (map container)
- [ ] Proof of pickup/delivery (photo/QR component)
- [ ] Offline queue for pending logistics actions

## 9. Volunteer Management
- [ ] Opportunity list (filters: category, date)
- [ ] Opportunity detail + signup CTA
- [ ] Hour logging form
- [ ] Volunteer history timeline with points

## 10. Impact Tracking
- [x] Impact dashboard base (charts)
- [ ] Loading skeletons for charts
- [ ] Accessible chart descriptions
- [ ] ESG report export placeholder
- [ ] Timeline linking donations → outcomes

## 11. Notifications & Messaging
- [x] Notifications panel (list, mark read)
- [ ] Mark all read mutation
- [ ] Unread badge in side nav
- [ ] In-app messaging skeleton (conversation + thread)
- [ ] Realtime/polling hybrid strategy doc

## 12. Gamification
- [ ] Badge entity & award logic placeholder
- [ ] Badge display component
- [ ] Leaderboards (donations, volunteer hours)
- [ ] Campaign challenge progress component

## 13. Beneficiaries & Stories
- [ ] Beneficiary registration form
- [ ] Privacy controls (anonymize option)
- [ ] Impact story card component

## 14. Payments (Regional)
- [ ] Payment method abstraction interface
- [ ] Mobile money flow placeholder UI
- [ ] USSD instruction modal
- [ ] Payment status polling hook

## 15. Localization & Regionalization
- [ ] next-intl setup
- [ ] Locale switcher component
- [ ] Base message catalogs (en, fr)
- [ ] Additional language placeholders (Yoruba, Hausa, Igbo)
- [ ] Currency & date formatting utility

## 16. Blockchain Integration (Trust)
- [ ] Transaction badge component (hash link)
- [ ] Journey timeline UI placeholder
- [ ] Attestation status polling hook

## 17. Employee Engagement (Corporate)
- [ ] Corporate campaign dashboard shell
- [ ] Team leaderboard variant
- [ ] Volunteer time-off management UI placeholder

## 18. Global UI / Navigation
- [x] Collapsible side navigation (role-aware)
- [x] Menu config file (role→sections→items)
- [x] Active route highlighting & keyboard nav (highlighting implemented; advanced keyboard focus mgmt TBD)
- [x] Persisted collapse state
- [x] Mobile slide-over variant (AppHeader + drawer)
- [ ] Top bar (search, notifications icon, user menu)

## 19. Offline & PWA
- [x] Offline fallback route (/offline)
- [x] Online status hook + banner
- [ ] Offline navigation guard (auto redirect + restore)
- [ ] Generalized action queue (beyond notifications) (notifications queue exists)
- [ ] Cache strategy documentation

## 20. Performance & Scalability
- [ ] Dynamic import for heavy charts
- [ ] Bundle size budget checks
- [ ] Real Lighthouse audit stored
- [ ] Image optimization review
- [ ] Preload critical fonts/assets

## 21. Accessibility
- [x] Base a11y tests (layout, skip link)
- [ ] axe automated test integration
- [ ] Focus visible enhancements for custom components
- [ ] Color contrast token validation
- [ ] ARIA labels on charts & interactive widgets
- [~] Dark mode contrast review (initial toggle & tokens)

## 22. Security & Compliance
- [ ] Security headers (CSP, frame-ancestors, referrer-policy)
- [ ] CSRF token handling (frontend fetch wrapper)
- [ ] Cookie consent banner
- [ ] Privacy settings page
- [ ] Minimal PII logging policy doc

## 23. Observability & Monitoring
- [ ] Performance marks hook
- [ ] Simple client logger abstraction
- [ ] Error boundary metrics emission placeholder

## 24. Testing Strategy
- [x] Unit tests foundation
- [x] Navigation & layout tests (SideNav role filtering, collapse, DashboardLayout integration, smoke pages updated)
- [ ] Integration tests for onboarding wizard
- [ ] Menu accessibility tests (keyboard, roles)
- [ ] Donation flow tests
- [ ] Volunteer flow tests
- [ ] Offline guard tests
- [ ] Payment flow tests (mocked)
- [ ] Localization snapshot tests
- [ ] Badge/leaderboard logic tests

## 25. Documentation
- [x] API mapping
- [x] Final run summary
- [ ] Roles & capabilities doc
- [ ] Onboarding flow doc
- [ ] Offline/PWA strategy doc
- [ ] Performance tuning guide

---
Generated checklist to drive phased implementation.
