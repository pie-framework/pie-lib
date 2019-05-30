import Circle from './component';

export const tool = opts => ({
  type: 'circle',
  Component: Circle,
  hover: (point, mark) => {
    return { ...mark, outerPoint: point };
  },
  addPoint: (point, mark) => {
    if (!mark) {
      return {
        type: 'circle',
        center: point,
        building: true
      };
    } else {
      return { ...mark, outerPoint: point, building: false };
    }
  },
  addLabel: point => ({
    ...point,
    showLabel: true
  })
});
