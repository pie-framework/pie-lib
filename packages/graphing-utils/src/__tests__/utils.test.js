import {
  xPoints,
  sinY,
  buildDataPoints,
  pointsToABC,
  parabola,
  parabolaFromTwoPoints
} from '../index';
import { utils } from '@pie-lib/plot';

import _ from 'lodash';
const { xy } = utils;

describe('utils', () => {
  describe('xPoints', () => {
    const assertXPoints = (root, freq, min, max, expected) => {
      it(`root: ${root}, freq: ${freq}, domain: ${min}<->${max} => ${expected}`, () => {
        const result = xPoints(root, freq, min, max);
        expect(result).toEqual(expected);
      });
    };
    assertXPoints(0, 2, -5, 5, [-6, -4, -2, 0, 2, 4, 6]);
    assertXPoints(2, 2, -5, 5, [-6, -4, -2, 0, 2, 4, 6]);
    assertXPoints(3, 2, -5, 5, [-5, -3, -1, 1, 3, 5]);
    assertXPoints(3, 2, 0, 10, [-1, 1, 3, 5, 7, 9, 11]);
    assertXPoints(-2, 2, -10, -1, [-10, -8, -6, -4, -2, 0]);
  });

  describe('sinY', () => {
    const assertSin = (amp, freq, shift) => (input, expected) => {
      const p = shift ? shift.phase : 0;
      const v = shift ? shift.vertical : 0;
      it(` sin of ${input} (>${p} ^${v}) = ${expected}`, () => {
        const fn = sinY(amp, freq, shift);
        const result = Array.isArray(input) ? input.map(x => fn(x)) : fn(input);
        expect(result).toEqual(expected);
      });
    };
    const shift = (phase, vertical) => ({ phase, vertical });
    const rng = (start, end, step) => _.range(start, end + step, step);

    describe('amp: 1, freq: 1', () => {
      assertSin(1, 1, shift(0, 0))(0, 0);
      assertSin(1, 1, shift(0, 0))(0.25, 1);
      assertSin(1, 1, shift(0, 0))(0.5, 0);
      assertSin(1, 1, shift(0, 0))(0.75, -1);
      assertSin(1, 1, shift(0, 0))(rng(0, 1, 0.25), [0, 1, 0, -1, 0]);
    });

    describe('amp: 1, freq: 4', () => {
      assertSin(1, 4, shift(0, 0))(rng(-4, 4, 1), [0, 1, 0, -1, 0, 1, 0, -1, 0]);
      assertSin(1, 4, shift(0, 0))(rng(-1, 1, 1), [-1, 0, 1]);
      assertSin(1, 4, shift(1, 0))(rng(-1, 1, 1), [0, -1, 0]);
      assertSin(1, 4, shift(-1, 0))(rng(-1, 1, 1), [0, 1, 0]);
      assertSin(1, 4, shift(0, 1))(rng(-1, 1, 1), [0, 1, 2]);
    });
  });

  describe('buildDataPoints', () => {
    it('generates points', () => {
      const result = buildDataPoints(-1, 1, { x: 0, y: 0 }, { x: 0, y: 0 }, 1, x => x);
      expect(result.map(p => p.x)).toEqual([-2, -1, 0, 1, 2]);
    });
  });

  describe('pointsToABC', () => {
    const assertPointsToABC = (one, two, three, a, b, c) => {
      it(`${one}, ${two}, ${three} => ${a}, ${b}, ${c}`, () => {
        const result = pointsToABC(one, two, three);
        expect(result.a).toBeCloseTo(a);
        expect(result.b).toBeCloseTo(b);
        expect(result.c).toBeCloseTo(c);
      });
    };

    assertPointsToABC(xy(0, 0), xy(1, 1), xy(-1, 1), 1, 0, 0);
    assertPointsToABC(xy(0, 0), xy(2, 1), xy(-2, 1), 0.25, 0, 0);
    assertPointsToABC(xy(1, 0), xy(2, 1), xy(0, 1), 1, -2, 1);
    assertPointsToABC(xy(1, 0), xy(4, 1), xy(-2, 1), 0.11111, -0.22222, 0.11111);
    assertPointsToABC(xy(0, 0), xy(1, 2), xy(-1, 2), 2, 0, 0);
  });

  describe('parabolaFromTwoPoints', () => {
    describe('0,0 -> 1,2', () => {
      const yVal = parabolaFromTwoPoints(xy(0, 0), xy(1, 1));
      it('for x = 0, returns 0', () => expect(yVal(0)).toEqual(0));
      it('for x = 1, returns 1', () => expect(yVal(1)).toEqual(1));
    });
    describe('0,0 -> 1,2', () => {
      const yVal = parabolaFromTwoPoints(xy(0, 0), xy(1, 2));
      it('for x = 0, returns 0', () => expect(yVal(0)).toEqual(0));
      it('for x = 1, returns 2', () => expect(yVal(1)).toEqual(2));
    });
  });

  describe('parabola', () => {
    it('works', () => {
      const fn = parabola(0.22222, -0.444444, 0.22222);
      expect(fn(0)).toBeCloseTo(0.222222);
    });
  });
});
