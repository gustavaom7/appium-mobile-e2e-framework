import { browser, expect } from '@wdio/globals';
import InventoryPage from '../../web/pages/InventoryPage.ts';
import LoginPage from '../../web/pages/LoginPage.ts';
import Menu from '../../web/pages/Menu.ts';
import { loginAs, resetSession } from '../../web/session.ts';
import { SAUCE_PRODUCTS, SAUCE_USERS } from '../../fixtures/saucedemo.ts';

describe('SauceDemo menu by touch on Android Chrome @regression', () => {
  beforeEach(async () => {
    await resetSession();
    await loginAs(SAUCE_USERS.standard);
  });

  it('logs out and drops the session cookie', async () => {
    await Menu.logout();

    await LoginPage.waitForDisplayed();
    expect(await browser.getCookies({ name: 'session-username' })).toEqual([]);
  });

  it('resets the app state, emptying the cart', async () => {
    await InventoryPage.addToCart(SAUCE_PRODUCTS.backpack.slug);
    await expect(InventoryPage.cartBadge).toHaveText('1');

    await Menu.resetAppState();
    await Menu.close();

    await expect(InventoryPage.cartBadge).not.toBeExisting();
  });
});
