import _ from 'lodash';
import debug from 'debug';
import Point from '@mapbox/point-geometry';
const log = debug('pie-lib:graphing:sine:utils');

/**
 * build the x points with root as the anchor.
 * adds padding left and right so that
 * the anchor can be moved left/right
 * and there will be points off stage rendering.
 *
 *  root: 0, freq: 2, min: -5, max: 5 ==> -5,-4-2,0,2,4,5
 */
export const xPoints = (root, freq, min, max) => {
  freq = Math.abs(freq);
  log('[xPoints] root:', root, 'freq:', freq, ' min:', min, ' max:', max);
  const leftpoints = _.rangeRight(root, min - freq, freq * -1);
  const rightpoints = _.range(root + freq, max + freq, freq);

  return _.concat(leftpoints, rightpoints);
};

/**
 * \(a\ \sin\left(\frac{2\pi\left(x\ \ +\ c\right)}{b}\right)\ +\ p\)
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

export const buildDataPoints = (min, max, root, edge, interval, yFn) => {
  log('[buildDataPoints] min:', min, 'max:', max, 'root:', root);
  // const fn = sinY(amplitude, freq);
  const diff = max - root.x;
  const plusDiff = min - root.x;

  const minX = Math.min(root.x, edge.x);
  const maxX = Math.max(root.x, edge.x);

  // -2 - 0 = 0
  // -4 + 2 = -2
  //  1 - 1 = 0
  //  1 - 3 = -2
  const leftSpace = min - minX;
  const rightSpace = max - maxX;
  log('min', minX, 'max:', maxX, 'leftSpace: ', leftSpace, 'rightSpace:', rightSpace);
  const xs = xPoints(minX, interval, min - rightSpace, max - leftSpace);
  log('xs:', xs);
  return xs.map(v => new Point(v, yFn(v))); //.map(p => p.add(new Point(root.x, root.y)));
};
