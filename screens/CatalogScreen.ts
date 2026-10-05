import { $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen.ts';
import { byId } from '../utils/selectors.ts';

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

  async openProduct(name: string): Promise<void> {
    const titles = await this.itemTitles.getElements();
    for (const title of titles) {
      if ((await title.getText()) === name) {
        await title.click();
        return;
      }
    }
    throw new Error(`Product "${name}" is not on screen`);
  }
}

export default new CatalogScreen();
