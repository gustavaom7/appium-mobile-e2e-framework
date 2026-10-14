import { expect } from '@wdio/globals';
import CheckoutAddressScreen, { type AddressField } from '../../screens/CheckoutAddressScreen.ts';
import CheckoutPaymentScreen, { type CardField } from '../../screens/CheckoutPaymentScreen.ts';
import { ADDRESS_ERRORS, PAYMENT_CARD, PAYMENT_ERROR, SHIPPING_ADDRESS } from '../../fixtures/checkout.ts';
import { resetApp } from '../../utils/app.ts';
import { openDeepLink } from '../../utils/deeplink.ts';

const ADDRESS_FIELDS = Object.keys(ADDRESS_ERRORS) as AddressField[];

const INVALID_CARDS: { title: string; field: CardField; value: string }[] = [
  { title: 'a card number that fails the checksum', field: 'number', value: '4111111111111112' },
  { title: 'an expired date', field: 'expirationDate', value: '0120' },
];

describe('Checkout validation @regression', () => {
  beforeEach(async () => {
    await resetApp();
  });

  describe('shipping address', () => {
    // Every mandatory field left out once: only its error shows, and the form does not move on.
    for (const missing of ADDRESS_FIELDS) {
      it(`requires ${missing}`, async () => {
        await openDeepLink('checkout-address');
        const { [missing]: _left, ...rest } = SHIPPING_ADDRESS;

        await CheckoutAddressScreen.fill(rest);
        await CheckoutAddressScreen.submit();

        await expect(CheckoutAddressScreen.fieldError(missing)).toHaveText(ADDRESS_ERRORS[missing]);
        for (const other of ADDRESS_FIELDS.filter((f) => f !== missing)) {
          await expect(CheckoutAddressScreen.fieldError(other)).not.toBeExisting();
        }
        expect(await CheckoutAddressScreen.isDisplayed()).toBe(true);
      });
    }
  });

  describe('payment', () => {
    // App bug: the message shows as soon as the value is complete, but tapping Review Order clears it
    // (the empty-field check overwrites the format error) while still blocking the form. So the error
    // is checked before submitting, and the submit only for not moving on.
    for (const { title, field, value } of INVALID_CARDS) {
      it(`rejects ${title}`, async () => {
        await openDeepLink('checkout-address');
        await CheckoutAddressScreen.fill(SHIPPING_ADDRESS);
        await CheckoutAddressScreen.submit();

        await CheckoutPaymentScreen.fill({ ...PAYMENT_CARD, [field]: value });
        await expect(CheckoutPaymentScreen.fieldError(field)).toHaveText(PAYMENT_ERROR);

        await CheckoutPaymentScreen.submit();
        expect(await CheckoutPaymentScreen.isDisplayed()).toBe(true);
      });
    }
  });
});
