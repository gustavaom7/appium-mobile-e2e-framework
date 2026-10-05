import { resolve } from 'node:path';
import { APP_ID } from './app.ts';
import { sharedConfig } from './wdio.shared.conf.ts';

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': process.env.ANDROID_DEVICE_NAME ?? 'Android Emulator',
      ...(process.env.ANDROID_PLATFORM_VERSION
        ? { 'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION }
        : {}),
      'appium:app': resolve(process.env.ANDROID_APP ?? './apps/my-demo-app.apk'),
      'appium:appPackage': APP_ID,
      'appium:appWaitActivity': '*',
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 240,
      // One clean install per spec file (WDIO opens one session per file);
      // between tests inside a file, state is reset in-app (see AppHeader.resetAppState).
      'appium:noReset': false,
    },
  ],
};
