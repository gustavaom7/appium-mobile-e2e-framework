/** SauceDemo ships `data-test` attributes on every interactive element (same selectors as the Playwright repo). */
export const byTest = (id: string): string => `[data-test="${id}"]`;
