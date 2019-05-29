import { AssertionError } from 'assert';
import * as utils from '../utils';

const xy = (x, y) => ({ x, y });

const tick = (isMajor, v) => ({
  major: isMajor,
  value: v,
  x: v
});

const obj = (strings, ...values) => {
  return strings.reduce();
};

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

  describe('getAngleDeg', () => {
    const assertAngle = (ax, ay, bx, by, angle) => {
      it(`${ax},${ay}  ${bx},${by} => ${angle}`, () => {
        const result = utils.getAngleDeg(ax, ay, bx, by);

        expect(result).toEqual(angle);
      });
    };

    assertAngle(0, 0, 1, 1, 45);
    assertAngle(0, 0, 0, 1, 0);
    assertAngle(0, 0, 0, -1, 180);
    assertAngle(1, 1, -8, 10, 315);
  });

  describe.only('edge', () => {
    const assertEdge = (domain, range) => (from, to, expected) => {
      it(obj`${from}, ${to} => ${expected}`, () => {
        const result = utils.edge(domain, range)(from, to);
        expect(result).toEqual(expected);
      });
    };
    const basic = assertEdge({ min: -10, max: 10 }, { min: -10, max: 10 });
    basic(xy(0, 0), xy(1, 1), xy(10, 10));
    // basic(xy(1, 1), xy(0, 0), xy(-10, -10));
  });

  describe('calculateThirdPointOnLine', () => {
    const assertThirdPoint = (a, b, graphProps, c) => {
      it(`${a.x},${a.y}  ${b.x},${b.y} => ${c.x},${c.y}`, () => {
        const result = utils.calculateThirdPointOnLine(a, b, graphProps);

        expect(result).toEqual(c);
      });
    };

    const graphProps = {
      domain: {
        min: -14,
        max: 10
      },
      range: {
        min: -14,
        max: 14
      }
    };

    assertThirdPoint({ x: 0, y: 0 }, { x: 1, y: 1 }, graphProps, { x: 10, y: 10 });
    assertThirdPoint({ x: 3, y: 3 }, { x: -3, y: 3 }, graphProps, { x: -14, y: 3 });
    assertThirdPoint({ x: 1, y: 2 }, { x: 3, y: 6 }, graphProps, { x: 7, y: 14 });
  });

  describe('calculatePreviousNearestScaledPoint', () => {
    const scale = {
      x: from => from * 100,
      y: from => from * 100
    };

    const assertCalculatePreviousNearestScaledPoint = (from, to, type, expected) => {
      it(`${from.x},${from.y}  ${to.x},${to.y} => scaled to ${expected.x},${expected.y}`, () => {
        const result = utils.calculatePreviousNearestScaledPoint(scale, from, to, type);

        expect(result).toEqual(expected);
      });
    };

    assertCalculatePreviousNearestScaledPoint({ x: 0, y: 0 }, { x: 1, y: 1 }, undefined, {
      x: 100,
      y: 100
    });
    assertCalculatePreviousNearestScaledPoint({ x: 0, y: 0 }, { x: 1, y: 1 }, 'vector', {
      x: 93,
      y: 93
    });
    assertCalculatePreviousNearestScaledPoint({ x: 0, y: 0 }, { x: 1, y: 1 }, 'ray', {
      x: 95,
      y: 95
    });
    assertCalculatePreviousNearestScaledPoint({ x: 0, y: 0 }, { x: 1, y: 1 }, 'line', {
      x: 95,
      y: 95
    });
    assertCalculatePreviousNearestScaledPoint({ x: 1, y: 1 }, { x: 0, y: 0 }, 'line', {
      x: 5,
      y: 5
    });
  });
});
