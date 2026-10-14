import { driver } from '@wdio/globals';

/** On small Android screens the on-screen keyboard covers the submit buttons: close it before tapping them. */
export async function dismissKeyboard(): Promise<void> {
  if (driver.isAndroid && (await driver.isKeyboardShown())) await driver.hideKeyboard();
}
