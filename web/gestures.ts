import { browser } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';

/**
 * A real touch (W3C pointer of type "touch"), not the mouse click `element.click()` sends.
 * Unlike click(), a pointer action does not scroll: an element below the fold is scrolled into view first.
 * Only then, never while a panel animates: scrolling a link of the sliding menu mid-animation pushes it away.
 */
export async function tap(element: ChainablePromiseElement): Promise<void> {
  await element.waitForExist();
  if (!(await element.isDisplayed({ withinViewport: true }))) await element.scrollIntoView();
  await element.waitForDisplayed({ withinViewport: true });
  await browser
    .action('pointer', { parameters: { pointerType: 'touch' } })
    .move({ origin: await element.getElement() })
    .down()
    .up()
    .perform();
}
