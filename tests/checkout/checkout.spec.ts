import { expect } from '@wdio/globals';
import CartAccess from '../../screens/CartAccess.ts';
import CartScreen from '../../screens/CartScreen.ts';
import CheckoutAddressScreen from '../../screens/CheckoutAddressScreen.ts';
import CheckoutCompleteScreen from '../../screens/CheckoutCompleteScreen.ts';
import CheckoutPaymentScreen from '../../screens/CheckoutPaymentScreen.ts';
import CheckoutReviewScreen from '../../screens/CheckoutReviewScreen.ts';
import LoginScreen from '../../screens/LoginScreen.ts';
import { DELIVERY_COSTS, PAYMENT_CARD, SHIPPING_ADDRESS } from '../../fixtures/checkout.ts';
import { PRODUCTS } from '../../fixtures/products.ts';
import { USERS } from '../../fixtures/users.ts';
import { resetApp } from '../../utils/app.ts';
import { cartPath, openDeepLink } from '../../utils/deeplink.ts';

const [BACKPACK, BIKE_LIGHT] = PRODUCTS;

describe('Checkout @regression', () => {
  beforeEach(async () => {
    await resetApp();
  });

  it('buys the cart end to end, logging in on the way', async () => {
    await openDeepLink(cartPath([{ productId: BACKPACK.id, amount: 2 }, { productId: BIKE_LIGHT.id }]));
    await CartScreen.proceedToCheckout();

    // Logged out: checkout asks for a login first, then continues to the address step.
    await LoginScreen.login(USERS.standard.username, USERS.standard.password);
    await CheckoutAddressScreen.fill(SHIPPING_ADDRESS);
    await CheckoutAddressScreen.submit();
    await CheckoutPaymentScreen.fill(PAYMENT_CARD);
    await CheckoutPaymentScreen.submit();

    expect(await CheckoutReviewScreen.getDeliveryAddressLines()).toEqual(
      expect.arrayContaining([
        SHIPPING_ADDRESS.fullName,
        SHIPPING_ADDRESS.addressLineOne,
        SHIPPING_ADDRESS.city,
        `${SHIPPING_ADDRESS.country}, ${SHIPPING_ADDRESS.zipCode}`,
      ]),
    );
    const total = BACKPACK.price * 2 + BIKE_LIGHT.price + DELIVERY_COSTS;
    await expect(CheckoutReviewScreen.totalPrice).toHaveText(`$${total.toFixed(2)}`);

    await CheckoutReviewScreen.placeOrder();

    await CheckoutCompleteScreen.waitForDisplayed();
    expect(await CartAccess.count()).toBe(0);
  });
});
