import { expect } from '@wdio/globals';
import CartPage from '../../web/pages/CartPage.ts';
import InventoryPage from '../../web/pages/InventoryPage.ts';
import { checkoutCompletePage, checkoutInfoPage, checkoutOverviewPage } from '../../web/pages/CheckoutPage.ts';
import { loginAs, resetSession } from '../../web/session.ts';
import { CHECKOUT_INFO, SAUCE_PRODUCTS, SAUCE_TAX_RATE, SAUCE_USERS } from '../../fixtures/saucedemo.ts';

describe('SauceDemo checkout on Android Chrome', () => {
  beforeEach(async () => {
    await resetSession();
    await loginAs(SAUCE_USERS.standard);
  });

  it('buys one item end to end @smoke', async () => {
    const item = SAUCE_PRODUCTS.backpack;
    const total = (item.price * (1 + SAUCE_TAX_RATE)).toFixed(2);

    await InventoryPage.addToCart(item.slug);
    await expect(InventoryPage.cartBadge).toHaveText('1');

    await InventoryPage.openCart();
    expect(await CartPage.getItemNames()).toEqual([item.name]);

    await CartPage.checkout();
    await checkoutInfoPage.fill(CHECKOUT_INFO);

    await checkoutOverviewPage.waitForDisplayed();
    await expect(checkoutOverviewPage.total).toHaveText(`Total: $${total}`);
    await checkoutOverviewPage.finish();

    await checkoutCompletePage.waitForDisplayed();
    await expect(checkoutCompletePage.header).toHaveText('Thank you for your order!');
  });
});
