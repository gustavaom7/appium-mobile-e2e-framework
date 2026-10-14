# Appium Mobile E2E Framework

[![Android E2E](https://github.com/gustavaom7/appium-mobile-e2e-framework/actions/workflows/android.yml/badge.svg)](https://github.com/gustavaom7/appium-mobile-e2e-framework/actions/workflows/android.yml)

Cross-platform mobile end-to-end suite built with **Appium 3**, **WebdriverIO 10** and **TypeScript**, exercising the open-source [Sauce Labs My Demo App (React Native)](https://github.com/saucelabs/my-demo-app-rn) on Android and iOS from **one set of Screen Objects and specs**.

> Portfolio project. Status is tracked honestly in the [roadmap](docs/roadmap.md): what runs in CI today is marked as such, and what is planned is marked as planned.

## Why this repo

| Capability | Where | Status |
|---|---|---|
| One codebase for Android + iOS | `utils/selectors.ts`, `screens/` | ✅ Android green in CI · ⚠️ iOS: config ready, not yet run |
| Screen Object Model | `screens/` | ✅ |
| State setup without replaying the UI (deep links) | `utils/deeplink.ts` | ✅ |
| Test isolation inside one Appium session | `utils/app.ts` (`mobile: clearApp` + relaunch) | ✅ |
| Data-driven negative tests | `tests/auth/login.spec.ts` | ✅ |
| CI on a real Android emulator (KVM + AVD cache) | `.github/workflows/android.yml` | ✅ |
| Failure evidence (screenshot + page source + screen recording) in an Allure report, JUnit for CI | `utils/evidence.ts`, `config/wdio.shared.conf.ts` | ✅ [latest report](https://gustavaom7.github.io/appium-mobile-e2e-framework/) |
| Lint rules that enforce the architecture | `eslint.config.js` | ✅ no `pause()`, no selectors in specs |
| Mobile web in the emulator's real Chrome: touch, on-screen keyboard, rotation | `config/wdio.android-web.conf.ts`, `web/`, `tests/web/` | ✅ green in CI (`E2E (Android Chrome)`) |
| Gestures (touch drawing, swipe, scroll to element) | `tests/device/gestures.spec.ts`, `utils/gestures.ts` | ✅ local |
| NATIVE ↔ WEBVIEW context switch | `tests/hybrid/webview.spec.ts`, `utils/context.ts` | ✅ local |
| Mocked GPS, interruptions (background, screen lock) | `tests/device/` | ✅ local |
| AI-assisted workflow: Appium MCP exploration, screen-object generation, CI failure triage, edit stats | `.mcp.json`, `.claude/skills/`, [`docs/appium-mcp.md`](docs/appium-mcp.md) | ✅ |
| iOS CI | — | 🗓️ [roadmap](docs/roadmap.md) |

## How the cross-platform selectors work

My Demo App sets `accessibilityLabel` on Android and `testID` on iOS **from the same string** ([`TestProperties.ts`](https://github.com/saucelabs/my-demo-app-rn/blob/main/src/config/TestProperties.ts)). Appium's accessibility-id strategy (`~id`) maps to `content-desc` on Android and `name` on iOS, so one selector works on both:

```ts
$('~products screen')        // catalog root, Android and iOS
$('~Username input field')   // RN inputs: "<Label> input field"
$('~Login button')           // RN buttons: "<Title> button"
```

`byPlatform({ android, ios })` exists for the places where the UI really differs (Android has a drawer menu, iOS a tab bar).

## Mobile web: real device vs emulation

The same SauceDemo flows are covered in the [Playwright repo](https://github.com/gustavaom7/playwright-typescript-e2e-framework) with device emulation (`tests/mobile/mobile.spec.ts`). This suite runs them in the real Chrome of an Android emulator, for what emulation cannot reproduce:

| | Native app (Appium, `tests/` minus `web/`) | Mobile web, real Chrome (Appium, `tests/web/`) | Mobile web, emulation (Playwright) |
|---|---|---|---|
| What runs | My Demo App (React Native) | SauceDemo in Android's Chrome | SauceDemo in desktop Chromium with a phone viewport/UA |
| Touch | Native gestures | W3C touch pointer (`pointerdown:touch`, `touchstart`) | Synthetic touch with `hasTouch` |
| On-screen keyboard | Real | Real: shrinks the visible viewport (786 → 474 CSS px on a Pixel AVD, covering Continue) | None |
| Rotation | Real | Real device rotation, page re-laid out mid-flow | Viewport resize only |
| Browser engine | — | Chrome for Android | Desktop Chromium |
| Speed / setup | Slow, needs an emulator + app build | Slow, needs an emulator | Fast, no device |
| Best for | App behavior | Device-only web behavior | Responsive layout and flows, at scale |

Login uses the `session-username` cookie (the `storageState` equivalent) and tests are isolated by clearing cookies and localStorage, so Chrome is not restarted between tests.

## Project structure

```
config/        app.ts (app id, release), wdio.shared/android/ios.conf.ts
screens/       BaseScreen + one class per screen
web/           mobile web: pages/ (Page Objects, data-test selectors), session.ts, gestures.ts, device.ts
tests/         smoke/, auth/, catalog/, cart/, checkout/, web/ (SauceDemo); tagged @smoke (CI) / @regression (local)
fixtures/      users and products (data the app ships with), saucedemo.ts
utils/         selectors.ts, deeplink.ts, app.ts (reset)
scripts/       download-app.ts (fetches the pinned app release)
```

## Running locally

Prerequisites: Node 22+, Java 17+, Android SDK with platform-tools, emulator and build-tools (`aapt2`) and an AVD (`ANDROID_HOME` set); for iOS, macOS with Xcode.

```bash
npm install                     # also installs the Appium uiautomator2 driver (devDependency)
npm run drivers:ios             # iOS only: appium driver install xcuitest
npm run app:android             # downloads the pinned My Demo App APK into apps/
# start an emulator (Android Studio or `emulator -avd <name>`)
npm run test:android            # full suite
npm run smoke:android           # @smoke only
npm run test:android-web        # SauceDemo in the emulator's Chrome (chromedriver auto-downloaded)
npm run smoke:android-web       # web @smoke only
npm run report && npm run report:open   # Allure report of the last run (reports/allure-report)
```

iOS (simulator): `npm run app:ios && npm run test:ios`. Set `IOS_DEVICE_NAME` / `IOS_PLATFORM_VERSION` to match an installed simulator.

Useful env vars: `TAG=@smoke` / `SEM_TAG=@slow` (include / exclude, combinable), `TIMEOUT_FACTOR=2` (slow machines/CI), `NO_VIDEO=1` (skip screen recording), `ANDROID_APP` / `IOS_APP` (custom build path), `APP_RELEASE` (another My Demo App release).

Troubleshooting: `npm run doctor:android` / `npm run doctor:ios` run Appium's driver doctor.

## CI

`.github/workflows/android.yml`: lint + typecheck, then two jobs on an API 34 emulator (`reactivecircus/android-emulator-runner`, KVM enabled, AVD snapshot cached): the native suite and the mobile-web suite (`E2E (Android Chrome)`). CI runs `@smoke` only, on every trigger (push, PR, nightly, manual); the `@regression` suites run locally with `npm run test:android` / `npm run test:android-web`. Reports, screenshots, page sources and the Appium log are uploaded as an artifact.

Failed tests carry a screenshot, the page source and a screen recording (the device records every test; the video is kept only on failure). From `main` (push and nightly) a last job merges both suites' Allure results into one report and publishes it to GitHub Pages: [latest report](https://gustavaom7.github.io/appium-mobile-e2e-framework/).

## Related repos

[Playwright (web)](https://github.com/gustavaom7/playwright-typescript-e2e-framework) · [RestAssured (API)](https://github.com/gustavaom7/api-testing-restassured) · [XCUITest (iOS native)](https://github.com/gustavaom7/xcuitest-ios-automation) · [Maestro (mobile + AI)](https://github.com/gustavaom7/maestro-mobile-ai-qa)
