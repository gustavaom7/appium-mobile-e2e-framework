import { resolve } from 'node:path';
import { sharedConfig } from './wdio.shared.conf.ts';

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  capabilities: [
    {
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': process.env.IOS_DEVICE_NAME ?? 'iPhone 16',
      ...(process.env.IOS_PLATFORM_VERSION ? { 'appium:platformVersion': process.env.IOS_PLATFORM_VERSION } : {}),
      // Simulator build (.app or zipped .app) from the My Demo App release.
      'appium:app': resolve(process.env.IOS_APP ?? './apps/my-demo-app-sim.zip'),
      'appium:autoAcceptAlerts': true,
      'appium:newCommandTimeout': 240,
      'appium:wdaLaunchTimeout': 180_000,
      'appium:noReset': false,
    },
  ],
};
