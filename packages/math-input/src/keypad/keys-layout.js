import { times, zip } from 'lodash-es';

/**
 * Sort additional keys.
 *
 * Expects an array of rows.
 * @param {} keys
 */
export const sortKeys = (keys) => {
  // add any missing rows
  times(5 - keys.length, () => keys.push([]));

  const out = zip.apply(null, keys);

  return out;
};
