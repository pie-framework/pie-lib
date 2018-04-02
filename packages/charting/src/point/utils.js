import debug from 'debug';
import omitBy from 'lodash/omitBy';
import isUndefined from 'lodash/isUndefined';

const log = debug('pie-lib:charting:point:utils');

/**
 * Get the index of the point in the points array
 * @param {Point[]} points
 * @param {Point} p
 */
export const pointIndex = (points, p) => {
  return (points || []).findIndex(s => {
    return s.x === p.x && s.y === p.y;
  });
};

export const hasPoint = (points, p) => pointIndex(points, p) !== -1;

export const trim = point => ({
  x: point.x,
  y: point.y,
  label: point.label
});

export const removePoints = (points, toRemove) => {
  log('[removePoints] points: ', points, toRemove);
  toRemove = Array.isArray(toRemove) ? toRemove : [toRemove];

  const out = points.filter(p => !hasPoint(toRemove, p));

  log('[removePoints] points: ', out);
  return out;
};

export const firstAvailableLabel = (points, labels) => {
  const existing = points.map(p => p.label);
  log('points: ', points);
  const filtered = labels.filter(l => !existing.some(e => e === l));
  log('existing: ', existing, 'filtered: ', filtered);
  return filtered.length > 0 ? filtered[0] : '';
};

export const addPoint = (points, p, labels) => {
  labels = labels || [];
  if (!hasPoint(points, p)) {
    const out = points.slice();
    const label = firstAvailableLabel(points, labels);
    out.push(Object.assign({}, p, { label }));
    return out;
  } else {
    return points;
  }
};

export const bounds = (p, domain, range) => {
  return {
    left: domain.min - p.x,
    right: Math.abs(p.x - domain.max),
    top: Math.abs(p.y - range.max),
    bottom: range.min - p.y
  };
};

export const swap = (arr, from, to, getIndex) => {
  log('[swap] arr: ', arr, 'from: ', from, 'to: ', to);

  const toIndex = getIndex(arr, to);

  log('[swap] toIndex: ', toIndex);

  if (toIndex !== -1) {
    //prevent moving one point on top of another.
    return arr;
  }

  const fromIndex = getIndex(arr, from);

  log('[swap] fromIndex: ', fromIndex);

  if (fromIndex === -1) {
    //cant move a point that isn't in the points array
    return arr;
  }

  const f = arr[fromIndex];
  const replacement = Object.assign({}, f, omitBy(to, isUndefined));
  const out = arr.slice();
  out.splice(fromIndex, 1, replacement); //{ ...to, label: f.label });
  return out;
};

/**
 * swap a point 'from', with point 'to'.
 * Finds the point in the array and updates it to equal the 'to' point.
 * @param {Point[]} points
 * @param {Point} from
 * @param {Point} to
 */

export const swapPoint = (points, from, to) => {
  return swap(points, from, to, pointIndex);
};
