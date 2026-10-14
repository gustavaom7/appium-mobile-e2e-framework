# Roadmap

## Phase 1: Foundation ✅ (green on the Android emulator in CI; iOS not run yet)
- WebdriverIO 10 + Appium 3 + TypeScript, Mocha, lint/typecheck
- Shared/Android/iOS configs, pinned app release download
- Screen Objects: Login, Catalog, CheckoutAddress; `resetApp()` for isolation
- Specs: app launch (@smoke), login happy path (@smoke) + 4 data-driven negative cases
- Android CI on emulator with failure evidence

## Mobile web ✅ (green in CI: `E2E (Android Chrome)`, full suite)
SauceDemo in the emulator's real Chrome, complementing the Playwright repo's device emulation.
- [x] `wdio.android-web.conf.ts` (Chrome, auto-downloaded chromedriver), Page Objects in `web/pages/`
- [x] Cookie login (`session-username`) and cookie + localStorage isolation
- [x] Full checkout (@smoke); data-driven invalid logins
- [x] Menu, logout and reset by real touch (W3C touch pointer)
- [x] On-screen keyboard: viewport shrink, native dismissal (NATIVE_APP context)
- [x] Rotation mid-checkout
- [x] `E2E (Android Chrome)` job green in CI (smoke on the PR, full suite on a manual run)

## Phase 2: Coverage ✅ (green on the local emulator; @regression runs locally, CI runs @smoke)
- [x] Catalog sort (4 options, data-driven) and product details (all 6 products, counter)
- [x] Cart: add with color/amount, row counter, remove, empty cart, badge
- [x] Full checkout: address → payment → review → complete, field validation table
- [x] Deep links with payload (`cart/id=1&amount=2&color=black`) to seed the cart
- [x] Menu navigation (destinations, login/logout, reset state); Android drawer vs iOS tab bar via `byPlatform`, iOS side not run yet
- App bugs found and documented in CLAUDE.md: Add To Cart on deep-linked product pages, payment errors cleared on submit, crash on activity recreation

## Phase 3: Mobile-specific depth (green on the local emulator; iOS job still open)
- [x] Gestures: scroll to element, swipe, drawing canvas (W3C touch actions, canvas pixels read in its WebView)
- [x] NATIVE ↔ WEBVIEW context switch (Webview screen, driven with the mobile-web Page Objects)
- [x] Geolocation (`setGeoLocation`: show, follow, stop observing) and permissions (re-granted after reset)
- [x] Interruptions: background/foreground, screen lock. Rotation: not applicable, the app is locked to portrait (covered in the mobile-web suite)
- [ ] iOS simulator job on `macos-latest` (nightly + manual)

## Phase 4: Reporting & scale 🟡 (local report done; GitHub Pages publish pending its first run)
- [x] Allure report with screenshot, page source and screen recording on failure (`npm run report`)
- [ ] Published to GitHub Pages from `main` (job `Allure report` added, first deploy pending)
- Dropped: Slack notification, cloud device farm config (no credentials to run it; untested code stays out)

## Phase 5: AI-assisted workflow ✅ (tooling in place; first generated screen pending)
- [x] Appium MCP server in `.mcp.json` to explore screens live (`docs/appium-mcp.md`)
- [x] `explore-and-generate-screens` skill: screen map → draft Screen Object + spec, draft committed untouched
- [x] `triage-ci-failure` skill: evidence-first triage, Jira-ready drafts for app bugs
- [x] `npm run ai:edit-stats`: share of AI-drafted lines kept vs edited by humans
