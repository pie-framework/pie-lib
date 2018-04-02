import { expression, point, pointsFromExpression } from '../utils';
import { s } from '../../__tests__/string-helper';
import debug from 'debug';

const log = debug('pie-lib:charting:test');

const assert = (from, to, multiplier, b) => {
  it(s`${from} -> ${to} == ${multiplier}x + ${b}`, () => {
    const result = expression(from, to);
    expect(result).toEqual({
      multiplier,
      b
    });
  });
};

describe('points', () => {
  const a = (expr, min, max) => {
    const points = pointsFromExpression(expr, min, max);
    log('points: ', JSON.stringify(points));
    const e = expression(points.from, points.to);
    it(s`${expr} -> ${min}/${max} -> ${e} `, () => {
      expect(e).toEqual(expr);
    });
  };

  a({ multiplier: 2, b: 5 }, 3, 4);
  a({ multiplier: 0.4, b: 5 }, -100, 4);
  a({ multiplier: -3, b: -2 }, -10, 4);
});

describe('expression', () => {
  assert(point(0, 0), point(1, 1), 1, 0);
  assert(point(0, 1), point(1, 2), 1, 1);
  assert(point(0, 2), point(1, 3), 1, 2);
  assert(point(1, 2), point(2, 3), 1, 1);
  assert(point(-1, 0), point(1, 2), 1, 1);
  assert(point(-10, -10), point(-9, -9), 1, 0);
  assert(point(-10, -9), point(-9, -8), 1, 1);
  assert(point(-2, -5), point(2, -1), 1, -3);
  assert(point(-2, -5), point(2, -3), 0.5, -4);
  assert(point(-5, -10), point(-1, -3), 1.75, -1.25);
});
