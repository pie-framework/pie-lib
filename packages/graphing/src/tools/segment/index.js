import Segment from './component';
import _ from 'lodash';

export const tool = () => ({
  type: 'segment',
  Component: Segment,
  addPoint: (point, mark) => {
    if (!mark) {
      return {
        type: 'segment',
        building: true,
        firstEnd: point
      };
    }

    if (_.isEqual(point, mark.firstEnd)) {
      return { ...mark };
    }

    return { ...mark, building: false, secondEnd: point };
  }
});
