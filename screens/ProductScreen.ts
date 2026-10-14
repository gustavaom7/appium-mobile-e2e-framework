import { $ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen.ts';
import { buttonId, byId, textChild } from '../utils/selectors.ts';
import type { ProductColor } from '../fixtures/products.ts';

class ProductScreen extends BaseScreen {
  constructor() {
    super('product screen');
  }

  /** Product name, rendered as the screen header. */
  get title() {
    return $(byId('container header')).$(textChild());
  }

  /** Shown as "$29.99". */
  get price() {
    return $(byId('product price'));
  }

  get description() {
    return $(byId('product description'));
  }

  get counterAmount() {
    return $(byId('counter amount')).$(textChild());
  }

  get addToCartButton() {
    return $(buttonId('Add To Cart'));
  }

  colorCircle(color: ProductColor) {
    return $(byId(`${color} circle`));
  }

  async increaseAmount(): Promise<void> {
    await $(byId('counter plus button')).click();
  }

  async decreaseAmount(): Promise<void> {
    await $(byId('counter minus button')).click();
  }

  async selectColor(color: ProductColor): Promise<void> {
    await this.colorCircle(color).click();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}

export default new ProductScreen();
