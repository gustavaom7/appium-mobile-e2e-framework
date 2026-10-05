import { driver } from '@wdio/globals';
import { APP_ID } from '../config/app.ts';
import CatalogScreen from '../screens/CatalogScreen.ts';

/**
 * Wipes the app's data and relaunches it on the catalog: logged out, empty cart.
 *
 * The in-app "long-press the logo" reset is NOT enough: it clears cart/checkout data but keeps
 * the user logged in, and the app only registers the login route while logged out.
 * `mobile: clearApp` is `pm clear` on Android and a data-container wipe on the iOS simulator
 * (not supported on real iOS devices). Both terminate the app first.
 */
export async function resetApp(): Promise<void> {
  await driver.execute('mobile: clearApp', driver.isAndroid ? { appId: APP_ID } : { bundleId: APP_ID });
  await driver.activateApp(APP_ID);
  await CatalogScreen.waitForDisplayed();
}
