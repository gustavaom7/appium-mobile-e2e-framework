# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

Appium 3 + WebdriverIO 10 + TypeScript (ESM) mobile E2E suite against Sauce Labs My Demo App (React Native), Android and iOS from the same code. No app source here; the app is downloaded from its GitHub release (`config/app.ts` pins the version).

## Commands

```bash
npm install && npm run drivers      # deps + Appium drivers (uiautomator2, xcuitest)
npm run app:android | app:ios        # download the app build into apps/
npm run test:android | test:ios      # full suite (needs a running emulator/simulator)
npm run smoke:android                # TAG=@smoke
npx wdio run config/wdio.android.conf.ts --spec tests/auth/login.spec.ts   # one file
npm run lint && npm run typecheck    # run both before every commit
```

## Architecture rules

- Selectors: accessibility id via `byId()` works cross-platform (Android `accessibilityLabel` and iOS `testID` share the string). RN inputs are `"<Label> input field"`, buttons `"<Title> button"`, screen roots `"<name> screen"`. Find ids in the app source: `src/config/translations/en.ts`.
- Use `byPlatform()` only where the UI differs (Android drawer vs iOS tab bar). Use `byText()` for copy with no id (error messages).
- WDIO 10 selectors are strict: `$()` throws when it matches more than one element. For lists (store items, cart rows) use `$$()` and index (`$$(sel)[0]`).
- Selectors live in `screens/`; specs never call `$`/`$$` (lint-enforced). No `driver.pause()` (lint-enforced): wait on a screen root or element.
- Navigation for setup uses deep links (`utils/deeplink.ts`, routes from the app's `src/navigation/Linking.ts`). Reset state with `AppHeader.resetAppState()` (long-press on the logo wipes the persisted store).
- After a successful login with no pending destination, the app lands on the checkout address screen. This is app behavior, not a bug.
- Tags in `describe`/`it` titles (`@smoke`, `@regression`); filter with `TAG` / `SEM_TAG` env vars.
- Imports use explicit `.ts` extensions (ESM + `allowImportingTsExtensions`).
