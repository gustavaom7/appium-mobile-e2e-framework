import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen.ts';
import { buttonId, byId, byText, textChild } from '../utils/selectors.ts';
import type { ProductColor } from '../fixtures/products.ts';

/** One product line of the cart; every row repeats the same ids, so lookups are scoped to the row. */
class CartRow {
  constructor(private readonly row: WebdriverIO.Element) {}

  get name() {
    return this.row.$(byId('product label'));
  }

  get price() {
    return this.row.$(byId('product price'));
  }

  get amount() {
    return this.row.$(byId('counter amount')).$(textChild());
  }

  colorCircle(color: ProductColor) {
    return this.row.$(byId(`${color} circle`));
  }

  async increase(): Promise<void> {
    await this.row.$(byId('counter plus button')).click();
  }

  async decrease(): Promise<void> {
    await this.row.$(byId('counter minus button')).click();
  }

  async remove(): Promise<void> {
    await this.row.$(byId('remove item')).click();
  }
}

class CartScreen extends BaseScreen {
  constructor() {
    super('cart screen');
  }

  /** "3 items" / "1 item". */
  get totalItems() {
    return $(byId('total number'));
  }

  /** "$69.97". */
  get totalPrice() {
    return $(byId('total price'));
  }

  get emptyCartMessage() {
    return $(byText('No Items'));
  }

  get proceedToCheckoutButton() {
    return $(buttonId('Proceed To Checkout'));
  }

  async getProductNames(): Promise<string[]> {
    await this.waitForDisplayed();
    return $$(byId('product label')).map((el) => el.getText());
  }

  /** The row of the given product (WDIO 10 `$` is strict, so rows are found through the list). */
  async row(productName: string): Promise<CartRow> {
    await this.waitForDisplayed();
    const rows = await $$(byId('product row')).getElements();
    for (const row of rows) {
      if ((await row.$(byId('product label')).getText()) === productName) return new CartRow(row);
    }
    throw new Error(`"${productName}" is not in the cart`);
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }
}

export default new CartScreen();
