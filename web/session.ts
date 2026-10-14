import { browser } from '@wdio/globals';
import InventoryPage from './pages/InventoryPage.ts';

/**
 * SauceDemo keeps all state client side: the logged-in user in the `session-username` cookie and the
 * cart in localStorage (`cart-contents`). Clearing both gives every test a fresh, logged-out start
 * without restarting Chrome.
 */
export async function resetSession(): Promise<void> {
  await browser.url('/');
  await browser.deleteAllCookies();
  await browser.execute(() => localStorage.clear());
}

/** Logs in by setting the session cookie (the Playwright repo's storageState equivalent): no UI replay. */
export async function loginAs(username: string): Promise<void> {
  await browser.url('/');
  await browser.setCookies({ name: 'session-username', value: username, path: '/' });
  await InventoryPage.open();
}
