import { chromedriverAutodownload } from './chromedriver.ts';
import { sharedConfig } from './wdio.shared.conf.ts';

/**
 * SauceDemo (web) in the real Chrome of the Android emulator, driven through Appium + chromedriver.
 * Complements the Playwright repo, which only emulates a mobile viewport on desktop Chromium.
 */
export const config: WebdriverIO.Config = {
  ...sharedConfig,
  specs: ['../tests/web/**/*.spec.ts'],
  exclude: [],
  baseUrl: process.env.WEB_BASE_URL ?? 'https://www.saucedemo.com',
  capabilities: [
    {
      platformName: 'Android',
      browserName: 'Chrome',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': process.env.ANDROID_DEVICE_NAME ?? 'Android Emulator',
      ...(process.env.ANDROID_PLATFORM_VERSION
        ? { 'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION }
        : {}),
      ...chromedriverAutodownload,
      'appium:chromeOptions': { args: ['--no-first-run', '--disable-fre', '--no-default-browser-check'] },
      'appium:newCommandTimeout': 240,
    },
  ],
};
