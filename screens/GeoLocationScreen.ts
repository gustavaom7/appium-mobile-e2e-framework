import { $ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen.ts';
import { buttonId, byId } from '../utils/selectors.ts';

export type Coordinates = { latitude: number; longitude: number };

/** Shows the device position; watches it (every ~2s) while observing, which starts on open. */
class GeoLocationScreen extends BaseScreen {
  constructor() {
    super('geo location screen');
  }

  async getCoordinates(): Promise<Coordinates> {
    await this.waitForDisplayed();
    return {
      latitude: Number(await $(byId('latitude data')).getText()),
      longitude: Number(await $(byId('longitude data')).getText()),
    };
  }

  async startObserving(): Promise<void> {
    await $(buttonId('Start Observing')).click();
  }

  async stopObserving(): Promise<void> {
    await $(buttonId('Stop Observing')).click();
  }
}

export default new GeoLocationScreen();
