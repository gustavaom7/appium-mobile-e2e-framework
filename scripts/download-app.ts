/**
 * Downloads the My Demo App build for a platform from its GitHub release into ./apps.
 *
 *   npm run app:android        -> apps/my-demo-app.apk
 *   npm run app:ios            -> apps/my-demo-app-sim.zip (simulator build)
 *
 * Asset names change between releases, so they are resolved from the release API by pattern
 * instead of hardcoded. Set GITHUB_TOKEN in CI to avoid the anonymous API rate limit.
 */
import { createWriteStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type { ReadableStream } from 'node:stream/web';
import { APP_RELEASE } from '../config/app.ts';

const TARGETS = {
  android: { pattern: /^Android-MyDemoAppRN.*\.apk$/, output: 'apps/my-demo-app.apk' },
  ios: { pattern: /^iOS-Simulator-MyRNDemoApp.*\.zip$/, output: 'apps/my-demo-app-sim.zip' },
} as const;

type Platform = keyof typeof TARGETS;

async function main(): Promise<void> {
  const platform = process.argv[2] as Platform;
  const target = TARGETS[platform];
  if (!target) throw new Error(`Usage: download-app.ts <${Object.keys(TARGETS).join('|')}>`);

  if (await stat(target.output).catch(() => null)) {
    console.log(`${target.output} already present, skipping (delete it to re-download).`);
    return;
  }

  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const releaseUrl = `https://api.github.com/repos/saucelabs/my-demo-app-rn/releases/tags/${APP_RELEASE}`;
  const res = await fetch(releaseUrl, { headers });
  if (!res.ok) throw new Error(`GET ${releaseUrl} -> ${res.status}`);
  const release = (await res.json()) as { assets: { name: string; browser_download_url: string }[] };

  const asset = release.assets.find((a) => target.pattern.test(a.name));
  if (!asset) {
    const names = release.assets.map((a) => a.name).join(', ');
    throw new Error(`No asset matching ${target.pattern} in ${APP_RELEASE}. Available: ${names}`);
  }

  console.log(`Downloading ${asset.name} -> ${target.output}`);
  const download = await fetch(asset.browser_download_url);
  if (!download.ok || !download.body) throw new Error(`Download failed: ${download.status}`);
  await mkdir('apps', { recursive: true });
  await pipeline(Readable.fromWeb(download.body as ReadableStream), createWriteStream(target.output));
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
