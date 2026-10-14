import { expect } from '@wdio/globals';
import CatalogScreen from '../../screens/CatalogScreen.ts';
import DrawingScreen from '../../screens/DrawingScreen.ts';
import { PRODUCTS } from '../../fixtures/products.ts';
import { resetApp } from '../../utils/app.ts';
import { openDeepLink } from '../../utils/deeplink.ts';

const FIRST = PRODUCTS[0].name;
const LAST = PRODUCTS[PRODUCTS.length - 1].name;

/** A "Z" across the canvas, in canvas-relative coordinates. */
const Z_STROKE = [
  { x: 0.2, y: 0.25 },
  { x: 0.8, y: 0.25 },
  { x: 0.2, y: 0.75 },
  { x: 0.8, y: 0.75 },
];

describe('Gestures @regression', () => {
  beforeEach(async () => {
    await resetApp();
  });

  it('draws on the canvas with a touch stroke, and Clear wipes it', async () => {
    await openDeepLink('drawing');
    const blank = await DrawingScreen.snapshot();

    await DrawingScreen.draw(Z_STROKE);
    expect(await DrawingScreen.snapshot()).not.toBe(blank);

    await DrawingScreen.clear();
    expect(await DrawingScreen.snapshot()).toBe(blank);
  });

  it('swipes the catalog grid to its last products and back to the first', async () => {
    expect(await CatalogScreen.getVisibleProductNames()).toContain(FIRST);

    await CatalogScreen.swipeGrid('up');
    await CatalogScreen.swipeGrid('up');
    const atBottom = await CatalogScreen.getVisibleProductNames();
    expect(atBottom).toContain(LAST);
    expect(atBottom).not.toContain(FIRST);

    await CatalogScreen.swipeGrid('down');
    await CatalogScreen.swipeGrid('down');
    expect(await CatalogScreen.getVisibleProductNames()).toContain(FIRST);
  });
});
