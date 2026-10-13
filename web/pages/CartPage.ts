import { $, $$ } from '@wdio/globals';
import { BasePage } from './BasePage.ts';
import { byTest } from '../selectors.ts';

class CartPage extends BasePage {
  constructor() {
    super('/cart.html', byTest('cart-list'));
  }

  async getItemNames(): Promise<string[]> {
    await this.waitForDisplayed();
    return $$(byTest('inventory-item-name')).map((el) => el.getText());
  }

  async checkout(): Promise<void> {
    await $(byTest('checkout')).click();
  }
}

export default new CartPage();
