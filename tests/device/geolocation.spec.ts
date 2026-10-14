import { browser, driver, expect } from '@wdio/globals';
import GeoLocationScreen, { type Coordinates } from '../../screens/GeoLocationScreen.ts';
import { LOCATIONS } from '../../fixtures/locations.ts';
import { resetApp } from '../../utils/app.ts';
import { openDeepLink } from '../../utils/deeplink.ts';

/** The mocked GPS fix comes back with float noise: 4 decimals is ~10 m, plenty to tell places apart. */
const isAt = (actual: Coordinates, expected: Coordinates) =>
  Math.abs(actual.latitude - expected.latitude) < 1e-4 && Math.abs(actual.longitude - expected.longitude) < 1e-4;

async function waitUntilShowing(expected: Coordinates): Promise<void> {
  await browser.waitUntil(async () => isAt(await GeoLocationScreen.getCoordinates(), expected), {
    timeoutMsg: `Coordinates never showed ${JSON.stringify(expected)}`,
  });
}

describe('Geo location @regression', () => {
  beforeEach(async () => {
    await resetApp();
    await driver.setGeoLocation({ ...LOCATIONS.amsterdam, altitude: 0 });
    await openDeepLink('geo-locations');
  });

  it('shows the mocked device position', async () => {
    await waitUntilShowing(LOCATIONS.amsterdam);
  });

  it('follows the position while observing', async () => {
    await waitUntilShowing(LOCATIONS.amsterdam);

    await driver.setGeoLocation({ ...LOCATIONS.saoPaulo, altitude: 0 });

    await waitUntilShowing(LOCATIONS.saoPaulo);
  });

  it('stops following once observing is stopped', async () => {
    await waitUntilShowing(LOCATIONS.amsterdam);
    await GeoLocationScreen.stopObserving();

    await driver.setGeoLocation({ ...LOCATIONS.saoPaulo, altitude: 0 });
    // Updates arrive every ~2s; a few cycles without one is the observable "nothing changes".
    await expect(
      browser.waitUntil(async () => isAt(await GeoLocationScreen.getCoordinates(), LOCATIONS.saoPaulo), { timeout: 8_000 }),
    ).rejects.toThrow();
    expect(isAt(await GeoLocationScreen.getCoordinates(), LOCATIONS.amsterdam)).toBe(true);

    await GeoLocationScreen.startObserving();
    await waitUntilShowing(LOCATIONS.saoPaulo);
  });
});
