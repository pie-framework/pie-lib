import * as utils from '../utils';

const xy = (x, y) => ({ x, y });

const tick = (isMajor, v) => ({
  major: isMajor,
  value: v,
  x: v
});

const major = tick.bind(null, true);
const minor = tick.bind(null, false);

describe('utils', () => {
  describe('polygonToArea', () => {
    const assertPolygon = (points, area) => {
      it(`converts ${points} -> ${area}`, () => {
        const result = utils.polygonToArea(points);
        expect(result).toEqual(area);
      });
    };
    assertPolygon([xy(0, 0), xy(1, 1), xy(1, -1)], {
      left: 0,
      top: 1,
      bottom: -1,
      right: 1
    });
    assertPolygon([xy(0, 0), xy(3, 0), xy(2, -1), xy(4, -3), xy(1, -4), xy(2, -2)], {
      left: 0,
      top: 0,
      bottom: -4,
      right: 4
    });
  });

  describe('lineToArea', () => {
    const assertLine = (from, to, expected) => {
      it(`${from},${to} => ${expected}`, () => {
        const result = utils.lineToArea(from, to);
        expect(result).toEqual(expected);
      });
    };

    assertLine(xy(1, 1), xy(2, 2), { left: 1, top: 2, bottom: 1, right: 2 });
    assertLine(xy(-1, 4), xy(4, -3), {
      left: -1,
      top: 4,
      bottom: -3,
      right: 4
    });
  });

  describe('getTickValues', () => {
    const assertGetTickValues = (props, expected) => {
      it(` => ${expected}`, () => {
        const result = utils.getTickValues(props);
        expect(result).toEqual(expected);
      });
    };

    assertGetTickValues({ min: 0, max: 10, step: 1 }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    assertGetTickValues({ min: 0, max: 3, step: 0.5 }, [0, 0.5, 1, 1.5, 2, 2.5, 3]);
    assertGetTickValues({ min: -0.2, max: 2, step: 0.6 }, [0, 0.6, 1.2, 1.8]);
    assertGetTickValues({ min: -3.4, max: 6.2, step: 1.2 }, [0, -1.2, -2.4, 1.2, 2.4, 3.6, 4.8, 6]);

    assertGetTickValues({ min: 0.6, max: 4.8, step: 0.3 }, [
      0.6,
      0.9,
      1.2,
      1.5,
      1.8,
      2.1,
      2.4,
      2.7,
      3.0,
      3.3,
      3.6,
      3.9,
      4.2,
      4.5,
      4.8
    ]);
    assertGetTickValues({ min: 0.5, max: 4.9, step: 0.3 }, [
      0.6,
      0.9,
      1.2,
      1.5,
      1.8,
      2.1,
      2.4,
      2.7,
      3.0,
      3.3,
      3.6,
      3.9,
      4.2,
      4.5,
      4.8
    ]);
  });
});
