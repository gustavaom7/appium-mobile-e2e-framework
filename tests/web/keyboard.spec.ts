import { expect } from '@wdio/globals';
import CartPage from '../../web/pages/CartPage.ts';
import InventoryPage from '../../web/pages/InventoryPage.ts';
import { checkoutInfoPage, checkoutOverviewPage } from '../../web/pages/CheckoutPage.ts';
import { hideKeyboard, visibleViewportHeight, waitForKeyboard } from '../../web/device.ts';
import { loginAs, resetSession } from '../../web/session.ts';
import { CHECKOUT_INFO, SAUCE_PRODUCTS, SAUCE_USERS } from '../../fixtures/saucedemo.ts';

/** Only a real device has an on-screen keyboard: viewport emulation (Playwright) never shrinks the page. */
describe('SauceDemo on-screen keyboard on Android Chrome @regression', () => {
  beforeEach(async () => {
    await resetSession();
    await loginAs(SAUCE_USERS.standard);
    await InventoryPage.addToCart(SAUCE_PRODUCTS.backpack.slug);
    await InventoryPage.openCart();
    await CartPage.checkout();
    await checkoutInfoPage.waitForDisplayed();
  });

  it('shrinks the visible page while typing and gives it back once dismissed', async () => {
    const fullHeight = await visibleViewportHeight();

    await checkoutInfoPage.typeByTouch('firstName', CHECKOUT_INFO.firstName);
    await waitForKeyboard(true);
    expect(await visibleViewportHeight()).toBeLessThan(fullHeight);

    await hideKeyboard();
    expect(await visibleViewportHeight()).toBeCloseTo(fullHeight, 0);
    expect(await checkoutInfoPage.continueButtonBottom()).toBeLessThanOrEqual(await visibleViewportHeight());
    await expect(checkoutInfoPage.field('firstName')).toHaveValue(CHECKOUT_INFO.firstName);
  });

  it('completes the form by touch, dismissing the keyboard before Continue', async () => {
    await checkoutInfoPage.typeByTouch('firstName', CHECKOUT_INFO.firstName);
    await checkoutInfoPage.typeByTouch('lastName', CHECKOUT_INFO.lastName);
    await checkoutInfoPage.typeByTouch('postalCode', CHECKOUT_INFO.postalCode);
    await hideKeyboard();
    await checkoutInfoPage.submit();

    await checkoutOverviewPage.waitForDisplayed();
  });
});
