import * as _ from 'lodash';
import debug from 'debug';

/**
 * Sort additional keys.
 *
 * Expects an array of rows.
 * @param {} keys
 */
export const sortKeys = keys => {
  // add any missing rows
  _.times(5 - keys.length, () => {
    keys.push([]);
  });

  const out = _.zip.apply(null, keys);
  return out;
};
