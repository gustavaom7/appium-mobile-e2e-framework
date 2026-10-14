import { expect } from '@wdio/globals';
import CatalogScreen from '../../screens/CatalogScreen.ts';
import { PRODUCTS, type SortOption } from '../../fixtures/products.ts';
import { resetApp } from '../../utils/app.ts';

type Product = (typeof PRODUCTS)[number];

/**
 * Expected order mirrors the app's comparator (src/utils/Sorting.ts). Two products share a price, so
 * price sorts are checked on prices only: the order between equal prices is not part of the contract.
 */
const SORT_CASES: { option: SortOption; title: string; by: 'name' | 'price'; compare: (a: Product, b: Product) => number }[] = [
  { option: 'nameAsc', title: 'name, ascending', by: 'name', compare: (a, b) => a.name.localeCompare(b.name) },
  { option: 'nameDesc', title: 'name, descending', by: 'name', compare: (a, b) => b.name.localeCompare(a.name) },
  { option: 'priceAsc', title: 'price, ascending', by: 'price', compare: (a, b) => a.price - b.price },
  { option: 'priceDesc', title: 'price, descending', by: 'price', compare: (a, b) => b.price - a.price },
];

describe('Catalog sort @regression', () => {
  beforeEach(async () => {
    await resetApp();
  });

  for (const { option, title, by, compare } of SORT_CASES) {
    it(`sorts by ${title}`, async () => {
      const expected = [...PRODUCTS].sort(compare);
      // nameAsc is the default order: start from another one so the test proves the option did something.
      if (option === 'nameAsc') await CatalogScreen.sortBy('priceDesc');

      await CatalogScreen.sortBy(option);

      // The grid is virtualized: only the cards on screen are checked, against the head of the expected list.
      if (by === 'name') {
        const names = await CatalogScreen.getVisibleProductNames();
        expect(names.length).toBeGreaterThan(1);
        expect(names).toEqual(expected.slice(0, names.length).map((p) => p.name));
      } else {
        const prices = await CatalogScreen.getVisibleProductPrices();
        expect(prices.length).toBeGreaterThan(1);
        expect(prices).toEqual(expected.slice(0, prices.length).map((p) => p.price));
      }
    });
  }
});
