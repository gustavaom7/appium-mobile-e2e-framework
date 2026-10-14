import { driver } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';

export type Point = { x: number; y: number };

/**
 * One continuous finger stroke through `points` (W3C pointer of type touch): press on the first
 * point, move through the rest, lift. Coordinates are absolute screen points.
 */
export async function drawStroke(points: Point[], msPerSegment = 150): Promise<void> {
  const [start, ...rest] = points;
  let action = driver.action('pointer', { parameters: { pointerType: 'touch' } }).move(start).down();
  for (const point of rest) action = action.move({ ...point, duration: msPerSegment });
  await action.up().perform();
}

/** Maps relative positions (0..1) inside an element's rectangle to screen points. */
export async function pointsInside(element: ChainablePromiseElement, relative: Point[]): Promise<Point[]> {
  const { x, y } = await element.getLocation();
  const { width, height } = await element.getSize();
  return relative.map((p) => ({ x: Math.round(x + p.x * width), y: Math.round(y + p.y * height) }));
}

