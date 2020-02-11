import Circle from './component';
import isEqual from 'lodash/isEqual';

export const tool = () => ({
  type: 'circle',
  Component: Circle,
  hover: (point, mark) => {
    return { ...mark, edge: point };
  },
  addPoint: (point, mark) => {
    if (mark && isEqual(mark.root, point)) {
      return mark;
    }

    if (!mark) {
      return {
        type: 'circle',
        root: point,
        building: true
      };
    } else {
      return { ...mark, edge: point, building: false };
    }
  }
});
