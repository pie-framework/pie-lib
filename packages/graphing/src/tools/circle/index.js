import Circle from './component';

export const tool = opts => ({
  type: 'circle',
  Component: Circle,
  hover: (point, mark) => {
    return { ...mark, edge: point };
  },
  addPoint: (point, mark) => {
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
