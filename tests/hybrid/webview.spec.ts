import { expect } from '@wdio/globals';
import InventoryPage from '../../web/pages/InventoryPage.ts';
import LoginPage from '../../web/pages/LoginPage.ts';
import { webviewScreen, webviewSelectionScreen } from '../../screens/WebviewScreen.ts';
import { SAUCE_PASSWORD, SAUCE_USERS } from '../../fixtures/saucedemo.ts';
import { resetApp } from '../../utils/app.ts';
import { inWebview } from '../../utils/context.ts';
import { openDeepLink } from '../../utils/deeplink.ts';

const SAUCEDEMO = 'https://www.saucedemo.com';
const INVALID_URLS = [
  { title: 'plain http', url: 'http://www.saucedemo.com' },
  { title: 'text that is not a url', url: 'not a url' },
];

describe('Webview (hybrid) @regression', () => {
  beforeEach(async () => {
    await resetApp();
    await openDeepLink('webview');
  });

  it('opens an https site and drives its DOM from the WEBVIEW context', async () => {
    await webviewSelectionScreen.goTo(SAUCEDEMO);
    await webviewScreen.waitForDisplayed();

    // Same Page Objects as the mobile-web suite: inside the WEBVIEW context it is just a page.
    await inWebview(async () => {
      await LoginPage.login(SAUCE_USERS.standard, SAUCE_PASSWORD);
      await InventoryPage.waitForDisplayed();
    });

    // Back in NATIVE_APP: the app's own screen is still there around the page.
    await webviewScreen.waitForDisplayed();
  });

  for (const { title, url } of INVALID_URLS) {
    it(`rejects ${title}`, async () => {
      await webviewSelectionScreen.goTo(url);

      await expect(webviewSelectionScreen.urlError).toHaveText('Please provide a correct https url.');
      await webviewSelectionScreen.waitForDisplayed();
    });
  }
});
