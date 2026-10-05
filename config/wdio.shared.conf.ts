import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Settings shared by every platform. Platform files (wdio.android/ios.conf.ts) only add capabilities.
 *
 * Tag filtering: TAG=@smoke / SEM_TAG=@slow (same convention as the Playwright repo).
 */
const grep = process.env.TAG ?? process.env.SEM_TAG;
const timeoutFactor = Number(process.env.TIMEOUT_FACTOR ?? 1);

export const sharedConfig: WebdriverIO.Config = {
  runner: 'local',
  tsConfigPath: './tsconfig.json',
  specs: ['../tests/**/*.spec.ts'],
  maxInstances: 1,
  capabilities: [],
  logLevel: 'warn',
  outputDir: join(process.cwd(), 'logs'),
  bail: 0,
  waitforTimeout: 15_000 * timeoutFactor,
  connectionRetryTimeout: 180_000,
  connectionRetryCount: 1,
  services: [
    [
      'appium',
      {
        // Uses the project-local Appium (devDependency) so CI and laptops run the same version.
        command: 'appium',
        args: { relaxedSecurity: true, log: './logs/appium.log' },
      },
    ],
  ],
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 120_000 * timeoutFactor,
    ...(grep ? { grep, invert: !process.env.TAG && Boolean(process.env.SEM_TAG) } : {}),
  },
  reporters: [
    'spec',
    ['junit', { outputDir: './reports/junit', outputFileFormat: ({ cid }) => `results-${cid}.xml` }],
  ],

  /** Evidence on failure: screenshot + page source, attached next to the JUnit report. */
  afterTest: async function (test, _context, { passed }) {
    if (passed) return;
    const name = `${test.parent} - ${test.title}`.replace(/[^\w-]+/g, '_').slice(0, 120);
    const dir = join(process.cwd(), 'reports', 'failures');
    await mkdir(dir, { recursive: true });
    await driver.saveScreenshot(join(dir, `${name}.png`));
    await writeFile(join(dir, `${name}.xml`), await driver.getPageSource());
  },
};
