import { browser, driver } from '@wdio/globals';

/**
 * Device-level checks for the mobile-web suite. The on-screen keyboard and the screen orientation
 * belong to Android, not to the page: they are read in the NATIVE_APP context, then the suite
 * switches back to Chrome's context.
 */
export async function inNativeContext<T>(fn: () => Promise<T>): Promise<T> {
  const webContext = (await driver.getContext()) as string;
  await driver.switchContext('NATIVE_APP');
  try {
    return await fn();
  } finally {
    await driver.switchContext(webContext);
  }
}

export async function waitForKeyboard(shown: boolean): Promise<void> {
  await browser.waitUntil(() => inNativeContext(async () => (await driver.isKeyboardShown()) === shown), {
    timeoutMsg: `On-screen keyboard is still ${shown ? 'hidden' : 'shown'}`,
  });
}

export async function hideKeyboard(): Promise<void> {
  await inNativeContext(() => driver.hideKeyboard());
  await waitForKeyboard(false);
}

/** Height of the part of the page the user can see: the on-screen keyboard shrinks it, layout does not change. */
export async function visibleViewportHeight(): Promise<number> {
  return browser.execute(() => window.visualViewport?.height ?? window.innerHeight);
}
