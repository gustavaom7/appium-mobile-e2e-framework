import { expect } from '@wdio/globals';
import InventoryPage from '../../web/pages/InventoryPage.ts';
import LoginPage from '../../web/pages/LoginPage.ts';
import { resetSession } from '../../web/session.ts';
import { SAUCE_LOGIN_ERRORS, SAUCE_PASSWORD, SAUCE_USERS } from '../../fixtures/saucedemo.ts';

const INVALID_LOGINS = [
  { case: 'empty username', username: '', password: SAUCE_PASSWORD, error: SAUCE_LOGIN_ERRORS.usernameRequired },
  { case: 'empty password', username: SAUCE_USERS.standard, password: '', error: SAUCE_LOGIN_ERRORS.passwordRequired },
  { case: 'locked out user', username: SAUCE_USERS.lockedOut, password: SAUCE_PASSWORD, error: SAUCE_LOGIN_ERRORS.lockedOut },
  { case: 'wrong password', username: SAUCE_USERS.standard, password: 'wrong-password', error: SAUCE_LOGIN_ERRORS.noMatch },
];

describe('SauceDemo login on Android Chrome @regression', () => {
  beforeEach(async () => {
    await resetSession();
    await LoginPage.open();
  });

  it('logs in through the form', async () => {
    await LoginPage.login(SAUCE_USERS.standard, SAUCE_PASSWORD);

    await InventoryPage.waitForDisplayed();
  });

  for (const { case: title, username, password, error } of INVALID_LOGINS) {
    it(`rejects ${title}`, async () => {
      await LoginPage.login(username, password);

      await expect(LoginPage.error).toHaveText(error);
    });
  }
});
