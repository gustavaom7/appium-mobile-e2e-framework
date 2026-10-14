import { expect } from '@wdio/globals';
import CheckoutAddressScreen from '../../screens/CheckoutAddressScreen.ts';
import CheckoutPaymentScreen from '../../screens/CheckoutPaymentScreen.ts';
import { SHIPPING_ADDRESS } from '../../fixtures/checkout.ts';
import { resetApp } from '../../utils/app.ts';
import { openDeepLink } from '../../utils/deeplink.ts';
import { lockAndUnlockScreen, sendToBackgroundFor } from '../../utils/device.ts';

const INTERRUPTIONS: { title: string; interrupt: () => Promise<void> }[] = [
  { title: 'going to the background and back', interrupt: () => sendToBackgroundFor(3) },
  { title: 'locking and unlocking the screen', interrupt: lockAndUnlockScreen },
];

// No rotation case: the app is locked to portrait (manifest); rotation is covered by the mobile-web suite.
describe('Interruptions mid-checkout @regression', () => {
  beforeEach(async () => {
    await resetApp();
  });

  for (const { title, interrupt } of INTERRUPTIONS) {
    it(`keeps the half-filled address form after ${title}`, async () => {
      const { fullName, addressLineOne } = SHIPPING_ADDRESS;
      await openDeepLink('checkout-address');
      await CheckoutAddressScreen.fill({ fullName, addressLineOne });

      await interrupt();

      await CheckoutAddressScreen.waitForDisplayed();
      await expect(CheckoutAddressScreen.field('fullName')).toHaveText(fullName);
      await expect(CheckoutAddressScreen.field('addressLineOne')).toHaveText(addressLineOne);

      // And the flow still works from there.
      const { city, zipCode, country } = SHIPPING_ADDRESS;
      await CheckoutAddressScreen.fill({ city, zipCode, country });
      await CheckoutAddressScreen.submit();
      await CheckoutPaymentScreen.waitForDisplayed();
    });
  }
});
