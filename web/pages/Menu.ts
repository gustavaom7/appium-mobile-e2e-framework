import { $ } from '@wdio/globals';
import { byTest } from '../selectors.ts';
import { tap } from '../gestures.ts';

/** Burger menu shared by every logged-in page, driven by touch. */
class Menu {
  /** Returns once the panel finished sliding in (its links are inside the viewport). */
  async open(): Promise<void> {
    await tap($(byTest('open-menu')));
    await $(byTest('logout-sidebar-link')).waitForDisplayed({ withinViewport: true });
  }

  async close(): Promise<void> {
    await tap($(byTest('close-menu')));
    await $(byTest('logout-sidebar-link')).waitForDisplayed({ withinViewport: true, reverse: true });
  }

  async logout(): Promise<void> {
    await this.open();
    await tap($(byTest('logout-sidebar-link')));
  }

  /** "Reset App State": empties the cart without logging out. */
  async resetAppState(): Promise<void> {
    await this.open();
    await tap($(byTest('reset-sidebar-link')));
  }
}

export default new Menu();
