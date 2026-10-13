import { $ } from '@wdio/globals';
import { BasePage } from './BasePage.ts';
import { byTest } from '../selectors.ts';

/** Step one: shipping info form. */
class CheckoutInfoPage extends BasePage {
  constructor() {
    super('/checkout-step-one.html', byTest('checkout-info-container'));
  }

  async fill(info: { firstName: string; lastName: string; postalCode: string }): Promise<void> {
    await this.waitForDisplayed();
    await $(byTest('firstName')).setValue(info.firstName);
    await $(byTest('lastName')).setValue(info.lastName);
    await $(byTest('postalCode')).setValue(info.postalCode);
    await $(byTest('continue')).click();
  }
}

/** Step two: order overview with the price breakdown. */
class CheckoutOverviewPage extends BasePage {
  constructor() {
    super('/checkout-step-two.html', byTest('checkout-summary-container'));
  }

  get total() {
    return $(byTest('total-label'));
  }

  async finish(): Promise<void> {
    await $(byTest('finish')).click();
  }
}

class CheckoutCompletePage extends BasePage {
  constructor() {
    super('/checkout-complete.html', byTest('checkout-complete-container'));
  }

  get header() {
    return $(byTest('complete-header'));
  }
}

export const checkoutInfoPage = new CheckoutInfoPage();
export const checkoutOverviewPage = new CheckoutOverviewPage();
export const checkoutCompletePage = new CheckoutCompletePage();
