import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { collectEvidence, startVideo } from '../utils/evidence.ts';

const ALLURE_RESULTS = './reports/allure-results';

/**
 * Settings shared by every platform. Platform files (wdio.android/ios.conf.ts) only add capabilities.
 *
 * Tag filtering: TAG=@smoke / SEM_TAG=@slow (same convention as the Playwright repo), alone or together.
 * Mocha turns a string grep into a RegExp tested against the full title, so both become lookaheads.
 */
const escapeRegExp = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const grep =
  process.env.TAG || process.env.SEM_TAG
    ? '^' +
      (process.env.TAG ? `(?=.*${escapeRegExp(process.env.TAG)})` : '') +
      (process.env.SEM_TAG ? `(?!.*${escapeRegExp(process.env.SEM_TAG)})` : '')
    : undefined;
const timeoutFactor = Number(process.env.TIMEOUT_FACTOR ?? 1);

export const sharedConfig: WebdriverIO.Config = {
  runner: 'local',
  tsConfigPath: './tsconfig.json',
  specs: ['../tests/**/*.spec.ts'],
  // Native app configs skip the mobile-web suite; wdio.android-web.conf.ts runs only that.
  exclude: ['../tests/web/**'],
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
    ...(grep ? { grep } : {}),
  },
  reporters: [
    'spec',
    ['junit', { outputDir: './reports/junit', outputFileFormat: ({ cid }) => `results-${cid}.xml` }],
    // WDIO command steps and auto-screenshots off: the report shows tests, not every driver call;
    // failure evidence is attached explicitly in afterTest.
    ['allure', { outputDir: ALLURE_RESULTS, disableWebdriverStepsReporting: true, disableWebdriverScreenshotsReporting: true }],
  ],

  /** One report per run: results from a previous run would show up as stale tests. */
  onPrepare: async function () {
    await rm(ALLURE_RESULTS, { recursive: true, force: true });
  },

  beforeTest: async function () {
    await startVideo();
  },

  /** Evidence on failure (screenshot, page source, video) as files and Allure attachments; see utils/evidence.ts. */
  afterTest: async function (test, _context, { passed }) {
    await collectEvidence(`${test.parent} - ${test.title}`, passed);
  },
};
