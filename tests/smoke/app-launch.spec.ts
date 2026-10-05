import { expect } from '@wdio/globals';
import CatalogScreen from '../../screens/CatalogScreen.ts';
import { PRODUCTS } from '../../fixtures/products.ts';

describe('App launch @smoke', () => {
  it('opens on the catalog with products listed', async () => {
    await CatalogScreen.waitForDisplayed();

    const names = await CatalogScreen.getVisibleProductNames();

    expect(names.length).toBeGreaterThan(0);
    // The default sort is name ascending, so the first card is deterministic.
    expect(names[0]).toBe(PRODUCTS[0].name);
  });
});
