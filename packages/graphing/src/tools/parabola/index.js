import Parabola from './component';
import debug from 'debug';
import { equalPoints, sameAxes } from '../../utils';

const log = debug('pie-lib:graphing:parabola');

export const tool = () => ({
  type: 'parabola',
  Component: Parabola,
  complete: (data, mark) => ({ ...mark, building: false, closed: true }),
  addPoint: (point, mark) => {
    log('add point to parabola model: ', point, 'mark: ', mark);
    if (mark && (equalPoints(mark.root, point) || sameAxes(mark.root, point))) {
      return mark;
    }

    if (!mark) {
      return {
        type: 'parabola',
        root: point,
        edge: undefined,
        closed: false,
        building: true,
      };
    } else if (mark && !mark.root) {
      throw new Error('no root - should never happen');
    } else {
      return { ...mark, edge: point, closed: true, building: false };
    }
  },
});
