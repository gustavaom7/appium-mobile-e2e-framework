import { $ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen.ts';
import { buttonId, byId, textChild } from '../utils/selectors.ts';

class CheckoutReviewScreen extends BaseScreen {
  constructor() {
    super('checkout review order screen');
  }

  /** "$65.97": cart total plus delivery. */
  get totalPrice() {
    return $(byId('total price'));
  }

  /**
   * Lines of the delivery address block, label included. Android only exposes what is on screen,
   * so the block below it is scrolled into view first: then this one is complete.
   */
  async getDeliveryAddressLines(): Promise<string[]> {
    await this.waitForDisplayed();
    await $(byId('checkout payment info')).scrollIntoView();
    return this.sectionLines('checkout delivery address');
  }

  async placeOrder(): Promise<void> {
    await $(buttonId('Place Order')).click();
  }

  private async sectionLines(id: string): Promise<string[]> {
    await this.waitForDisplayed();
    return $(byId(id)).$$(textChild()).map((el) => el.getText());
  }
}

export default new CheckoutReviewScreen();
