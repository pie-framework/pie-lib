import { xPoints, sinY, buildDataPoints } from '../utils';
import _ from 'lodash';
describe('utils', () => {
  describe.skip('xPoints', () => {
    const assertXPoints = (root, freq, min, max, expected) => {
      it(`root: ${root}, freq: ${freq}, domain: ${min}<->${max} => ${expected}`, () => {
        const result = xPoints(root, freq, min, max);
        expect(result).toEqual(expected);
      });
    };
    assertXPoints(0, 2, -5, 5, [-5, -4, -2, 0, 2, 4, 5]);
    // assertXPoints(2, 2, -5, 5, [-5, -4, -2, 0, 2, 4, 5]);
    // assertXPoints(3, 2, -5, 5, [-5, -3, -1, 1, 3, 5]);
    // assertXPoints(3, 2, 0, 10, [0, 1, 3, 5, 7, 9, 10]);
    // assertXPoints(-2, 2, -10, -1, [-10, -8, -6, -4, -2, -1]);
  });

  describe.only('sinY', () => {
    const assertSin = (amp, freq, shift) => (input, expected) => {
      it(` sin of ${input} = ${expected}`, () => {
        const fn = sinY(amp, freq, shift);
        const result = Array.isArray(input) ? input.map(x => fn(x)) : fn(input);
        // console.log('result:', result);
        expect(result).toEqual(expected);
      });
    };
    const shift = (phase, vertical) => ({ phase, vertical });
    const rng = (start, end, step) => _.range(start, end + step, step);

    describe('amp: 1, freq: 1', () => {
      //assertSin(1, 1, { phase: 0, vertical: 0 })(-1, 1, [-0.25, 0, 0.25]);
      assertSin(1, 1, shift(0, 0))(0, 0);
      assertSin(1, 1, shift(0, 0))(0.25, 1);
      assertSin(1, 1, shift(0, 0))(0.5, 0);
      assertSin(1, 1, shift(0, 0))(0.75, -1);
      assertSin(1, 1, shift(0, 0))(rng(0, 1, 0.25), [0, 1, 0, -1, 0]);
    });

    describe('amp: 1, freq: 4', () => {
      assertSin(1, 4, shift(0, 0))(rng(-4, 4, 1), [0, 1, 0, -1, 0, 1, 0, -1, 0]);
      assertSin(1, 4, shift(0, 0))(rng(-1, 1, 1), [-1, 0, 1]);
      assertSin(1, 4, shift(1, 0))(rng(-1, 1, 1), [0, 1, 0]);
      assertSin(1, 4, shift(-1, 0))(rng(-1, 1, 1), [0, -1, 0]);
      assertSin(1, 4, shift(0, 1))(rng(-1, 1, 1), [0, 1, 2]);
    });
    // assertSin(1, 4, { phase: 0, vertical: 0 })(-1, 1, [-1, 0, 1]);
    // assertSin(1, 4, { phase: 0, vertical: 1 })(-1, 1, [0, 1, 2]);
    // assertSin(1, 4, { phase: 0, vertical: 1 })(-2, 2, [1, 0, 1, 2, 1]);
    // assertSin(1, 4, { phase: 1, vertical: 0 })(-1, 1, [0, 1, 0]);
    // assertSin(1, 4, { phase: -1, vertical: 0 })(-1, 1, [0, -1, 0]);
    // assertSin(1, 4, { phase: 1, vertical: 0 })(-4, 4, [, 1, 0, -1, 0, 1, 0, -1, 0]);
  });

  describe.skip('buildDataPoints', () => {
    it('?', () => {
      const result = buildDataPoints(-1, 1, { x: 0, y: 0 }, 1, x => x);
      expect(result.map(p => p.x)).toEqual([-1, 0, 1]);
    });
  });
});

/**
 *
 *
 * -1   0    1
 * |----|-----|
 */
