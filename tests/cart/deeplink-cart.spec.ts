import { expect } from '@wdio/globals';
import CartScreen from '../../screens/CartScreen.ts';
import { PRODUCTS } from '../../fixtures/products.ts';
import { resetApp } from '../../utils/app.ts';
import { cartPath, openDeepLink, type CartLine } from '../../utils/deeplink.ts';

const [BACKPACK, BIKE_LIGHT, , , ONESIE] = PRODUCTS;

/** How the app fills the gaps of a cart link: amount 1, product's default color. */
const DEFAULT_CASES: { title: string; line: CartLine; amount: string; color: (typeof ONESIE.colors)[number] }[] = [
  { title: 'no amount: one unit', line: { productId: ONESIE.id, color: 'black' }, amount: '1', color: 'black' },
  { title: 'no color: the default color', line: { productId: ONESIE.id, amount: 2 }, amount: '2', color: ONESIE.defaultColor },
  { title: 'unknown color: the default color', line: { productId: ONESIE.id, amount: 2, color: 'purple' }, amount: '2', color: ONESIE.defaultColor },
];

describe('Cart seeded by deep link @regression', () => {
  beforeEach(async () => {
    await resetApp();
  });

  it('opens the cart with the products, amounts and colors of the link', async () => {
    await openDeepLink(
      cartPath([
        { productId: BACKPACK.id, amount: 2, color: 'blue' },
        { productId: BIKE_LIGHT.id, amount: 3, color: 'black' },
      ]),
    );

    expect(await CartScreen.getProductNames()).toEqual([BACKPACK.name, BIKE_LIGHT.name]);
    const backpack = await CartScreen.row(BACKPACK.name);
    await expect(backpack.amount).toHaveText('2');
    await expect(backpack.colorCircle('blue')).toBeDisplayed();
    await expect((await CartScreen.row(BIKE_LIGHT.name)).amount).toHaveText('3');
    await expect(CartScreen.totalItems).toHaveText('5 items');
    await expect(CartScreen.totalPrice).toHaveText(`$${(BACKPACK.price * 2 + BIKE_LIGHT.price * 3).toFixed(2)}`);
  });

  for (const { title, line, amount, color } of DEFAULT_CASES) {
    it(`fills in ${title}`, async () => {
      await openDeepLink(cartPath([line]));

      const row = await CartScreen.row(ONESIE.name);
      await expect(row.amount).toHaveText(amount);
      await expect(row.colorCircle(color)).toBeDisplayed();
    });
  }
});
