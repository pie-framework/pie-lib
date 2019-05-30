import Sine from './component';
import isEqual from 'lodash/isEqual';
import debug from 'debug';
const log = debug('pie-lib:graphing:sine');

export const addPointToArray = (point, arr) => {
  arr = arr || [];

  if (arr.length === 0) {
    return { points: [point], closed: false };
  } else if (arr.length === 1) {
    if (isEqual(point, arr[0])) {
      return { points: arr, closed: false };
    } else {
      return { points: [...arr, point], closed: false };
    }
  } else if (arr.length >= 2) {
    const closed = isEqual(point, arr[0]);
    if (closed) {
      return { points: arr, closed };
    } else {
      const hasPoint = !!arr.find(p => isEqual(p, point));
      if (hasPoint) {
        return { points: arr, closed: false };
      } else {
        return { points: [...arr, point], closed: false };
      }
    }
  }
};

export const tool = () => ({
  type: 'sine',
  Component: Sine,
  complete: (data, mark) => {
    return { ...mark, building: false, closed: true };
  },
  addPoint: (point, mark) => {
    log('add point to sine model: ', point, 'mark: ', mark);
    if (!mark) {
      return {
        type: 'sine',
        root: point,
        edge: undefined,
        closed: false,
        building: true
      };
    } else if (mark && !mark.root) {
      throw new Error('no root - should never happen');
    } else {
      return { ...mark, edge: point, closed: true, building: false };
    }
  },
  addLabel: point => ({
    ...point,
    showLabel: true
  })
});
