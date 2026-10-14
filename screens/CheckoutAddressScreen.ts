import { $ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen.ts';
import { buttonId, byId, inputId, textChild } from '../utils/selectors.ts';
import { dismissKeyboard } from '../utils/keyboard.ts';

/** Mandatory fields and their labels; the "*" is part of the label, hence of the ids. */
const FIELD_LABELS = {
  fullName: 'Full Name*',
  addressLineOne: 'Address Line 1*',
  city: 'City*',
  zipCode: 'Zip Code*',
  country: 'Country*',
} as const;

export type AddressField = keyof typeof FIELD_LABELS;
export type ShippingAddress = Record<AddressField, string>;

class CheckoutAddressScreen extends BaseScreen {
  constructor() {
    super('checkout address screen');
  }

  /** Fills the given fields only, so validation cases can leave one out. */
  async fill(address: Partial<ShippingAddress>): Promise<void> {
    await this.waitForDisplayed();
    for (const [field, value] of Object.entries(address) as [AddressField, string][]) {
      await $(inputId(FIELD_LABELS[field])).setValue(value);
    }
  }

  /** The input of a field, to read back what was typed. */
  field(field: AddressField) {
    return $(inputId(FIELD_LABELS[field]));
  }

  async submit(): Promise<void> {
    await dismissKeyboard();
    await $(buttonId('To Payment')).click();
  }

  /** Error text under a field. Its container is always rendered; the text only exists while invalid. */
  fieldError(field: AddressField) {
    return $(byId(`${FIELD_LABELS[field]}-error-message`)).$(textChild());
  }
}

export default new CheckoutAddressScreen();
