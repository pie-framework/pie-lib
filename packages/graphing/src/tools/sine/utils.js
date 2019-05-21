import _ from 'lodash';

/** build the x points with root as the anchor
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
