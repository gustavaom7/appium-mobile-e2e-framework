import { $, driver } from '@wdio/globals';
import { BaseScreen } from './BaseScreen.ts';
import { buttonId, byText, inputId } from '../utils/selectors.ts';

class LoginScreen extends BaseScreen {
  constructor() {
    super('login screen');
  }

  private get usernameInput() {
    return $(inputId('Username'));
  }
  private get passwordInput() {
    return $(inputId('Password'));
  }
  private get loginButton() {
    return $(buttonId('Login'));
  }

  /** Empty strings leave the field untouched, so validation cases share this one method. */
  async login(username: string, password: string): Promise<void> {
    await this.waitForDisplayed();
    if (username) await this.usernameInput.setValue(username);
    if (password) await this.passwordInput.setValue(password);
    // On small Android screens the keyboard covers the button.
    if (driver.isAndroid && (await driver.isKeyboardShown())) await driver.hideKeyboard();
    await this.loginButton.click();
  }

  /** Error copy is rendered as plain text under the field (or above the button for generic errors). */
  errorMessage(text: string) {
    return $(byText(text));
  }
}

export default new LoginScreen();
