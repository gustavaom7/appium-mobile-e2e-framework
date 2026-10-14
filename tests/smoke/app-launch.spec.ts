import { expect } from '@wdio/globals';
import CatalogScreen from '../../screens/CatalogScreen.ts';
import { PRODUCTS } from '../../fixtures/products.ts';
import { coldStartTimeout } from '../../utils/app.ts';

describe('App launch @smoke', () => {
  it('opens on the catalog with products listed', async () => {
    // First launch of a fresh install (session start): the slowest screen of the suite.
    await CatalogScreen.waitForDisplayed(coldStartTimeout());

    const names = await CatalogScreen.getVisibleProductNames();

    expect(names.length).toBeGreaterThan(0);
    // The default sort is name ascending, so the first card is deterministic.
    expect(names[0]).toBe(PRODUCTS[0].name);
  });
});
