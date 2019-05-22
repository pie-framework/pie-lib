import { xPoints, sinY } from '../utils';

describe('utils', () => {
  describe('xPoints', () => {
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

  describe('sinY', () => {
    const assertSin = (amp, freq) => (x, expected) => {
      it(`amp: ${amp}, freq: ${freq}, x: ${x} == ${expected}`, () => {
        const result = sinY(amp, freq)(x);
        expect(result === 0 ? Math.abs(0) : result).toEqual(expected);
      });
    };
    const assertOneOne = assertSin(1, 4);

    assertOneOne(-4, 0);
    assertOneOne(-3, 1);
    assertOneOne(-2, 0);
    assertOneOne(-1, -1);
    assertOneOne(0, 0);
    assertOneOne(1, 1);
    assertOneOne(2, 0);
    assertOneOne(3, -1);
    assertOneOne(4, 0);
  });
});
