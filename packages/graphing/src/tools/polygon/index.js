import Polygon from './component';
import { equalPoints } from '../../utils';

export const addPointToArray = (point, arr) => {
  arr = arr || [];

  if (arr.length === 0) {
    return { points: [point], closed: false };
  } else if (arr.length === 1) {
    if (equalPoints(point, arr[0])) {
      return { points: arr, closed: false };
    } else {
      return { points: [...arr, point], closed: false };
    }
  } else if (arr.length >= 2) {
    const closed = equalPoints(point, arr[0]);

    if (closed) {
      return { points: arr, closed };
    } else {
      const hasPoint = !!arr.find(p => equalPoints(p, point));

      if (hasPoint) {
        return { points: arr, closed: false };
      } else {
        return { points: [...arr, point], closed: false };
      }
    }
  }
};

export const tool = () => ({
  type: 'polygon',
  Component: Polygon,
  complete: (data, mark) => {
    return { ...mark, building: false, closed: true };
  },
  addPoint: (point, mark) => {
    if (!mark) {
      return {
        type: 'polygon',
        points: [point],
        closed: false,
        building: true
      };
    } else {
      const { closed, points } = addPointToArray(point, mark.points);

      return { ...mark, closed, points, building: !closed };
    }
  }
});
