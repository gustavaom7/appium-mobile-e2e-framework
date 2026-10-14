import { expect } from '@wdio/globals';
import CartAccess from '../../screens/CartAccess.ts';
import CartScreen from '../../screens/CartScreen.ts';
import CatalogScreen from '../../screens/CatalogScreen.ts';
import ProductScreen from '../../screens/ProductScreen.ts';
import { PRODUCTS, type ProductColor } from '../../fixtures/products.ts';
import { resetApp } from '../../utils/app.ts';
import { cartPath, openDeepLink } from '../../utils/deeplink.ts';

const [BACKPACK, BIKE_LIGHT] = PRODUCTS;

/**
 * Adds a product through its page, the way a user does: color, then amount, then Add To Cart.
 * The page is opened from the catalog, NOT by deep link: on a deep-linked product page the app adds
 * an item without price (route id is a string, its addToCart compares it with ===), and the cart
 * then crashes rendering a NaN total. Going through the catalog also gives each product a fresh
 * page; a deep link from one product to another reuses the screen and keeps the previous counter.
 */
async function addFromProductPage(product: (typeof PRODUCTS)[number], amount: number, color?: ProductColor) {
  await openDeepLink('store-overview');
  await CatalogScreen.openProduct(product.name);
  await expect(ProductScreen.title).toHaveText(product.name);
  if (color) await ProductScreen.selectColor(color);
  for (let i = 1; i < amount; i++) await ProductScreen.increaseAmount();
  await expect(ProductScreen.counterAmount).toHaveText(String(amount));
  await ProductScreen.addToCart();
}

const totalOf = (...lines: [product: (typeof PRODUCTS)[number], amount: number][]) =>
  `$${lines.reduce((sum, [product, amount]) => sum + product.price * amount, 0).toFixed(2)}`;

describe('Cart @regression', () => {
  beforeEach(async () => {
    await resetApp();
  });

  it('lists added products with their color and amount, and totals them', async () => {
    await addFromProductPage(BACKPACK, 2, 'blue');
    await addFromProductPage(BIKE_LIGHT, 1);
    expect(await CartAccess.count()).toBe(3);

    await CartAccess.open();

    expect(await CartScreen.getProductNames()).toEqual([BACKPACK.name, BIKE_LIGHT.name]);
    const backpack = await CartScreen.row(BACKPACK.name);
    await expect(backpack.amount).toHaveText('2');
    await expect(backpack.price).toHaveText(`$${BACKPACK.price}`);
    await expect(backpack.colorCircle('blue')).toBeDisplayed();
    await expect(CartScreen.totalItems).toHaveText('3 items');
    await expect(CartScreen.totalPrice).toHaveText(totalOf([BACKPACK, 2], [BIKE_LIGHT, 1]));
  });

  it('updates totals from the row counter and drops a removed product', async () => {
    // Setup through a cart deep link (fast); adding from the product page is covered above.
    await openDeepLink(cartPath([{ productId: BACKPACK.id }, { productId: BIKE_LIGHT.id }]));

    await (await CartScreen.row(BACKPACK.name)).increase();
    await expect(CartScreen.totalItems).toHaveText('3 items');
    await expect(CartScreen.totalPrice).toHaveText(totalOf([BACKPACK, 2], [BIKE_LIGHT, 1]));

    await (await CartScreen.row(BIKE_LIGHT.name)).remove();
    await expect(CartScreen.totalItems).toHaveText('2 items');
    await expect(CartScreen.totalPrice).toHaveText(totalOf([BACKPACK, 2]));
    expect(await CartScreen.getProductNames()).toEqual([BACKPACK.name]);
    expect(await CartAccess.count()).toBe(2);
  });

  it('shows the empty cart once the last product is removed', async () => {
    await openDeepLink(cartPath([{ productId: BACKPACK.id }]));

    await (await CartScreen.row(BACKPACK.name)).remove();

    await expect(CartScreen.emptyCartMessage).toBeDisplayed();
    expect(await CartAccess.count()).toBe(0);
  });
});
