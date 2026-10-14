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

  /** `timeout` overrides the configured waitforTimeout, for the few waits known to be slower (cold starts). */
  async waitForDisplayed(timeout?: number): Promise<void> {
    await this.root.waitForDisplayed({ timeout, timeoutMsg: `"${this.rootId}" was not displayed` });
  }

  async waitForHidden(): Promise<void> {
    await this.root.waitForDisplayed({ reverse: true, timeoutMsg: `"${this.rootId}" is still displayed` });
  }

  async isDisplayed(): Promise<boolean> {
    return this.root.isDisplayed();
  }
}

/** A screen known only by its root id, for checks that just need to land on it (e.g. menu destinations). */
export function screenWithRoot(rootId: string): BaseScreen {
  return new (class extends BaseScreen {
    constructor() {
      super(rootId);
    }
  })();
}
