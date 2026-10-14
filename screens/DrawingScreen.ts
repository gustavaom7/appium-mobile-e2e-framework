import { $, browser } from '@wdio/globals';
import { BaseScreen } from './BaseScreen.ts';
import { buttonId, byId, byPlatform } from '../utils/selectors.ts';
import { inWebview } from '../utils/context.ts';
import { drawStroke, pointsInside, type Point } from '../utils/gestures.ts';

/** Signature-style canvas (react-native-signature-canvas, itself a WebView) with Clear / Save. */
class DrawingScreen extends BaseScreen {
  constructor() {
    super('drawing screen');
  }

  /** The outer WebView: Android exposes it and the document inside as two nested WebView nodes. */
  get canvas() {
    return $(byId('drawing screen')).$$(
      byPlatform({ android: 'android.webkit.WebView', ios: '-ios class chain:**/XCUIElementTypeWebView' }),
    )[0];
  }

  /** Draws one stroke through points given relative to the canvas (0..1 on each axis). */
  async draw(relative: Point[]): Promise<void> {
    await this.canvas.waitForDisplayed();
    await drawStroke(await pointsInside(this.canvas, relative));
  }

  /**
   * The canvas pixels as a data URL, read inside its WebView: equal snapshots mean an identical drawing.
   * (An element screenshot would not do: on Android it returns the whole screen, status bar clock included.)
   */
  async snapshot(): Promise<string> {
    await this.canvas.waitForDisplayed();
    return inWebview(() => browser.execute(() => document.querySelector('canvas')?.toDataURL() ?? ''));
  }

  async clear(): Promise<void> {
    await $(buttonId('Clear')).click();
  }
}

export default new DrawingScreen();
