import { $ } from '@wdio/globals';
import { BasePage } from './BasePage.ts';
import { byTest } from '../selectors.ts';

class LoginPage extends BasePage {
  constructor() {
    super('/', byTest('login-button'));
  }

  get error() {
    return $(byTest('error'));
  }

  /** Empty strings leave the field untouched, so validation cases share this one method. */
  async login(username: string, password: string): Promise<void> {
    await this.waitForDisplayed();
    if (username) await $(byTest('username')).setValue(username);
    if (password) await $(byTest('password')).setValue(password);
    await $(byTest('login-button')).click();
  }
}

export default new LoginPage();
