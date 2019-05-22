import _ from 'lodash';
import debug from 'debug';
import Point from '@mapbox/point-geometry';
const log = debug('pie-lib:graphing;sine:utils');

/**
 * build the x points with root as the anchor.
 * adds padding left and right so that
 * the anchor can be moved left/right
 * and there will be points off stage rendering.
 *
 *  root: 0, freq: 2, min: -5, max: 5 ==> -5,-4-2,0,2,4,5
 */
export const xPoints = (root, freq, min, max) => {
  return _.concat(
    min - freq,
    _.rangeRight(root, min - freq, freq * -1),
    _.range(root + freq, max + freq, freq),
    max + freq
  );
};

export const sinY = (amplitude, freq) => x => {
  const num = 2 * Math.PI * x;
  const frac = num / freq;
  return amplitude * parseFloat(Math.sin(frac).toFixed(10));
};

export const buildDataPoints = (min, max, root, interval, yFn) => {
  log('[buildDataPoints] min:', min, 'max:', max, 'root:', root);
  // const fn = sinY(amplitude, freq);
  const diff = max - root.x;
  const plusDiff = min - root.x;
  const xs = xPoints(0, interval, min - root.x - diff, max - root.x - plusDiff);
  log('xs:', xs);
  return xs.map(v => new Point(v, yFn(v))).map(p => p.add(new Point(root.x, root.y)));
};
