import { $ } from '@wdio/globals';
import { alertButton, byText } from '../utils/selectors.ts';

/** Native alert dialogs (Alert.alert in the app). */
class Alert {
  message(text: string) {
    return $(byText(text));
  }

  async tap(buttonLabel: string): Promise<void> {
    const button = $(alertButton(buttonLabel));
    await button.waitForDisplayed();
    await button.click();
    await button.waitForDisplayed({ reverse: true });
  }
}

export default new Alert();
