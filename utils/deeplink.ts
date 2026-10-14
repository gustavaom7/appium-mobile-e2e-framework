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

/** One product line of a `cart/` deep link. `color` is a plain string so tests can send invalid ones. */
export type CartLine = { productId: number; amount?: number; color?: string };

/**
 * Cart payload as the app parses it (src/utils/DeepLinking.ts): `id=1&amount=2&color=blue,id=2...`.
 * Missing amount means 1; a missing or unknown color falls back to the product's default.
 * An id that is not in the catalog crashes the app (it reads the default color of `undefined`).
 */
export function cartPath(lines: CartLine[]): DeepLinkPath {
  const encode = ({ productId, amount, color }: CartLine) =>
    [`id=${productId}`, amount !== undefined && `amount=${amount}`, color && `color=${color}`].filter(Boolean).join('&');
  return `cart/${lines.map(encode).join(',')}`;
}
