import _ from 'lodash';
import debug from 'debug';
import Point from '@mapbox/point-geometry';
const log = debug('pie-lib:graphing:sine:utils');

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

export const buildDataPoints = (min, max, root, edge, interval, yFn) => {
  log('[buildDataPoints] min:', min, 'max:', max, 'root:', root);
  edge = edge ? edge : { ...root };
  const minX = Math.min(root.x, edge.x);
  const maxX = Math.max(root.x, edge.x);
  const leftSpace = min - minX;
  const rightSpace = max - maxX;
  const xs = xPoints(minX, interval, min - rightSpace, max - leftSpace);
  return xs.map(v => new Point(v, yFn(v)));
};
