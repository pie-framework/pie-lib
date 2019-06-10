import Sine from './component';
import isEqual from 'lodash/isEqual';
import debug from 'debug';
const log = debug('pie-lib:graphing:sine');

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
  }
});
