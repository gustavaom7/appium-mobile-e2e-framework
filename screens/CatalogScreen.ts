import { $, $$, driver } from '@wdio/globals';
import { BaseScreen } from './BaseScreen.ts';
import { byId, byText } from '../utils/selectors.ts';
import type { SortOption } from '../fixtures/products.ts';

class CatalogScreen extends BaseScreen {
  constructor() {
    super('products screen');
  }

  private get itemTitles() {
    return $$(byId('store item text'));
  }

  private get itemPrices() {
    return $$(byId('store item price'));
  }

  /** Titles of the product cards currently rendered (the grid is virtualized: on-screen only). */
  async getVisibleProductNames(): Promise<string[]> {
    await this.waitForDisplayed();
    // `$` is strict in WDIO 10 (throws on >1 match); wait on the first card of the list instead.
    await this.itemTitles[0].waitForDisplayed();
    return this.itemTitles.map((el) => el.getText());
  }

  /** Prices of the rendered cards, as numbers ("$29.99" -> 29.99), in on-screen order. */
  async getVisibleProductPrices(): Promise<number[]> {
    await this.itemPrices[0].waitForDisplayed();
    return this.itemPrices.map(async (el) => Number((await el.getText()).replace(/[^\d.]/g, '')));
  }

  /**
   * The modal's root id is not exposed on Android, so its options tell whether it is open.
   * Each option's accessibility id is the option name (nameAsc, priceDesc, ...).
   */
  async sortBy(option: SortOption): Promise<void> {
    await this.waitForDisplayed();
    await $(byId('sort button')).click();
    const optionRow = $(byId(option));
    await optionRow.waitForDisplayed();
    await optionRow.click();
    await optionRow.waitForDisplayed({ reverse: true });
  }

  /** Finger swipe over the grid: "up" moves the content up (reveals later cards), "down" goes back. */
  async swipeGrid(direction: 'up' | 'down'): Promise<void> {
    await this.waitForDisplayed();
    await driver.swipe({ direction, percent: 0.8 });
  }

  /** Cards below the fold are not in the tree until scrolled to (virtualized grid), so scroll first. */
  async openProduct(name: string): Promise<void> {
    await this.waitForDisplayed();
    const title = $(byText(name));
    await title.scrollIntoView({ maxScrolls: 5 });
    await title.click();
  }
}

export default new CatalogScreen();
