import { driver } from '@wdio/globals';

/**
 * Device-level interruptions for the native suite. Both only stop and resume the activity, which
 * My Demo App survives; a process death or an unhandled configuration change would recreate it,
 * which it does not (CLAUDE.md). Rotation does not apply: the app is locked to portrait.
 */
export async function sendToBackgroundFor(seconds: number): Promise<void> {
  await driver.background(seconds);
}

/** Screen off and back on (the emulator has no PIN, so unlock needs no credentials). */
export async function lockAndUnlockScreen(): Promise<void> {
  await driver.lock();
  await driver.waitUntil(() => driver.isLocked(), { timeoutMsg: 'Screen did not lock' });
  await driver.unlock();
  await driver.waitUntil(async () => !(await driver.isLocked()), { timeoutMsg: 'Screen did not unlock' });
}
