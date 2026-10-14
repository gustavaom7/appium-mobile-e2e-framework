import { expect } from '@wdio/globals';
import CartPage from '../../web/pages/CartPage.ts';
import InventoryPage from '../../web/pages/InventoryPage.ts';
import { checkoutCompletePage, checkoutInfoPage, checkoutOverviewPage } from '../../web/pages/CheckoutPage.ts';
import { hideKeyboard, rotate } from '../../web/device.ts';
import { loginAs, resetSession } from '../../web/session.ts';
import { CHECKOUT_INFO, SAUCE_PRODUCTS, SAUCE_TAX_RATE, SAUCE_USERS } from '../../fixtures/saucedemo.ts';

/** A real rotation re-lays out the page mid-flow: typed values and the order must survive it. */
describe('SauceDemo checkout across rotation on Android Chrome @regression', () => {
  beforeEach(async () => {
    await resetSession();
    await loginAs(SAUCE_USERS.standard);
  });

  afterEach(async () => {
    // Always hand the next test a portrait device, even after a failure.
    await rotate('PORTRAIT');
  });

  it('keeps the half-filled form and finishes the order in landscape', async () => {
    const item = SAUCE_PRODUCTS.backpack;
    await InventoryPage.addToCart(item.slug);
    await InventoryPage.openCart();
    await CartPage.checkout();
    await checkoutInfoPage.typeByTouch('firstName', CHECKOUT_INFO.firstName);
    await checkoutInfoPage.typeByTouch('lastName', CHECKOUT_INFO.lastName);
    await hideKeyboard();

    await rotate('LANDSCAPE');

    await expect(checkoutInfoPage.field('firstName')).toHaveValue(CHECKOUT_INFO.firstName);
    await expect(checkoutInfoPage.field('lastName')).toHaveValue(CHECKOUT_INFO.lastName);
    await checkoutInfoPage.typeByTouch('postalCode', CHECKOUT_INFO.postalCode);
    await hideKeyboard();
    await checkoutInfoPage.submit();

    await checkoutOverviewPage.waitForDisplayed();
    await expect(checkoutOverviewPage.total).toHaveText(`Total: $${(item.price * (1 + SAUCE_TAX_RATE)).toFixed(2)}`);
    await checkoutOverviewPage.finish();
    await checkoutCompletePage.waitForDisplayed();
  });
});
