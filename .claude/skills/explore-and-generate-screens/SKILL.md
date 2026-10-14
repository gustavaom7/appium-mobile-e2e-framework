---
name: explore-and-generate-screens
description: Map a screen of My Demo App live through Appium MCP and draft a Screen Object + spec that follow this repo's rules. Use when asked to explore, map or automate a screen that has no Screen Object yet ("explore the about screen", "generate a screen object for X", "map this screen with appium mcp").
---

# Explore a screen and draft its Screen Object

Turns a live screen into code that looks like the rest of `screens/` and `tests/`. Read `CLAUDE.md` first: its selector, lint and app-quirk rules apply to everything generated here.

## 1. Preconditions

- Emulator running, app installed (`docs/appium-mcp.md` → Setup). `appium-mcp` connected (`/mcp`).
- **No WDIO run in progress**: both drive the same UiAutomator2 server.
- The screen has no Screen Object yet (`screens/`). If it has one, extend that file instead.

## 2. Explore (Appium MCP)

1. `select_device` (android) → `appium_session_management` `action=create` (capabilities come from `config/mcp-capabilities.json`).
2. Reach the screen the cheapest way: a deep link (`utils/deeplink.ts` routes) beats tapping through the menu.
3. `generate_locators` on the screen. Scroll (`appium_gesture` `scroll_to_element` / `swipe`) and repeat until the bottom: Android only exposes on-screen elements.
4. For each element worth automating, record: accessibility id, role (input / button / text / list item), copy, and whether it repeats (lists → `$$`).
5. Try the interactions the spec will need (tap, type, toggle) and note what changes on screen: that is what the spec will assert.
6. Find the screen's root id (`"<name> screen"`) and confirm the ids in the app source when unsure: `gh api repos/saucelabs/my-demo-app-rn/contents/src/config/translations/en.ts?ref=v1.3.0`.
7. End the session: `appium_session_management` `action=delete`.

## 3. Draft the code

- `screens/<Name>Screen.ts`: extends `BaseScreen` with the root id; getters for elements, methods for actions; selectors only through `utils/selectors.ts` (`byId`, `inputId`, `buttonId`, `textChild`, `byText`, `byPlatform`, `alertButton`). Copy that lives in a child of the id'd view → `textChild()`. Repeated ids → `$$()[i]` or scope to a row.
- `tests/<area>/<name>.spec.ts`: tagged `@regression` (never `@smoke` without being asked), setup by `resetApp()` + deep link, no `$`/`$$`, no `pause()`. Data-driven when cases differ only by data.
- Data the app ships with goes to `fixtures/`.
- Respect the app quirks in `CLAUDE.md` (deep-linked product pages cannot add to cart, portrait lock, recreation crash).

## 4. Commit the draft untouched

Commit exactly what was generated, before running or fixing anything, with a trailer so the edits that follow can be measured (`npm run ai:edit-stats`):

```
Draft <Name> screen object and spec (AI)

AI-Draft: explore-and-generate-screens
```

## 5. Verify and fix

`npm run lint && npm run typecheck`, then run only the new spec twice (`npx wdio run config/wdio.android.conf.ts --spec <file>`). Fix in **separate** commits. Report to the user: what was mapped, what the draft got wrong, and the edit stats.
