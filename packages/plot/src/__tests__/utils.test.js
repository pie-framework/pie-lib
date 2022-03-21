import { AssertionError } from 'assert';
import * as utils from '../utils';

const xy = utils.xy;

const tick = (isMajor, v) => ({
  major: isMajor,
  value: v,
  x: v
});

const major = tick.bind(null, true);
const minor = tick.bind(null, false);

describe('utils', () => {
  describe('getDelta', () => {
    const assertDelta = (from, to, delta) => {
      it(`returns a delta of: ${delta} for ${from} -> ${to}`, () => {
        const d = utils.getDelta(from, to);
        expect(d.x).toEqual(delta.x);
        expect(d.y).toEqual(delta.y);
      });
    };
    assertDelta(xy(0, 0), xy(0, 1), xy(0, 1));
    assertDelta(xy(0, 1), xy(0, 0), xy(0, -1));
    assertDelta(xy(1, 1), xy(3, 3), xy(2, 2));
    assertDelta(xy(-1, -1), xy(3, 3), xy(4, 4));
    assertDelta(xy(-1, -1), xy(-2, -5), xy(-1, -4));
  });

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

  describe('buildTickModel', () => {
    let scaleFn;

    beforeEach(() => {
      scaleFn = jest.fn(function(v) {
        return v;
      });
    });

    it('builds major only ticks', () => {
      let result = utils.buildTickModel({ min: 0, max: 2 }, { minor: 0 }, 1, scaleFn);
      expect(result).toEqual([major(0), major(1), major(2)]);
    });

    it('builds minor + major ticks', () => {
      let result = utils.buildTickModel({ min: 0, max: 2 }, { minor: 1 }, 0.5, scaleFn);
      expect(result).toEqual([major(0), minor(0.5), major(1), minor(1.5), major(2)]);
    });
  });

  describe('snapTo', () => {
    let assertSnapTo = (min, max, interval, value, expected) => {
      it(`snaps ${value} to ${expected} with domain ${min}<->${max} with interval: ${interval} `, () => {
        let result = utils.snapTo(min, max, interval, value);
        expect(result).toEqual(expected);
      });
    };

    describe('with 0, 10, 0.25', () => {
      let a = assertSnapTo.bind(null, 0, 10, 0.25);
      a(1, 1);
      a(1.2, 1.25);
      a(0.2, 0.25);
      a(5.2, 5.25);
      a(5.125, 5.25);
      a(5.124, 5);
    });

    describe('with 0, 10, 1', () => {
      let a = assertSnapTo.bind(null, 0, 10, 1);
      a(0, 0);
      a(10, 10);
      a(100, 10);
      a(1, 1);
      a(1.2, 1);
      a(0.2, 0);
      a(5.2, 5);
      a(5.001, 5);
    });
  });

  describe('getInterval', () => {
    let assertGetInterval = (min, max, ticks, expected) => {
      let paramsDescription = JSON.stringify(ticks);
      it(`converts: ${paramsDescription} to ${JSON.stringify(expected)}`, () => {
        let result = utils.getInterval({ min: min, max: max }, ticks);
        expect(result).toEqual(expected);
      });
    };

    describe('with bad params', () => {
      it('throws an error if min > max', () => {
        expect(() => {
          let result = utils.convertFrequencyToInterval(
            { min: 11, max: 10, tickFrequency: 1, betweenTickCount: 0 },
            { interval: 10, major: 10 }
          );
          console.log('result: ', result);
        }).toThrow(Error);
      });

      it('throws an error if min = max', () => {
        expect(() => {
          let result = utils.convertFrequencyToInterval(
            { min: 10, max: 10, tickFrequency: 1, betweenTickCount: 0 },
            { interval: 10, major: 10 }
          );
          console.log('result: ', result);
        }).toThrow(Error);
      });
    });

    describe('with domain 0 -> 1', () => {
      let a = assertGetInterval.bind(null, 0, 1);
      a({ major: 2, minor: 0 }, 1);
      a({ major: 2, minor: 1 }, 0.5);
    });

    describe('with domain 0 -> 10', () => {
      let a = assertGetInterval.bind(null, 0, 10);

      it('throws an error if the tick frequency is less than 2', () => {
        expect(() => {
          let result = utils.convertFrequencyToInterval(
            { min: 0, max: 10, tickFrequency: 1, betweenTickCount: 0 },
            { interval: 10, major: 10 }
          );
          console.log('result: ', result);
        }).toThrow(Error);
      });

      a({ major: 2, minor: 9 }, 1);
      a({ major: 2, minor: 0 }, 10);
      a({ major: 3, minor: 0 }, 5);
      a({ major: 3, minor: 1 }, 2.5);
      a({ major: 4, minor: 0 }, 3.3333);
      a({ major: 5, minor: 0 }, 2.5);
      a({ major: 6, minor: 0 }, 2);
      a({ major: 7, minor: 0 }, 1.6667);
      a({ major: 8, minor: 0 }, 1.4286);
      a({ major: 9, minor: 0 }, 1.25);
      a({ major: 10, minor: 0 }, 1.1111);
      a({ major: 11, minor: 0 }, 1);
      a({ major: 11, minor: 1 }, 0.5);
      a({ major: 11, minor: 2 }, 0.3333);
    });

    describe('with domain 0 -> 100', () => {
      let a = assertGetInterval.bind(null, 0, 100);
      a({ major: 11, minor: 1 }, 5);
      a({ major: 101, minor: 0 }, 1);
    });

    describe('with domain -5 - 5', () => {
      let a = assertGetInterval.bind(null, -5, 5);
      a({ major: 11, minor: 0 }, 1);
    });

    describe('with domain 0 - 5', () => {
      let a = assertGetInterval.bind(null, 0, 5);
      a({ major: 11, minor: 0 }, 0.5);
      a({ major: 11, minor: 2 }, 0.1667);
      a({ major: 11, minor: 1 }, 0.25);
    });
  });

  describe('findLongestWord', () => {
    it('should return 0 if label is undefined', () => {
      const label = undefined;
      const result = utils.findLongestWord(label);

      expect(result).toEqual(0);
    });

    it('should return 0 if label is null', () => {
      const label = null;
      const result = utils.findLongestWord(label);

      expect(result).toEqual(0);
    });

    it('should return 6 if the longest word from label has 6 letters', () => {
      const label = 'Number of months';
      const result = utils.findLongestWord(label);

      expect(result).toEqual(6);
    });
  });

  describe('amountToIncreaseWidth', () => {
    it('should return 0 if longestWord is undefined', () => {
      const longestWord = undefined;
      const result = utils.amountToIncreaseWidth(longestWord);

      expect(result).toEqual(0);
    });

    it('should return 0 if longestWord is null', () => {
      const longestWord = null;
      const result = utils.amountToIncreaseWidth(longestWord);

      expect(result).toEqual(0);
    });

    it('should return 150 if longestWord is 10', () => {
      const longestWord = 10;
      const result = utils.amountToIncreaseWidth(longestWord);

      expect(result).toEqual(200);
    });
  });
});
