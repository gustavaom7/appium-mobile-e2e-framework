import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen.ts';
import { byId, byText } from '../utils/selectors.ts';

class CatalogScreen extends BaseScreen {
  constructor() {
    super('products screen');
  }

  private get itemTitles() {
    return $$(byId('store item text'));
  }

  /** Titles of the product cards currently rendered (the grid is virtualized: on-screen only). */
  async getVisibleProductNames(): Promise<string[]> {
    await this.waitForDisplayed();
    // `$` is strict in WDIO 10 (throws on >1 match); wait on the first card of the list instead.
    await this.itemTitles[0].waitForDisplayed();
    return this.itemTitles.map((el) => el.getText());
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
