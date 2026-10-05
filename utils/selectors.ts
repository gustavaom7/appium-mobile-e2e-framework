import { driver } from '@wdio/globals';

/**
 * My Demo App sets `accessibilityLabel` on Android and `testID` on iOS from the same string
 * (src/config/TestProperties.ts in the app), so Appium's accessibility id strategy (`~`)
 * resolves the same id on both platforms. Prefer `byId`; reach for `byPlatform` only when
 * the UI genuinely differs (e.g. Android drawer vs iOS tab bar).
 */
export const byId = (id: string): string => `~${id}`;

export const byPlatform = (selectors: { android: string; ios: string }): string =>
  driver.isAndroid ? selectors.android : selectors.ios;

/** RN text inputs: "<Label> input field". */
export const inputId = (label: string): string => byId(`${label} input field`);

/** RN buttons: "<Title> button". */
export const buttonId = (title: string): string => byId(`${title} button`);

/** Visible text, for assertions on copy that has no id of its own (e.g. RN error messages). */
export const byText = (text: string): string => {
  const escaped = text.replace(/"/g, '\\"');
  return byPlatform({
    android: `android=new UiSelector().text("${escaped}")`,
    ios: `-ios predicate string:type == "XCUIElementTypeStaticText" AND label == "${escaped}"`,
  });
};
