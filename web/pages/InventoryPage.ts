import { $ } from '@wdio/globals';
import { BasePage } from './BasePage.ts';
import { byTest } from '../selectors.ts';

class InventoryPage extends BasePage {
  constructor() {
    super('/inventory.html', byTest('inventory-container'));
  }

  get cartBadge() {
    return $(byTest('shopping-cart-badge'));
  }

  async addToCart(slug: string): Promise<void> {
    await $(byTest(`add-to-cart-${slug}`)).click();
    await $(byTest(`remove-${slug}`)).waitForDisplayed();
  }

  async openCart(): Promise<void> {
    await $(byTest('shopping-cart-link')).click();
  }
}

export default new InventoryPage();
