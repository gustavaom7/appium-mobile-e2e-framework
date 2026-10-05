import { $ } from '@wdio/globals';
import { byId } from '../utils/selectors.ts';

/**
 * Every screen in the app renders a root view with a "<name> screen" accessibility id.
 * Waiting on it is how a Screen Object knows navigation finished: never `pause()`.
 */
export abstract class BaseScreen {
  protected constructor(private readonly rootId: string) {}

  protected get root() {
    return $(byId(this.rootId));
  }

  async waitForDisplayed(): Promise<void> {
    await this.root.waitForDisplayed({ timeoutMsg: `"${this.rootId}" was not displayed` });
  }

  async waitForHidden(): Promise<void> {
    await this.root.waitForDisplayed({ reverse: true, timeoutMsg: `"${this.rootId}" is still displayed` });
  }

  async isDisplayed(): Promise<boolean> {
    return this.root.isDisplayed();
  }
}
