# Copilot Run Checklist (AltruiShare Frontend)

This checklist tracks the expected Copilot Agent steps during the fresh GPT-5 run.

---

## Step 1 — Repository Scan
- [ ] Run `git status`, `git branch`, `git log -n 10`
- [ ] List top-level files (`package.json`, configs, src/, public/)
- [ ] Run `npm ci` (or `npm install`)
- [ ] Run `npm run build` → save logs in `dev/reports/initial-scan.txt`

## Step 2 — Build Remediation
- [ ] If `babel.config.js` exists → delete, migrate to SWC
- [ ] Ensure no Turbopack; use SWC or Webpack default
- [ ] Re-run build → save logs
- [ ] Commit with message `chore(build): remediation attempt results`

## Step 3 — API Client Verification
- [ ] Verify `src/shared/api/client.ts` exists or create it
- [ ] Test base endpoint: `GET /as_api.auth_api.ping`
- [ ] Save sample API responses to `dev/reports/api-examples.json`
- [ ] Write `dev/reports/api-map.md` mapping features → Frappe endpoints

## Step 4 — Marketing Landing Page
- [ ] Create `/` landing page with:
  - Hero section (gradient, CTA buttons)
  - Feature grid (donations, needs, logistics, volunteers, impact)
  - Role spotlight (cards per persona with modal/expand details)
  - Role→Capability matrix (table or responsive cards)
- [ ] Accessible (WCAG 2.1 AA) and responsive
- [ ] Commit `feat(landing): add marketing landing page`

## Step 5 — Role-Based Gating
- [ ] Add guest preview mode
- [ ] Add login/register redirection for protected routes
- [ ] Use `/auth_api.get_logged_user` or `/pwa_api.get_user_roles`
- [ ] Commit `feat(auth): add guest preview + role-based gating`

## Step 6 — UI System
- [ ] Update `tailwind.config.js` with gradients/shadows tokens
- [ ] Create shared UI components: Card, Button, Badge
- [ ] Commit `feat(ui-system): add design tokens and primitives`

## Step 7 — QA Checks
- [ ] Run `npm run lint`
- [ ] Run `npm run test`
- [ ] Run `npm run build`
- [ ] Run `npm run start` and simulate offline (PWA check)
- [ ] Lighthouse audit → save to `dev/reports/lighthouse.json`
- [ ] Commit `chore(qc): lint/test/build + audit reports`

## Step 8 — Reporting
- [ ] Ensure commits are small and focused
- [ ] Branches: `feature/landing`, `feature/auth-checks`, `feature/ui-system`
- [ ] Final summary message includes:
  - Branch names + last 10 commits
  - How to run locally
  - Which endpoints used + example responses
  - Any mocked data / TODOs

---
