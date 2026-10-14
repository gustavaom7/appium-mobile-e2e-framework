import { $ } from '@wdio/globals';
import { BaseScreen, screenWithRoot } from './BaseScreen.ts';
import { buttonId, byId, inputId, textChild } from '../utils/selectors.ts';
import { dismissKeyboard } from '../utils/keyboard.ts';

/** Webview menu entry: a native form that takes an https URL and opens it in an embedded WebView. */
class WebviewSelectionScreen extends BaseScreen {
  constructor() {
    super('webview selection screen');
  }

  get urlError() {
    return $(byId('URL-error-message')).$(textChild());
  }

  async goTo(url: string): Promise<void> {
    await this.waitForDisplayed();
    await $(inputId('URL')).setValue(url);
    await dismissKeyboard();
    await $(buttonId('Go To Site')).click();
  }
}

export const webviewSelectionScreen = new WebviewSelectionScreen();
/** Native screen hosting the WebView; the page itself is driven in the WEBVIEW context (utils/context.ts). */
export const webviewScreen = screenWithRoot('webview screen');
