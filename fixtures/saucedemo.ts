/** Public demo credentials shown on the SauceDemo login page. Not secrets. */
export const SAUCE_PASSWORD = 'secret_sauce';

export const SAUCE_USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
} as const;

/** `slug` is the suffix of the item's data-test ids (e.g. add-to-cart-sauce-labs-backpack). */
export const SAUCE_PRODUCTS = {
  backpack: { slug: 'sauce-labs-backpack', name: 'Sauce Labs Backpack', price: 29.99 },
  bikeLight: { slug: 'sauce-labs-bike-light', name: 'Sauce Labs Bike Light', price: 9.99 },
} as const;

/** SauceDemo charges a flat 8% tax at checkout. */
export const SAUCE_TAX_RATE = 0.08;

export const CHECKOUT_INFO = { firstName: 'Ada', lastName: 'Lovelace', postalCode: '12345' } as const;
