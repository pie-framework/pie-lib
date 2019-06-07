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
});
