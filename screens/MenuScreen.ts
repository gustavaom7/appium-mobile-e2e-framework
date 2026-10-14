import { $ } from '@wdio/globals';
import Alert from './Alert.ts';
import { byId, byPlatform } from '../utils/selectors.ts';

/** Menu items by the suffix of their id ("menu item <name>"). */
export type MenuItem =
  | 'catalog'
  | 'webview'
  | 'qr code scanner'
  | 'geo location'
  | 'drawing'
  | 'about'
  | 'reset app'
  | 'biometrics'
  | 'log in'
  | 'log out'
  | 'api calls';

/** Android opens a drawer from the header button; iOS shows the same items behind a tab bar option. */
class MenuScreen {
  private item(name: MenuItem) {
    return $(byId(`menu item ${name}`));
  }

  async open(): Promise<void> {
    await $(byPlatform({ android: byId('open menu'), ios: byId('tab bar option menu') })).click();
    await this.item('catalog').waitForDisplayed();
  }

  /** Opens the menu and taps an item, scrolling the list first on screens too short to show it. */
  async select(name: MenuItem): Promise<void> {
    await this.open();
    const item = this.item(name);
    if (!(await item.isDisplayed())) await item.scrollIntoView();
    await item.click();
  }

  /** Log Out asks for confirmation, then reports success; both are native alerts. */
  async logout(): Promise<void> {
    await this.select('log out');
    await Alert.tap('Log Out');
    await Alert.tap('OK');
  }

  /** "Reset App State": empties the cart (keeps the login). Confirmation, then success alert. */
  async resetAppState(): Promise<void> {
    await this.select('reset app');
    await Alert.tap('Reset App');
    await Alert.tap('OK');
  }

}

export default new MenuScreen();
