import { expect } from '@wdio/globals';
import CatalogScreen from '../../screens/CatalogScreen.ts';
import ProductScreen from '../../screens/ProductScreen.ts';
import { PRODUCTS } from '../../fixtures/products.ts';
import { resetApp } from '../../utils/app.ts';
import { openDeepLink } from '../../utils/deeplink.ts';

describe('Product details @regression', () => {
  describe('every product, opened by deep link', () => {
    // Read-only checks: one clean start is enough, each test deep-links to its product.
    before(async () => {
      await resetApp();
    });

    for (const product of PRODUCTS) {
      it(`shows name, price and colors of ${product.name}`, async () => {
        await openDeepLink(`product-details/${product.id}`);

        await expect(ProductScreen.title).toHaveText(product.name);
        await expect(ProductScreen.price).toHaveText(`$${product.price}`);
        await expect(ProductScreen.description).toBeDisplayed();
        for (const color of product.colors) {
          await expect(ProductScreen.colorCircle(color)).toBeDisplayed();
        }
      });
    }
  });

  describe('interactions', () => {
    beforeEach(async () => {
      await resetApp();
    });

    it('opens a product from the catalog, scrolling the grid to reach it', async () => {
      const lastProduct = PRODUCTS[PRODUCTS.length - 1];

      await CatalogScreen.openProduct(lastProduct.name);

      await ProductScreen.waitForDisplayed();
      await expect(ProductScreen.title).toHaveText(lastProduct.name);
    });

    it('disables Add To Cart at amount 0 and re-enables it from the counter', async () => {
      await openDeepLink(`product-details/${PRODUCTS[0].id}`);
      await expect(ProductScreen.counterAmount).toHaveText('1');

      await ProductScreen.decreaseAmount();
      await expect(ProductScreen.counterAmount).toHaveText('0');
      await expect(ProductScreen.addToCartButton).toBeDisabled();

      await ProductScreen.increaseAmount();
      await ProductScreen.increaseAmount();
      await expect(ProductScreen.counterAmount).toHaveText('2');
      await expect(ProductScreen.addToCartButton).toBeEnabled();
    });
  });
});
