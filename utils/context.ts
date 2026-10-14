import { driver } from '@wdio/globals';

/**
 * Runs `fn` inside the app's WebView (WEBVIEW_<package> context), then switches back to NATIVE_APP.
 * Waits for the context to show up: Android registers it only once the WebView has loaded.
 */
export async function inWebview<T>(fn: () => Promise<T>): Promise<T> {
  let webview: string | undefined;
  await driver.waitUntil(
    async () => {
      const contexts = (await driver.getContexts()) as string[];
      webview = contexts.find((c) => c.startsWith('WEBVIEW'));
      return Boolean(webview);
    },
    { timeoutMsg: 'No WEBVIEW context appeared' },
  );
  await driver.switchContext(webview as string);
  try {
    return await fn();
  } finally {
    await driver.switchContext('NATIVE_APP');
  }
}
