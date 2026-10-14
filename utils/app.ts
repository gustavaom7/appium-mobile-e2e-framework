import { driver } from '@wdio/globals';
import { APP_ID } from '../config/app.ts';
import CatalogScreen from '../screens/CatalogScreen.ts';

const ANDROID_KEYCODE_HOME = 3;

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
  if (driver.isAndroid) {
    await regrantPermissions();
    await waitForBroadcastsToSettle();
  }
  await driver.activateApp(APP_ID);
  // A launch right after `pm clear` is a full cold start: React Native re-unpacks its native libraries
  // into the wiped data dir before the JS even runs. Measured 1.4-3s normally, up to 19s on a loaded host.
  await CatalogScreen.waitForDisplayed((driver.options.waitforTimeout ?? 15_000) * 3);
}

/**
 * Android race: `pm clear` on a *visible* activity arms a ~1s "remove-task" timer that kills
 * whatever process the old task holds when it fires, including the one `activateApp` just started.
 * The app is left as a blank window with no process, and UiAutomator2 times out looking for the
 * accessibility root. Clearing a STOPPED activity does not arm the timer.
 * Wait for STOPPED itself: app state ("not in foreground") flips while the activity is still
 * PAUSED and animating out, which is not enough.
 */
async function sendAppToBackground(): Promise<void> {
  await driver.pressKeyCode(ANDROID_KEYCODE_HOME);
  await driver.waitUntil(
    async () => {
      const state = await appActivityState();
      return state === undefined || state === 'STOPPED';
    },
    { timeout: 10_000, interval: 200, timeoutMsg: `${APP_ID} activity did not reach STOPPED` },
  );
}

/** Lifecycle state of the app's activity per `dumpsys activity activities`; undefined when it has none. */
async function appActivityState(): Promise<string | undefined> {
  const dump = (await driver.execute('mobile: shell', {
    command: 'dumpsys',
    args: ['activity', 'activities'],
  })) as string;
  const record = dump.search(new RegExp(`\\* Hist\\s+#\\d+: ActivityRecord\\{[^}]*${APP_ID.replace(/\./g, '\\.')}/`));
  if (record < 0) return undefined;
  return /\bstate=([A-Z_]+)/.exec(dump.slice(record))?.[1];
}

/**
 * `pm clear` also revokes runtime permissions, undoing the session's `autoGrantPermissions`: camera and
 * location screens (QR code, geo location) would then open behind the system permission dialog.
 */
async function regrantPermissions(): Promise<void> {
  await driver.execute('mobile: changePermissions', { permissions: 'all', appPackage: APP_ID, action: 'grant' });
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
