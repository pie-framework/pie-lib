import Point from './component';

export const tool = opts => ({
  label: 'Point',
  type: 'point',
  Component: Point,
  addPoint: point => ({
    type: 'point',
    ...point
  })
});
