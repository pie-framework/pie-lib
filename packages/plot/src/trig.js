import { xy } from '../lib/utils';
import Point from '@mapbox/point-geometry';
const slope = (a, b) => (b.y - a.y) / (b.x - a.x);
export const toDegrees = radians => radians * (180 / Math.PI);
export const toRadians = degrees => degrees * (Math.PI / 180);
/**
 * For 2 points return the internal angle A from the horizontal line at a.y.
 *
 * 0,0 + 1,1 = 45
 * 1,1 + 0,0 = 45?
 * @param {Point} a
 * @param {Point} b
 */
export const angle = (a, b) => {
  const s = slope(a, b);
  const vd = b.y - a.y;
  const hd = b.x - a.x;
  const radians = Math.atan(vd / hd);
  return radians;
  // return toDegrees(radians);
  // console.log('s:', s);
};

export const hypotenuse = (a, alpha) => a / Math.sin(alpha);

export const maxEdge = (domain, range) => (a, b) => {
  const diff = diffEdge(xy(domain.max, range.max), a, b);
  return new Point(a.x, a.y).add(diff);
};
export const minEdge = (domain, range) => (a, b) => {
  const diff = diffEdge(xy(domain.min, range.min), a, b);
  return new Point(a.x, a.y).sub(diff);
};

export const edges = (domain, range) => (a, b) => [
  minEdge(domain, range)(a, b),
  maxEdge(domain, range)(a, b)
];

/**
 * return the difference between bounds and a as a Point
 * @param {*} bounds
 */
export const diffEdge = (bounds, a, b) => {
  const log = console.log.bind(console, `[${a.x},${a.y}-${b.x},${b.y}]`);
  const xRadians = angle(a, b);
  log('x angle', toDegrees(xRadians));
  const yRadians = Math.abs(xRadians - toRadians(90));
  log('y angle', toDegrees(yRadians));

  const xSide = Math.abs(a.x - bounds.x);
  // const xAngle = toRadians(90) - xRadians;

  /**
   * Draw 2 triangles:
   * 1 with a horizontal line from a to the graph x edge
   * 1 with a vertical line from a to the graph y edge
   * Calculate the hypotenuse for both, whichever is shorter
   * indicates that we should use that triangle to get the edge point.
   */
  const xH = hypotenuse(xSide, yRadians);

  const ySide = Math.abs(a.y - bounds.y);
  const yH = hypotenuse(ySide, xRadians);

  log('x: side', xSide, 'h:', xH);
  log('y: side', ySide, 'h:', yH);

  // use the shortest hypotenuse
  if (xH <= yH) {
    // const xSide = Math.abs(a.x - domain.max);
    // const eH = hypotenuse(xSide, yRadians);
    const ySide = xH * Math.sin(xRadians);
    // log(xSide, ySide, eH);
    return new Point(xSide, ySide);
  }

  const xs = yH * Math.sin(yRadians);

  return new Point(xs, ySide);
};
