import {
  angle,
  edge,
  edges,
  maxEdge,
  minEdge,
  toRadians,
  toDegrees,
  acuteXAngle,
  acuteYAngle,
  diffEdge,
} from '../trig';
import { xy } from '../utils';
import debug from 'debug';
import { getOpposingSide } from '../../lib/trig';
const log = debug('pie-lib:plot:trig:test');

const vs = (v) => {
  if (!v) {
    return '';
  }

  if (Number.isFinite(v.x) && Number.isFinite(v.y)) {
    return `[${v.x},${v.y}]`;
  }
  return JSON.stringify(v);
};
const p = (strings, ...values) => {
  return strings.reduce((acc, s, index) => {
    return `${acc}${s}${vs(values[index])}`;
  }, '');
};
describe('trig', () => {
  describe('angle', () => {
    const assertAngle = (a, b, expected) => {
      it(p`${a}, ${b} => ${toDegrees(expected)}`, () => {
        const result = angle(a, b);
        expect(result).toBeCloseTo(expected);
      });
    };

    assertAngle(xy(0, 0), xy(1, 1), toRadians(45));
    assertAngle(xy(0, 0), xy(0, 1), toRadians(90));
    assertAngle(xy(0, 0), xy(-1, 1), toRadians(135));
    assertAngle(xy(0, 0), xy(-1, 0), toRadians(180));
    assertAngle(xy(0, 0), xy(-1, -1), toRadians(225));
    assertAngle(xy(0, 0), xy(0, -1), toRadians(270));
    assertAngle(xy(0, 0), xy(1, -1), toRadians(315));
    assertAngle(xy(1, 1), xy(0, 0), toRadians(225));
    assertAngle(xy(0, 0), xy(1, 1), toRadians(45));
    assertAngle(xy(0, 0), xy(2, 1), toRadians(26.565));
    assertAngle(xy(0, 0), xy(3, 1), toRadians(18.434));
    assertAngle(xy(0, 0), xy(4, 1), toRadians(14.036));
    assertAngle(xy(0, 0), xy(5, 1), toRadians(11.309));
  });

  describe('acuteXAngle', () => {
    const assertAcute = (input, expected) => {
      it(`${toDegrees(input)} => ${toDegrees(expected)}`, () => {
        const result = acuteXAngle(input);
        log(`result: ${toDegrees(result)}`);
        expect(result).toBeCloseTo(expected);
      });
    };

    assertAcute(toRadians(45), toRadians(45));
    assertAcute(toRadians(100), toRadians(80));
    assertAcute(toRadians(190), toRadians(10));
    assertAcute(toRadians(350), toRadians(10));
  });

  describe('acuteYAngle', () => {
    const assertAcute = (input, expected) => {
      it(`${toDegrees(input)} => ${toDegrees(expected)}`, () => {
        const result = acuteYAngle(input);
        log(`result: ${toDegrees(result)}`);
        expect(result).toBeCloseTo(expected);
      });
    };

    assertAcute(toRadians(45), toRadians(45));
    assertAcute(toRadians(100), toRadians(10));
    assertAcute(toRadians(190), toRadians(80));
    assertAcute(toRadians(350), toRadians(80));
  });

  describe('edges', () => {
    const assertEdges = (domain, range) => (from, to, expected) => {
      it(p`${domain}, ${range} + ${from} -> ${to} => ${expected[0]}${expected[1]}`, () => {
        const result = edges(domain, range)(from, to);
        expect(result[0].x).toBeCloseTo(expected[0].x);
        expect(result[0].y).toBeCloseTo(expected[0].y);
        expect(result[1].x).toBeCloseTo(expected[1].x);
        expect(result[1].y).toBeCloseTo(expected[1].y);
      });
    };

    const one = assertEdges({ min: -4, max: 4 }, { min: -4, max: 4 });
    one(xy(0, 0), xy(1, 1), [xy(4, 4), xy(-4, -4)]);
    one(xy(0, 0), xy(2, 1), [xy(4, 2), xy(-4, -2)]);
    one(xy(1, 1), xy(2, 2), [xy(4, 4), xy(-4, -4)]);
    one(xy(1, 0), xy(2, 0), [xy(4, 0), xy(-4, 0)]);
    one(xy(1, 0), xy(-2, 0), [xy(-4, 0), xy(4, 0)]);

    /**
     * domain {min: -5, max: 5, padding: 0, step: 1, labelStep: 1}labelStep: 1max: 5min: -5padding: 0step: 1__proto__: Object range:  {min: -5, max: 5, padding: 0, step: 1, labelStep: 1} a: {x: -5, y: 0} b: {x: -5, y: 2} edges: Point {x: -5, y: 5} Point {x: -5, y: 2}
     */
    const lineIssue = assertEdges({ min: -5, max: 5 }, { min: -5, max: 5 });
    lineIssue(xy(-5, -0), xy(-5, 2), [xy(-5, 5), xy(-5, -5)]);
  });

  describe('diffEdge', () => {
    const assertDiffEdge = (bounds, from, to, expected) => {
      it(p`<${bounds}> ${from} -> ${to} => ${expected}`, () => {
        const result = diffEdge(bounds, from, to);
        expect(result.x).toBeCloseTo(expected.x);
        expect(result.y).toBeCloseTo(expected.y);
      });
    };

    const twoTwo = assertDiffEdge.bind(null, xy(2, 2));
    twoTwo(xy(0, 0), xy(1, 1), xy(2, 2));
    twoTwo(xy(0, 0), xy(1, 2), xy(1, 2));
    twoTwo(xy(0, 0), xy(2, 2), xy(2, 2));
    twoTwo(xy(0, 0), xy(2, 2), xy(2, 2));
    twoTwo(xy(0, 0), xy(-1, 1), xy(-2, 2));
    twoTwo(xy(0, 0), xy(-1, -1), xy(-2, -2));
    const fourFour = assertDiffEdge.bind(null, xy(4, 4));

    fourFour(xy(0, 0), xy(1, 1), xy(4, 4));
    fourFour(xy(0, 0), xy(1, 2), xy(2, 4));
    fourFour(xy(0, 0), xy(2, 1), xy(4, 2));
    fourFour(xy(0, 0), xy(-1, 1), xy(-4, 4));
    fourFour(xy(0, 0), xy(-1, 1), xy(-4, 4));

    assertDiffEdge(xy(-4, -4), xy(0, 0), xy(-1, -1), xy(-4, -4));
    assertDiffEdge(xy(4, 4), xy(1, 1), xy(2, 2), xy(4, 4));
    assertDiffEdge(xy(4, 4), xy(2, 2), xy(3, 3), xy(4, 4));
    assertDiffEdge(xy(-4, -4), xy(-1, -1), xy(-2, -2), xy(-4, -4));
    assertDiffEdge(xy(-4, 4), xy(-1, -1), xy(-2, 0), xy(-4, 2));

    const lineIssue = assertDiffEdge.bind(null, xy(-5, -5));

    lineIssue(xy(-5, 2), xy(-5, 0), xy(-5, -5));
    //Top Right
    assertDiffEdge(xy(5, 5), xy(0, 5), xy(2, 5), xy(5, 5));
    assertDiffEdge(xy(5, 5), xy(5, 0), xy(5, 1), xy(5, 5));

    // //Bottom Right
    assertDiffEdge(xy(5, -5), xy(5, 0), xy(5, -0.1), xy(5, -5));
    assertDiffEdge(xy(5, -5), xy(0, -5), xy(1, -5), xy(5, -5));

    //Top Left
    assertDiffEdge(xy(-5, 5), xy(-5, 0), xy(-5, 0.1), xy(-5, 5));
    assertDiffEdge(xy(-5, 5), xy(0, 5), xy(-1, 5), xy(-5, 5));

    //Bottom Left
    assertDiffEdge(xy(-5, -5), xy(-5, 0), xy(-5, -0.1), xy(-5, -5));
    assertDiffEdge(xy(-5, -5), xy(0, -5), xy(-1, -5), xy(-5, -5));
  });

  describe('getOpposingSide', () => {
    const assertOpposingSide = (hyp, angle, expected) => {
      it(`${hyp}, ${angle} = ${expected}`, () => {
        const radians = toRadians(angle);
        const result = getOpposingSide(hyp, radians);
        expect(result).toBeCloseTo(expected);
      });
    };

    assertOpposingSide(1, 45, 0.707);
    assertOpposingSide(1.25, 45, 0.88);
  });
});
