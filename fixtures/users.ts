/** Credentials hardcoded in the demo app (src/utils/Constants.ts). Not secrets. */
export const USERS = {
  standard: { username: 'bob@example.com', password: '10203040' },
  lockedOut: { username: 'alice@example.com', password: '10203040' },
} as const;

export const LOGIN_ERRORS = {
  usernameRequired: 'Username is required',
  passwordRequired: 'Password is required',
  lockedOut: 'Sorry, this user has been locked out.',
  noMatch: 'Provided credentials do not match any user in this service.',
} as const;
