# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

Appium 3 + WebdriverIO 10 + TypeScript (ESM) mobile E2E suite against Sauce Labs My Demo App (React Native), Android and iOS from the same code. No app source here; the app is downloaded from its GitHub release (`config/app.ts` pins the version).

## Commands

```bash
npm install                          # deps + uiautomator2 driver (devDependency)
npm run drivers:ios                  # xcuitest, iOS only
npm run app:android | app:ios        # download the app build into apps/
npm run test:android | test:ios      # full suite (needs a running emulator/simulator)
npm run smoke:android                # TAG=@smoke
npm run test:android-web | smoke:android-web   # SauceDemo in the emulator's Chrome (tests/web/)
npm run report && npm run report:open           # Allure report of the last run; NO_VIDEO=1 skips recording
npx wdio run config/wdio.android.conf.ts --spec tests/auth/login.spec.ts   # one file
npm run lint && npm run typecheck    # run both before every commit
```

## Architecture rules

- Selectors: accessibility id via `byId()` works cross-platform (Android `accessibilityLabel` and iOS `testID` share the string). RN inputs are `"<Label> input field"`, buttons `"<Title> button"`, screen roots `"<name> screen"`. Find ids in the app source: `src/config/translations/en.ts`.
- Use `byPlatform()` only where the UI differs (Android drawer vs iOS tab bar). Use `byText()` for copy with no id (error messages).
- WDIO 10 selectors are strict: `$()` throws when it matches more than one element. For lists (store items, cart rows) use `$$()` and index (`$$(sel)[0]`).
- Mobile web (SauceDemo): Page Objects in `web/pages/` with `data-test` selectors (`web/selectors.ts`); log in with `loginAs()` (session cookie) and isolate with `resetSession()` (`web/session.ts`).
- Selectors live in `screens/` (native) or `web/pages/` (web); specs never call `$`/`$$` (lint-enforced). No `driver.pause()` (lint-enforced): wait on a screen root or element.
- Navigation for setup uses deep links (`utils/deeplink.ts`, routes from the app's `src/navigation/Linking.ts`). Reset state with `resetApp()` (`utils/app.ts`: `mobile: clearApp` + relaunch). Do not use the app's long-press-logo reset: it keeps the user logged in, and the login route only exists while logged out.
- `resetApp()` on Android has two steps that look removable but are not: HOME, then wait until `dumpsys` shows the activity STOPPED, before `pm clear` (clearing an activity that is still visible or PAUSED arms a "remove-task" timer that kills the relaunched app; app state alone flips too early), and `am wait-for-broadcast-idle` before relaunch (late `pm clear` broadcasts trigger a configuration change on slow emulators). Both only showed up as intermittent CI failures.
- My Demo App crashes whenever Android recreates its activity ("Screen fragments should never be restored", react-native-screens). Its manifest handles `keyboard|keyboardHidden|orientation|screenSize|uiMode`, so dark mode is safe; font scale, density, locale and restoring after the process was killed in the background are not. Rotation does not apply: the app is locked to portrait (`screenOrientation="portrait"`), `setOrientation` fails; rotation is tested in the mobile-web suite. Check the CI artifact's `logs/logcat-crash.txt` before blaming the suite.
- Product pages opened by deep link (`product-details/<id>`) are display-only: their Add To Cart adds an item without price (the app compares the string route id with `===`) and the cart then crashes on a NaN total. To add to the cart, open the product from the catalog (`CatalogScreen.openProduct`). A deep link from one product page to another also reuses the screen, keeping the previous counter.
- Checkout payment: a format error (bad card checksum, expired date) shows once the value is complete, but tapping Review Order clears the message while still blocking the form. Assert the error before submitting.
- After a successful login with no pending destination, the app lands on the checkout address screen. This is app behavior, not a bug.
- Tags in `describe`/`it` titles (`@smoke`, `@regression`); filter with `TAG` (include) / `SEM_TAG` (exclude), combinable.
- CI runs `@smoke` only (every trigger); `@regression` runs locally. Tag a test `@smoke` only if it must gate every PR: keep that set small.
- Imports use explicit `.ts` extensions (ESM + `allowImportingTsExtensions`).

## AI workflow

- Appium MCP (`.mcp.json`, guide in `docs/appium-mcp.md`) is for exploring screens, not for running the suite. Never keep an MCP session open while WDIO runs: both drive the device's UiAutomator2 server.
- New screens: `/explore-and-generate-screens`. Commit the draft untouched with an `AI-Draft:` trailer, fix in later commits (`npm run ai:edit-stats` measures the difference).
- Red CI run: `/triage-ci-failure`. Classify from evidence; Jira drafts are handed to the user, never filed.
