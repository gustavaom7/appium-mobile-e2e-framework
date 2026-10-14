import { driver } from '@wdio/globals';
import { APP_ID } from '../config/app.ts';
import CatalogScreen from '../screens/CatalogScreen.ts';

const ANDROID_KEYCODE_HOME = 3;
const APP_STATE_RUNNING_IN_FOREGROUND = 4;

/**
 * Wipes the app's data and relaunches it on the catalog: logged out, empty cart.
 *
 * The in-app "long-press the logo" reset is NOT enough: it clears cart/checkout data but keeps
 * the user logged in, and the app only registers the login route while logged out.
 * `mobile: clearApp` is `pm clear` on Android and a data-container wipe on the iOS simulator
 * (not supported on real iOS devices). Both terminate the app first.
 */
export async function resetApp(): Promise<void> {
  if (driver.isAndroid) await sendAppToBackground();
  await driver.execute('mobile: clearApp', driver.isAndroid ? { appId: APP_ID } : { bundleId: APP_ID });
  if (driver.isAndroid) await waitForBroadcastsToSettle();
  await driver.activateApp(APP_ID);
  await CatalogScreen.waitForDisplayed();
}

/**
 * Android race: `pm clear` on a *visible* activity arms a ~1s "remove-task" timer that kills
 * whatever process the old task holds when it fires, including the one `activateApp` just started.
 * The app is left as a blank window with no process, and UiAutomator2 times out looking for the
 * accessibility root. Clearing a stopped (backgrounded) activity does not arm the timer.
 */
async function sendAppToBackground(): Promise<void> {
  await driver.pressKeyCode(ANDROID_KEYCODE_HOME);
  await driver.waitUntil(
    async () => (await driver.queryAppState(APP_ID)) !== APP_STATE_RUNNING_IN_FOREGROUND,
    { timeout: 10_000, interval: 100, timeoutMsg: `${APP_ID} did not leave the foreground` },
  );
}

/**
 * `pm clear` also queues package broadcasts. On a slow emulator (CI) they can land seconds after the app
 * is back up, and the keyboard-layout reload they trigger is a configuration change: Android recreates
 * the activity, and My Demo App crashes on recreation (react-native-screens "Screen fragments should
 * never be restored"). Wait for every broadcast queue to drain before relaunching.
 */
async function waitForBroadcastsToSettle(): Promise<void> {
  await driver.execute('mobile: shell', { command: 'am', args: ['wait-for-broadcast-idle'], timeout: 60_000 });
}
