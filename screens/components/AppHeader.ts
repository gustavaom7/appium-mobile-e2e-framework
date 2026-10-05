import { $ } from '@wdio/globals';
import { byId } from '../../utils/selectors.ts';
import { openDeepLink } from '../../utils/deeplink.ts';

/**
 * The header logo has a long-press hook that wipes the app's persisted store (cart, login,
 * card details). It is the cheapest way to isolate tests inside one Appium session.
 */
class AppHeader {
  private get logo() {
    return $(byId('longpress reset app'));
  }

  /** Goes to the catalog first, where the logo is always rendered, so it works from any screen. */
  async resetAppState(): Promise<void> {
    await openDeepLink('store-overview');
    await this.logo.waitForDisplayed();
    await this.logo.longPress({ duration: 1500 });
  }
}

export default new AppHeader();
