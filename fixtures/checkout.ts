/** Checkout data. The card is the standard Visa test number (passes the app's Luhn check), not a real card. */
export const SHIPPING_ADDRESS = {
  fullName: 'Ada Lovelace',
  addressLineOne: '12 Analytical Street',
  city: 'London',
  zipCode: 'NW1 6XE',
  country: 'United Kingdom',
} as const;

export const PAYMENT_CARD = {
  fullName: 'Ada Lovelace',
  number: '4111111111111111',
  expirationDate: '0330',
  securityCode: '123',
} as const;

/** Flat delivery fee the review screen adds to the cart total (src/containers/CheckoutReviewOrderPage.tsx). */
export const DELIVERY_COSTS = 5.99;

export const ADDRESS_ERRORS = {
  fullName: 'Please provide your full name.',
  addressLineOne: 'Please provide your address.',
  city: 'Please provide your city.',
  zipCode: 'Please provide your zip code.',
  country: 'Please provide your country.',
} as const;

/** The payment form uses one message for every invalid field. */
export const PAYMENT_ERROR = 'Value looks invalid.';
