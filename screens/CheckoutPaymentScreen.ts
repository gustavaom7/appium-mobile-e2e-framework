import { $ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen.ts';
import { buttonId, byId, inputId, textChild } from '../utils/selectors.ts';
import { dismissKeyboard } from '../utils/keyboard.ts';

const FIELD_LABELS = {
  fullName: 'Full Name*',
  number: 'Card Number*',
  expirationDate: 'Expiration Date*',
  securityCode: 'Security Code*',
} as const;

export type CardField = keyof typeof FIELD_LABELS;
export type PaymentCard = Record<CardField, string>;

class CheckoutPaymentScreen extends BaseScreen {
  constructor() {
    super('checkout payment screen');
  }

  /** Card number and expiration date are typed as plain digits; the app formats them ("4111 1111 ...", "03/30"). */
  async fill(card: Partial<PaymentCard>): Promise<void> {
    await this.waitForDisplayed();
    for (const [field, value] of Object.entries(card) as [CardField, string][]) {
      await $(inputId(FIELD_LABELS[field])).setValue(value);
    }
  }

  async submit(): Promise<void> {
    await dismissKeyboard();
    await $(buttonId('Review Order')).click();
  }

  fieldError(field: CardField) {
    return $(byId(`${FIELD_LABELS[field]}-error-message`)).$(textChild());
  }
}

export default new CheckoutPaymentScreen();
