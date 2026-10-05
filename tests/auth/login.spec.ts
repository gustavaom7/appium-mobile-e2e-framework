import { expect } from '@wdio/globals';
import AppHeader from '../../screens/components/AppHeader.ts';
import CheckoutAddressScreen from '../../screens/CheckoutAddressScreen.ts';
import LoginScreen from '../../screens/LoginScreen.ts';
import { LOGIN_ERRORS, USERS } from '../../fixtures/users.ts';
import { openDeepLink } from '../../utils/deeplink.ts';

const INVALID_LOGINS = [
  { case: 'empty username', username: '', password: USERS.standard.password, error: LOGIN_ERRORS.usernameRequired },
  { case: 'empty password', username: USERS.standard.username, password: '', error: LOGIN_ERRORS.passwordRequired },
  { case: 'locked out user', ...USERS.lockedOut, error: LOGIN_ERRORS.lockedOut },
  { case: 'wrong password', username: USERS.standard.username, password: 'wrong-password', error: LOGIN_ERRORS.noMatch },
];

describe('Login', () => {
  beforeEach(async () => {
    await AppHeader.resetAppState();
    await openDeepLink('login');
  });

  it('logs in a standard user and continues to checkout @smoke', async () => {
    await LoginScreen.login(USERS.standard.username, USERS.standard.password);

    // With no pending destination, a successful login lands on the shipping address step.
    await CheckoutAddressScreen.waitForDisplayed();
  });

  for (const { case: title, username, password, error } of INVALID_LOGINS) {
    it(`rejects ${title}`, async () => {
      await LoginScreen.login(username, password);

      await expect(LoginScreen.errorMessage(error)).toBeDisplayed();
      expect(await LoginScreen.isDisplayed()).toBe(true);
    });
  }
});
