import { driver } from '@wdio/globals';
import { APP_ID, DEEP_LINK_SCHEME } from '../config/app.ts';

/**
 * Routes declared in the app (src/navigation/Linking.ts). Jumping straight to a screen is the
 * mobile equivalent of Playwright's storageState: set up state without replaying the UI.
 */
export type DeepLinkPath =
  | 'store-overview'
  | `product-details/${number}`
  | 'cart'
  | `cart/${string}`
  | 'login'
  | 'checkout-address'
  | 'checkout-payment'
  | 'checkout-complete'
  | 'webview'
  | 'geo-locations'
  | 'drawing'
  | 'about';

export async function openDeepLink(path: DeepLinkPath): Promise<void> {
  await driver.deepLink(`${DEEP_LINK_SCHEME}${path}`, APP_ID);
}
