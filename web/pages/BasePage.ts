import { $, browser } from '@wdio/globals';

/**
 * A page is identified by its URL path and a root element that only renders once it is ready.
 * Waiting on the root is how a Page Object knows navigation finished: never `pause()`.
 */
export abstract class BasePage {
  protected constructor(
    private readonly path: string,
    private readonly rootSelector: string,
  ) {}

  protected get root() {
    return $(this.rootSelector);
  }

  async open(): Promise<void> {
    await browser.url(this.path);
    await this.waitForDisplayed();
  }

  async waitForDisplayed(): Promise<void> {
    await this.root.waitForDisplayed({ timeoutMsg: `${this.path} (${this.rootSelector}) was not displayed` });
  }
}
