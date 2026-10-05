# Roadmap

## Phase 1: Foundation (written; lint + typecheck green, awaiting first emulator run)
- WebdriverIO 10 + Appium 3 + TypeScript, Mocha, lint/typecheck
- Shared/Android/iOS configs, pinned app release download
- Screen Objects: Login, Catalog, CheckoutAddress, AppHeader
- Specs: app launch (@smoke), login happy path (@smoke) + 4 data-driven negative cases
- Android CI on emulator with failure evidence

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
