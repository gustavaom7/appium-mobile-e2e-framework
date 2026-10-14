import { expect } from '@wdio/globals';
import Alert from '../../screens/Alert.ts';
import CartAccess from '../../screens/CartAccess.ts';
import CatalogScreen from '../../screens/CatalogScreen.ts';
import LoginScreen from '../../screens/LoginScreen.ts';
import MenuScreen, { type MenuItem } from '../../screens/MenuScreen.ts';
import { screenWithRoot } from '../../screens/BaseScreen.ts';
import { PRODUCTS } from '../../fixtures/products.ts';
import { USERS } from '../../fixtures/users.ts';
import { resetApp } from '../../utils/app.ts';
import { cartPath, openDeepLink } from '../../utils/deeplink.ts';

const BIOMETRICS_UNAVAILABLE =
  'Biometrics is or not supported or not enabled on your device. Please check your device or your settings.';

/** Menu item -> root id of the screen it opens (src/config/translations/en.ts). */
const DESTINATIONS: { item: MenuItem; screen: string }[] = [
  { item: 'catalog', screen: 'products screen' },
  { item: 'webview', screen: 'webview selection screen' },
  { item: 'qr code scanner', screen: 'qr code screen' },
  { item: 'geo location', screen: 'geo location screen' },
  { item: 'drawing', screen: 'drawing screen' },
  { item: 'about', screen: 'about screen' },
  { item: 'api calls', screen: 'api calls screen' },
];

describe('Menu navigation @regression', () => {
  describe('destinations', () => {
    before(async () => {
      await resetApp();
    });

    // Navigation only: each test starts from the catalog by deep link instead of a full reset.
    beforeEach(async () => {
      await openDeepLink('store-overview');
      await CatalogScreen.waitForDisplayed();
    });

    for (const { item, screen } of DESTINATIONS) {
      it(`opens ${item}`, async () => {
        await MenuScreen.select(item);

        await screenWithRoot(screen).waitForDisplayed();
      });
    }

    // Device-dependent: emulators have no enrolled biometrics, so the app explains instead of navigating.
    // On a device with a fingerprint/face enrolled the biometrics screen opens instead.
    it('explains that biometrics are unavailable on a device without them', async () => {
      await MenuScreen.select('biometrics');

      await expect(Alert.message(BIOMETRICS_UNAVAILABLE)).toBeDisplayed();
      await Alert.tap('OK');
    });
  });

  describe('session and state', () => {
    beforeEach(async () => {
      await resetApp();
    });

    it('logs in from the menu, back to the catalog, and logs out again', async () => {
      await MenuScreen.select('log in');
      await LoginScreen.login(USERS.standard.username, USERS.standard.password);
      await CatalogScreen.waitForDisplayed();

      await MenuScreen.logout();

      await LoginScreen.waitForDisplayed();
    });

    it('empties the cart with Reset App State', async () => {
      await openDeepLink(cartPath([{ productId: PRODUCTS[0].id, amount: 2 }]));
      expect(await CartAccess.count()).toBe(2);

      await MenuScreen.resetAppState();

      expect(await CartAccess.count()).toBe(0);
    });
  });
});
