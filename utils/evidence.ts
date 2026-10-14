import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { driver } from '@wdio/globals';
import { addAttachment } from '@wdio/allure-reporter';

const FAILURES_DIR = join(process.cwd(), 'reports', 'failures');

/**
 * Every helper here is best effort: evidence is collected around a test that may have failed because the
 * session died, and a throw from here would replace the real error in the report.
 */
async function bestEffort<T>(what: string, fn: () => Promise<T>): Promise<T | undefined> {
  try {
    return await fn();
  } catch (err) {
    console.warn(`Could not ${what}: ${(err as Error).message}`);
    return undefined;
  }
}

/** NO_VIDEO=1 skips screen recording (slow machines; the device encodes the video itself). */
const VIDEO_ENABLED = !process.env.NO_VIDEO;

/** Starts a device screen recording for the test about to run (adb screenrecord under the hood). */
export async function startVideo(): Promise<void> {
  if (!VIDEO_ENABLED) return;
  await bestEffort('start the screen recording', () => driver.startRecordingScreen({ timeLimit: 600 }));
}

/**
 * Always stops the recording; on failure keeps the evidence twice: as files in reports/failures/ (uploaded
 * by CI as an artifact) and as Allure attachments (screenshot, page source, video).
 */
export async function collectEvidence(testName: string, passed: boolean): Promise<void> {
  const video = VIDEO_ENABLED
    ? await bestEffort('stop the screen recording', () => driver.stopRecordingScreen())
    : undefined;
  if (passed) return;

  const name = testName.replace(/[^\w-]+/g, '_').slice(0, 120);
  await mkdir(FAILURES_DIR, { recursive: true });

  const screenshot = await bestEffort('take the failure screenshot', () => driver.takeScreenshot());
  if (screenshot) {
    const png = Buffer.from(screenshot, 'base64');
    await writeFile(join(FAILURES_DIR, `${name}.png`), png);
    addAttachment('Screenshot', png, 'image/png');
  }

  const source = await bestEffort('read the failure page source', () => driver.getPageSource());
  if (source) {
    await writeFile(join(FAILURES_DIR, `${name}.xml`), source);
    addAttachment('Page source', source, 'application/xml');
  }

  if (video) {
    const mp4 = Buffer.from(video, 'base64');
    await writeFile(join(FAILURES_DIR, `${name}.mp4`), mp4);
    addAttachment('Screen recording', mp4, 'video/mp4');
  }
}
