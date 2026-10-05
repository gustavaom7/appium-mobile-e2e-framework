/**
 * Single source of truth for the app under test: Sauce Labs "My Demo App" (React Native).
 * Same identifier on both platforms; release pinned so a new app build never silently changes the suite.
 */
export const APP_ID = 'com.saucelabs.mydemoapp.rn';
export const APP_RELEASE = process.env.APP_RELEASE ?? 'v1.3.0';
export const DEEP_LINK_SCHEME = 'mydemoapprn://';
