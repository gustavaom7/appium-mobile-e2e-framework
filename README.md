# Appium Mobile E2E Framework

[![Android E2E](https://github.com/gustavaom7/appium-mobile-e2e-framework/actions/workflows/android.yml/badge.svg)](https://github.com/gustavaom7/appium-mobile-e2e-framework/actions/workflows/android.yml)

Cross-platform mobile end-to-end suite built with **Appium 3**, **WebdriverIO 10** and **TypeScript**, exercising the open-source [Sauce Labs My Demo App (React Native)](https://github.com/saucelabs/my-demo-app-rn) on Android and iOS from **one set of Screen Objects and specs**.

> Portfolio project. Status is tracked honestly in the [roadmap](docs/roadmap.md): what runs in CI today is marked as such, and what is planned is marked as planned.

## Why this repo

| Capability | Where | Status |
|---|---|---|
| One codebase for Android + iOS | `utils/selectors.ts`, `screens/` | ⏳ Android: awaiting first CI run · ⚠️ iOS: config ready, not yet run |
| Screen Object Model | `screens/`, `screens/components/` | ✅ |
| State setup without replaying the UI (deep links) | `utils/deeplink.ts` | ✅ |
| Test isolation inside one Appium session | `utils/app.ts` (`mobile: clearApp` + relaunch) | ✅ |
| Data-driven negative tests | `tests/auth/login.spec.ts` | ✅ |
| CI on a real Android emulator (KVM + AVD cache) | `.github/workflows/android.yml` | ⏳ awaiting first run |
| Failure evidence (screenshot + page source + JUnit) | `config/wdio.shared.conf.ts` | ✅ |
| Lint rules that enforce the architecture | `eslint.config.js` | ✅ no `pause()`, no selectors in specs |
| Gestures, webview context, interruptions, iOS CI, Allure, AI-assisted generation | — | 🗓️ [roadmap](docs/roadmap.md) |

## How the cross-platform selectors work

My Demo App sets `accessibilityLabel` on Android and `testID` on iOS **from the same string** ([`TestProperties.ts`](https://github.com/saucelabs/my-demo-app-rn/blob/main/src/config/TestProperties.ts)). Appium's accessibility-id strategy (`~id`) maps to `content-desc` on Android and `name` on iOS, so one selector works on both:

```ts
$('~products screen')        // catalog root, Android and iOS
$('~Username input field')   // RN inputs: "<Label> input field"
$('~Login button')           // RN buttons: "<Title> button"
```

`byPlatform({ android, ios })` exists for the places where the UI really differs (Android has a drawer menu, iOS a tab bar).

## Project structure

```
config/        app.ts (app id, release), wdio.shared/android/ios.conf.ts
screens/       BaseScreen + one class per screen
tests/         smoke/, auth/ (catalog/, cart/, checkout/ next) tagged @smoke / @regression
fixtures/      users and products (data the app ships with)
utils/         selectors.ts, deeplink.ts, app.ts (reset)
scripts/       download-app.ts (fetches the pinned app release)
```

## Running locally

Prerequisites: Node 22+, Java 17+, Android SDK with an emulator (`ANDROID_HOME` set); for iOS, macOS with Xcode.

```bash
npm install
npm run drivers                 # appium driver install uiautomator2 + xcuitest
npm run app:android             # downloads the pinned My Demo App APK into apps/
# start an emulator (Android Studio or `emulator -avd <name>`)
npm run test:android            # full suite
npm run smoke:android           # @smoke only
```

iOS (simulator): `npm run app:ios && npm run test:ios`. Set `IOS_DEVICE_NAME` / `IOS_PLATFORM_VERSION` to match an installed simulator.

Useful env vars: `TAG=@smoke` / `SEM_TAG=@slow` (filter), `TIMEOUT_FACTOR=2` (slow machines/CI), `ANDROID_APP` / `IOS_APP` (custom build path), `APP_RELEASE` (another My Demo App release).

Troubleshooting: `npm run doctor:android` / `npm run doctor:ios` run Appium's driver doctor.

## CI

`.github/workflows/android.yml`: lint + typecheck, then the suite on an API 34 emulator (`reactivecircus/android-emulator-runner`, KVM enabled, AVD snapshot cached). Push/PR run `@smoke`; the nightly run and manual dispatches run everything. Reports, screenshots, page sources and the Appium log are uploaded as an artifact.

## Related repos

[Playwright (web)](https://github.com/gustavaom7/playwright-typescript-e2e-framework) · [RestAssured (API)](https://github.com/gustavaom7/api-testing-restassured) · [XCUITest (iOS native)](https://github.com/gustavaom7/xcuitest-ios-automation) · [Maestro (mobile + AI)](https://github.com/gustavaom7/maestro-mobile-ai-qa)
