import { $, driver } from '@wdio/globals';
import { byId, byPlatform, textChild } from '../utils/selectors.ts';

/** Cart entry point: Android shows a badge button in the header, iOS a tab bar option. */
class CartAccess {
  private get entry() {
    return $(byPlatform({ android: byId('cart badge'), ios: byId('tab bar option cart') }));
  }

  async open(): Promise<void> {
    await this.entry.click();
  }

  /** Items in the cart per the badge (0 when it shows no number). Android only: the iOS tab badge has no id. */
  async count(): Promise<number> {
    if (!driver.isAndroid) throw new Error('Cart badge count is not mapped on iOS yet (tab bar badge has no id)');
    const amount = this.entry.$(textChild());
    return (await amount.isExisting()) ? Number(await amount.getText()) : 0;
  }
}

export default new CartAccess();
