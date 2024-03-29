import { xy } from './utils';
import Point from '@mapbox/point-geometry';
import debug from 'debug';
const log = debug('pie-lib:plot:trig');

export const toDegrees = (radians) => radians * (180 / Math.PI);
export const toRadians = (degrees) => degrees * (Math.PI / 180);
/**
 * return angle in radians between 2 points using counting degrees counter clockwise
 *
 * 0,0 + 1,1 = 45 in radians
 * 1,1 + 0,0 = 45?
 * @param {Point} a
 * @param {Point} b
 */
export const angle = (a, b) => {
  const vd = b.y - a.y;
  const hd = b.x - a.x;
  log(a, b, 'vd: ', vd, 'hd: ', hd);
  const radians = Math.atan2(vd, hd);
  return radians < 0 ? radians + Math.PI * 2 : radians;
};

const NINETY = Math.PI / 2;
const ONE_EIGHTY = Math.PI;
const TWO_SEVENTY = ONE_EIGHTY + NINETY;

export const acuteXAngle = (a) => {
  log(toDegrees(a));

  if (a < NINETY) {
    return a;
  }

  if (a < ONE_EIGHTY) {
    return Math.abs(ONE_EIGHTY - a);
  }

  if (a < TWO_SEVENTY) {
    return Math.abs(ONE_EIGHTY - a);
  }

  return Math.abs(Math.PI * 2 - a);
};

export const acuteYAngle = (a) => NINETY - acuteXAngle(a);

export const hypotenuse = (a, alpha) => {
  const out = Math.abs(a / Math.sin(alpha));

  return out;
};

/**
 * return 2 edge points for a,b within domain + range.
 * - one edge is from following a -> b to the bounds
 * - one edge is from following b -> a to the bounds
 * @param {{min: number, max: number}} domain
 * @param {{min: number, max: number}} range
 * @param {{x: number, y: number}} a
 * @param {{x: number, y: number}} b
 * @returns [{x: number, y: number}, {x: number, y: number}]
 */
export const edges = (domain, range) => (a, b) => {
  // const xDest =
  const destX = a.x < b.x ? domain.max : domain.min;
  const destY = a.y < b.y ? range.max : range.min;
  const aToB = diffEdge(xy(destX, destY), a, b);

  const dX = b.x < a.x ? domain.max : domain.min;
  const dY = b.y < a.y ? range.max : range.min;
  const bToA = diffEdge(xy(dX, dY), b, a);
  return [aToB, bToA];
};

/** get length of side A of a triangle from H and angle Alpha */
export const getOpposingSide = (hyp, angle) => {
  log('[getOpposingSide] hyp: ', hyp, 'angle:', angle);
  return Math.abs(hyp * Math.sin(angle));
};

const getShortestSide = (xh, yh) => {
  if (Number.isFinite(xh) && Number.isFinite(yh)) {
    if (xh === 0 && yh > 0) {
      return 'y';
    }
    if (yh === 0 && xh > 0) {
      return 'x';
    }
    return xh < yh ? 'x' : 'y';
  }
  if (isNaN(xh) && !isNaN(yh)) {
    return 'y';
  }
  if (!isNaN(xh) && isNaN(yh)) {
    return 'x';
  }
  if (xh === Infinity) {
    return 'y';
  }
  if (yh === Infinity) {
    return 'x';
  }

  // eslint-disable-next-line no-console
  console.warn('hypotenuse - which is shorter? x:', xh, 'y:', yh);
};
/**
 * return the difference between bounds and a as a Point
 * @param {*} bounds
 */
export const diffEdge = (bounds, a, b) => {
  let l = log.enabled ? log.bind(log, `diffEdge: [${a.x},${a.y} -> ${b.x},${b.y}]`) : () => {};
  const xRadians = angle(a, b);
  l('x angle', toDegrees(xRadians));
  const yRadians = Math.abs(xRadians - toRadians(90));
  l('y angle', toDegrees(yRadians));
  const xSide = Math.abs(a.x - bounds.x);

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

  l('x: side', xSide, 'h:', xH);
  l('y: side', ySide, 'h:', yH);
  const side = getShortestSide(xH, yH);

  if (side !== 'x' && side !== 'y') {
    throw new Error('Cant decide which hypotenuse to use');
  }
  const point =
    side === 'x' ? new Point(xSide, getOpposingSide(xH, xRadians)) : new Point(getOpposingSide(yH, yRadians), ySide);

  l('point:', point);
  const multiplier = new Point(b.x < a.x ? -1 : 1, b.y < a.y ? -1 : 1);
  l('multiplier:', multiplier);
  const out = point.multByPoint(multiplier);
  l('out:', out);
  const normalized = out.add(new Point(a.x, a.y));
  l('normalized:', normalized);
  return normalized;
};
