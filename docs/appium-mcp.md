# Exploring the app with Appium MCP

[Appium MCP](https://github.com/appium/appium-mcp) is an MCP server that lets an AI assistant (Claude Code here) drive a device through Appium: start a session, read the screen, tap, type, swipe, and generate locators. In this repo it is the **exploration** tool: map a screen you have not automated yet, then turn that map into a Screen Object and a spec that follow the suite's rules. The regression suite itself stays plain WebdriverIO.

## Setup

1. Android SDK and an emulator, as for the suite (`README.md` → Running locally). The server bundles its own UiAutomator2 driver: no global Appium needed.
2. The app installed on the emulator: `npm run app:android`, then run any spec once (`npm run smoke:android`), or `adb install apps/my-demo-app.apk`.
3. Start the emulator, then start Claude Code **from the repo root**. `.mcp.json` declares the server (pinned version); Claude Code asks once to approve project servers. `/mcp` shows whether `appium-mcp` is connected.

Config lives in two files:

| File | What it sets |
| --- | --- |
| `.mcp.json` | Server version, `ANDROID_HOME` (defaults to Homebrew's SDK path), where screenshots / page sources go (`reports/mcp/`, git-ignored) |
| `config/mcp-capabilities.json` | Session capabilities: opens the **installed** app (`appPackage`) with `noReset: true`, so you explore the current state without wiping it |

## A first session

Talk to Claude in plain language; it picks the tools. A typical warm-up:

1. *"Select the Android device and start an Appium session."* → `select_device`, then `appium_session_management` (`action=create`).
2. *"What is on screen? List the interactable elements with their best locator."* → `generate_locators`. Locators come ranked: accessibility id first, XPath last. Same priority as this suite (`CLAUDE.md`).
3. *"Tap the cart badge, then tell me which screen we are on."* → `appium_find_element` + `appium_gesture` (`tap`), then the screen's root id (`"<name> screen"`).
4. *"Scroll the catalog until 'Test.allTheThings() T-Shirt' is visible."* → `appium_gesture` (`scroll_to_element`).
5. *"Open the Webview menu, load https://www.saucedemo.com and list the contexts."* → `appium_context`: `NATIVE_APP` and `WEBVIEW_com.saucelabs.mydemoapp.rn`.
6. *"End the session."* → `appium_session_management` (`action=delete`). Always do this before running the suite (see below).

Deep links work too: *"Open mydemoapprn://product-details/1"* (routes in `utils/deeplink.ts`).

## From exploration to code

Use the project skill **`/explore-and-generate-screens`** (`.claude/skills/`). Given a screen, it maps it through Appium MCP and writes a draft Screen Object + spec that follow `CLAUDE.md` (ids via `byId()`, strict `$` vs `$$`, no `pause()`, deep links for setup). The draft is committed as-is first, so `npm run ai:edit-stats` can later measure how much human editing it needed.

## Gotchas

- **One driver per device.** An MCP session and a WDIO run both start the UiAutomator2 server on the emulator and fight over it. End the MCP session (or quit Claude Code) before `npm run test:android`, and do not explore while a suite runs.
- **`noReset` means real state.** The app keeps its login and cart between explorations. To start clean: *"clear the app data and relaunch it"*, or `adb shell pm clear com.saucelabs.mydemoapp.rn`.
- **Session opened the launcher, not the app?** The capabilities file was not found: the server only logs a warning and starts an empty session. Start Claude Code from the repo root (the path in `.mcp.json` is relative), or make `CAPABILITIES_CONFIG` absolute in your user-level config.
- **Everything visible is what exists.** Android only exposes on-screen elements; scroll before concluding an element is missing (the virtualized catalog grid is the classic case).
- **Vision-based finding is off** (`AI_VISION_ENABLED` unset). Keep it that way: an accessibility id is cheaper, faster and stable.
