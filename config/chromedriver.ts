/**
 * Fetches the chromedriver matching the device's Chrome / System WebView at session start
 * (needs relaxedSecurity, set in the shared config). Used by the mobile-web suite and by the
 * native suite's WEBVIEW context. Real uiautomator2 capability, missing from @wdio/types:
 * kept apart so it skips the excess-property check.
 */
export const chromedriverAutodownload: Record<string, unknown> = { 'appium:chromedriverAutodownload': true };
