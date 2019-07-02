import { trigCalculator } from 'trigonometry-calculator';
import Point from '@mapbox/point-geometry';
import debug from 'debug';
import { parse as parseOrigin } from './transform-origin';
const log = debug('@pie-lib:tools:anchor-utils');

export const toDegrees = radians => radians * (180 / Math.PI);
export const toRadians = degrees => degrees * (Math.PI / 180);

export const normalizeAngle = a => {
  if (a > 360) {
    return a % 360;
  } else if (a < 0) {
    return 360 + (a % 360);
  }
  return a;
};

export const toPoint = (rect, edge) => {
  const out = parseOrigin(rect, edge);
  return new Point(out.x, out.y);
};

/**
 * Get the distance between to anchor points in a rect.
 * @param {{width: number, height: number}} rect - the rect
 * @param {number} degrees - the degrees
 * @param {string} from - from anchor
 * @param {string} to - to anchor
 * @returns {Point} point - the distance as a Point
 */
export const distanceBetween = (rect, degrees, from, to) => {
  const center = new Point(rect.width / 2, rect.height / 2);
  const radians = toRadians(degrees);
  const fromCenter = center.rotateAround(radians, toPoint(rect, from));
  const toCenter = center.rotateAround(radians, toPoint(rect, to));
  const diff = fromCenter.sub(toCenter);
  return diff;
};

/**
 * For a corner string, a point and a rect, return a relative x,y from that point to a corner.
 * Note that the y value descends as it goes down (unlike for a screen's y value), so this is only really useful for math functions.
 * @example
 * ```
 * getXAndY('top-left', {width: 100, height: 100}, 10, 10) //=> {x:10, y: -90}
 * ```
 * @param {*} corner
 * @param {*} rect
 * @param {*} point
 */
export const getXAndY = (corner, rect, point) => {
  if (corner === 'top-left') {
    const x = point.x * -1;
    const y = point.y;
    return { x, y };
  } else if (corner === 'bottom-left') {
    const x = point.x * -1;
    const y = point.y - rect.height;
    return { x, y };
  } else if (corner === 'top-right') {
    const x = rect.width - point.x;
    const y = point.y;
    return { x, y };
  } else if (corner === 'bottom-right') {
    const x = rect.width - point.x;
    const y = point.y - rect.height;
    return { x, y };
  }
};

export const arctangent = (x, y) => toDegrees(Math.atan2(x, y));

export const getAngleAndHypotenuse = (corner, rect, point) => {
  const { x, y } = getXAndY(corner, rect, point);
  const degrees = arctangent(x, y);
  const hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return { x, y, degrees, hypotenuse };
};

const getPosition = (side, rect, point, angle, calcAngle) => {
  if (angle === 0) {
    return side === 'left' ? point.x : point.y;
  }
  const points = anglePoints(angle);
  const key = points[side];

  const { degrees, hypotenuse } = getAngleAndHypotenuse(key, rect, point);

  const ra = calcAngle(degrees);

  if (ra === 0) {
    return hypotenuse;
  }

  const t = {
    angles: { 0: ra, 1: 90 },
    sides: { 1: hypotenuse }
  };
  const out = trigCalculator(t);
  return out.sides[2];
};

export const getTop = (rect, point, angle) => {
  return getPosition('top', rect, point, angle, degrees => {
    return Math.abs(angle + degrees);
  });
};

export const getLeft = (rect, point, angle) => {
  return getPosition('left', rect, point, angle, degrees => {
    return Math.abs(angle + degrees + 90);
  });
};

/**
 * Calculate the position of an anchor within a bounding rect, if the source rect has been rotated by an angle.
 * It does this by finding the appropriate corner of the src rect, that touches the bounding rect, calculates
 * the hypotenuse (h) of that anchor to that point. Then using that plus the rotation it calculates
 * the sides of the triangle and returns the length of the side that touches the bounding rect.
 * @param {{width: number, height: number}} rect - the rect which contains the point
 * @param {{x:number, y: number}} point - the point within the rect
 * @param {number} angle - the angle in degrees that the rect has rotated.
 * @returns {{left: number, top: number}} position
 */
export const getAnchor = (rect, point, angle) => {
  log('[getAnchor] rect: ', rect, 'point:', point, 'angle: ', angle);
  if (point.x > rect.width) {
    throw new Error(`x: ${point.x} cannot be greater than width: ${rect.width}`);
  }
  if (point.y > rect.height) {
    throw new Error(`y: ${point.y} cannot be greater than height: ${rect.height}`);
  }
  const a = normalizeAngle(angle);
  const top = getTop(rect, point, a);
  const left = getLeft(rect, point, a);

  log('[getAnchor] top: ', top, 'left: ', left);
  return { top, left };
};

const anglePoints = angle => {
  if (angle <= 90) {
    return { top: 'top-left', left: 'bottom-left' };
  } else if (angle > 90 && angle <= 180) {
    return { top: 'bottom-left', left: 'bottom-right' };
  } else if (angle > 180 && angle <= 270) {
    return { top: 'bottom-right', left: 'top-right' };
  } else if (angle > 270 && angle < 360) {
    return { top: 'top-right', left: 'top-left' };
  }
};
