import {
  xPoints,
  sinY,
  buildDataPoints,
  pointsToABC,
  parabola,
  parabolaFromTwoPoints,
  getAmplitudeAndFreq,
  parabolaFromThreePoints,
  pointsToAForAbsolute,
  absolute,
  absoluteFromTwoPoints,
  pointsToABForExponential,
  exponential,
  exponentialFromTwoPoints,
} from '../index';

import _ from 'lodash';

const xy = (x, y) => ({ x, y });

describe('utils', () => {
  describe('getAmplitudeAndFreq', () => {
    it('calculates amplitude and frequency from root and edge points', () => {
      const root = { x: 0, y: 0 };
      const edge = { x: 1, y: 2 };
      const result = getAmplitudeAndFreq(root, edge);

      expect(result.freq).toBe(4);
      expect(result.amplitude).toBe(2);
    });
  });

  describe('sinY', () => {
    const assertSin = (amp, freq, shift) => (input, expected) => {
      const p = shift ? shift.phase : 0;
      const v = shift ? shift.vertical : 0;
      it(` sin of ${input} (>${p} ^${v}) = ${expected}`, () => {
        const fn = sinY(amp, freq, shift);
        const result = Array.isArray(input) ? input.map((x) => fn(x)) : fn(input);
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
      const result = buildDataPoints(
        { min: -1, max: 1, step: 1 },
        { min: -1, max: 1, step: 1 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        (x) => x,
      );
      expect(result.map((p) => p.x)).toEqual([-2, -1, 0, 1, 2]);
    });

    const assertParabola = (
      domain,
      range,
      root,
      edge,
      mirror,
      existingPoint1,
      existingPoint2,
      nonExistingPointOutsideRange,
    ) => {
      it('generates points for parabola', () => {
        const result = buildDataPoints(domain, range, root, edge, parabolaFromTwoPoints(root, edge));

        expect(result).toContainEqual(root);
        expect(result).toContainEqual(edge);
        expect(result).toContainEqual(mirror);
        expect(result).toContainEqual(existingPoint1);
        expect(result).toContainEqual(existingPoint2);
        expect(result).not.toContainEqual(nonExistingPointOutsideRange);
      });
    };

    // a * x^2 + b * x + c

    // a = 8, b = 4, c = 2
    assertParabola(
      { min: -1, max: 1, step: 0.25 },
      { min: -1, max: -1, step: 1 },
      { x: -0.25, y: 1.5 },
      { x: 0.25, y: 3.5 },
      { x: -0.75, y: 3.5 },
      { x: -1, y: 6 },
      { x: 1, y: 14 },
      { x: 1.25, y: -19.5 },
    );

    // a = -8, b = -4, c = -2
    assertParabola(
      { min: -1, max: 1, step: 0.25 },
      { min: -1, max: -1, step: 1 },
      { x: -0.25, y: -1.5 },
      { x: 0.25, y: -3.5 },
      { x: -0.75, y: -3.5 },
      { x: -1, y: -6 },
      { x: 1, y: -14 },
      { x: 1.25, y: 19.5 },
    );

    // a = 10, b = 0, c = -2
    assertParabola(
      { min: -1, max: 1, step: 0.25 },
      { min: -1, max: -1, step: 1 },
      { x: 0, y: -2 },
      { x: 0.5, y: 0.5 },
      { x: -0.5, y: 0.5 },
      { x: -1, y: 8 },
      { x: 1, y: 8 },
      { x: 3, y: 88 },
    );

    // a = 10, b = -10, c = 0
    assertParabola(
      { min: -1, max: 1, step: 0.25 },
      { min: -1, max: -1, step: 1 },
      { x: 0.5, y: -2.5 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 20 },
      { x: 1.25, y: 3.125 },
      { x: 3, y: 60 },
    );

    // a = 10, b = -10, c = 0
    assertParabola(
      { min: -1, max: 1, step: 0.5 },
      { min: -1, max: -1, step: 1 },
      { x: 0.5, y: -2.5 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 20 },
      { x: 1.5, y: 7.5 },
      { x: 3, y: 60 },
    );

    // a = -4, b = 4, c = 0
    assertParabola(
      { min: -1, max: 5, step: 0.25 },
      { min: -1, max: -1, step: 1 },
      { x: 0.5, y: 1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -0.5, y: -3 },
      { x: 1.5, y: -3 },
      { x: 3, y: 60 },
    );
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

  describe('parabolaFromThreePoints', () => {
    it('generates parabola function from three points', () => {
      const one = xy(0, 0);
      const two = xy(1, 1);
      const three = xy(-1, 1);
      const fn = parabolaFromThreePoints(one, two, three);

      expect(fn(0)).toBeCloseTo(0);
      expect(fn(1)).toBeCloseTo(1);
      expect(fn(-1)).toBeCloseTo(1);
    });
  });

  describe('parabola', () => {
    it('works', () => {
      const fn = parabola(0.22222, -0.444444, 0.22222);
      expect(fn(0)).toBeCloseTo(0.222222);
    });
  });

  describe('pointsToAForAbsolute', () => {
    it('calculates a coefficient for absolute value function', () => {
      const one = xy(0, 0);
      const two = xy(2, 4);
      const result = pointsToAForAbsolute(one, two);

      expect(result).toBe(2);
    });
  });

  describe('absolute', () => {
    it('generates absolute value function y=a*abs(x-h)+k', () => {
      const fn = absolute(2, 1, 3);

      expect(fn(1)).toBe(3); // vertex
      expect(fn(2)).toBe(5); // right side
      expect(fn(0)).toBe(5); // left side
    });
  });

  describe('absoluteFromTwoPoints', () => {
    it('generates absolute value function from two points', () => {
      const root = xy(0, 0);
      const edge = xy(1, 2);
      const fn = absoluteFromTwoPoints(root, edge);

      expect(fn(0)).toBe(0);
      expect(fn(1)).toBe(2);
    });
  });

  describe('pointsToABForExponential', () => {
    it('calculates a and b coefficients for exponential function', () => {
      const one = xy(0, 2);
      const two = xy(1, 4);
      const result = pointsToABForExponential(one, two);

      expect(result.a).toBeCloseTo(2);
      expect(result.b).toBeCloseTo(2);
    });
  });

  describe('exponential', () => {
    it('generates exponential function y=a*(b)^x', () => {
      const fn = exponential(2, 3);

      expect(fn(0)).toBe(2);
      expect(fn(1)).toBe(6);
      expect(fn(2)).toBe(18);
    });
  });

  describe('exponentialFromTwoPoints', () => {
    it('generates exponential function from two points', () => {
      const root = xy(0, 2);
      const edge = xy(1, 6);
      const fn = exponentialFromTwoPoints(root, edge);

      expect(fn(0)).toBeCloseTo(2);
      expect(fn(1)).toBeCloseTo(6);
    });
  });

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
});
