import debug from 'debug';
import Point from '@mapbox/point-geometry';
import _ from 'lodash';
const log = debug('pie-lib:graphing:tools:utils');
/**
 * build the x points with root as the anchor.
 */
export const xPoints = (root, freq, min, max) => {
  freq = Math.abs(freq);
  log('[xPoints] root:', root, 'freq:', freq, ' min:', min, ' max:', max);
  const leftpoints = _.rangeRight(root, min - freq, freq * -1);
  const rightpoints = _.range(root + freq, max + freq, freq);

  return _.concat(leftpoints, rightpoints);
};

/**
 * Calculate y for x value using amp, freq and shift
 * https://www.desmos.com/calculator/f1psfoiiv6
 */
export const sinY = (amplitude, freq, shift) => x => {
  shift = { phase: 0, vertical: 0, ...shift };
  const TWO_PI = Math.PI * 2;
  const num = TWO_PI * (x - shift.phase);
  const frac = num / freq;
  const sin = Math.sin(frac);
  const sinFloat = parseFloat(sin).toFixed(10);
  return amplitude * sinFloat + shift.vertical;
};

/**
 * You need three points for the quadratic eq, so we mirror the edge point
 * https://www.desmos.com/calculator/xhz1xqgpca
 */
export const parabolaFromTwoPoints = (root, edge) => {
  edge = edge || { ...root };
  const mirrorEdge = { x: root.x - (edge.x - root.x), y: edge.y };
  return parabolaFromThreePoints(root, edge, mirrorEdge);
};

export const parabolaFromThreePoints = (one, two, three) => {
  log(one, two, three);
  const { a, b, c } = pointsToABC(one, two, three);
  log(a, b, c);
  return parabola(a, b, c);
};
/** derive a,b,c from the 3 points */
export const pointsToABC = (one, two, three) => {
  const a1 = Math.pow(one.x, 2) * -1 + Math.pow(two.x, 2);
  const b1 = one.x * -1 + two.x;
  const d1 = one.y * -1 + two.y;
  const a2 = Math.pow(two.x, 2) * -1 + Math.pow(three.x, 2);
  const b2 = two.x * -1 + three.x;
  const d2 = two.y * -1 + three.y;
  const bMult = (b2 / b1) * -1;
  const a3 = bMult * a1 + a2;
  const d3 = bMult * d1 + d2;
  const a = d3 / a3;
  const b = (d1 - a1 * a) / b1;
  const c = one.y - a * Math.pow(one.x, 2) - b * one.x;
  return { a, b, c };
};

/**
 * y=ax^2+bx+c
 */
export const parabola = (a, b, c) => x => a * Math.pow(x, 2) + b * x + c;

/**
 * Generate a set of data points, add spacing before min and after max if there is space between minx + min and maxX and max
 * @param {*} min
 * @param {*} max
 * @param {*} root
 * @param {*} edge
 * @param {*} interval
 * @param {*} yFn
 */
export const buildDataPoints = (min, max, root, edge, interval, yFn) => {
  log('[buildDataPoints] min:', min, 'max:', max, 'root:', root);
  edge = edge ? edge : { ...root };
  const minX = Math.min(root.x, edge.x);
  const maxX = Math.max(root.x, edge.x);
  const leftSpace = min - minX;
  const rightSpace = max - maxX;
  console.log(minX, interval);
  const xs = xPoints(minX, interval, min - rightSpace, max - leftSpace);
  log('[buildDataPoints]:xs:', xs);
  return xs.map(v => new Point(v, yFn(v)));
};
