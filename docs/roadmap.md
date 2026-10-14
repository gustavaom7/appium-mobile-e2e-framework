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

## Phase 2: Coverage
- [ ] Catalog sort (4 options, data-driven) and product details
- [ ] Cart: add/remove/quantity via counter, cart badge
- [ ] Full checkout: address → payment → review → complete, field validation table
- [ ] Deep links with payload (`cart/id=1&amount=2&color=black`) to seed the cart
- [ ] Navigation component: Android drawer vs iOS tab bar (`byPlatform`)

## Phase 3: Mobile-specific depth
- [ ] Gestures: scroll to element, swipe, drawing canvas (W3C actions)
- [ ] NATIVE ↔ WEBVIEW context switch (Webview screen)
- [ ] Geolocation (`setGeoLocation`) and permissions
- [ ] Interruptions: background/foreground, rotation
- [ ] iOS simulator job on `macos-latest` (nightly + manual)

## Phase 4: Reporting & scale
- [ ] Allure with screenshots/video (`startRecordingScreen`), published to GitHub Pages
- [ ] Optional Slack notification
- [ ] Optional cloud device farm config (`wdio.cloud.conf.ts`), enabled only when secrets exist

## Phase 5: AI-assisted workflow
- [ ] Appium MCP server in `.mcp.json` to explore screens live
- [ ] `explore-and-generate-screens` skill: screen map → draft Screen Object + spec
- [ ] Failure triage into Jira-ready bug drafts
- [ ] Track how much human editing generated code needs
