import { angle, edge, maxEdge, minEdge, toRadians } from '../trig';
import { xy } from '../utils';

const vs = v => {
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
      it(p`${a}, ${b} => ${expected}`, () => {
        const result = angle(a, b);
        expect(result).toBeCloseTo(expected);
      });
    };
    assertAngle(xy(0, 0), xy(1, 1), toRadians(45));
    assertAngle(xy(1, 1), xy(0, 0), toRadians(45));
    assertAngle(xy(0, 0), xy(2, 1), toRadians(26.565));
    assertAngle(xy(0, 0), xy(3, 1), toRadians(18.434));
    assertAngle(xy(0, 0), xy(4, 1), toRadians(14.036));
    assertAngle(xy(0, 0), xy(5, 1), toRadians(11.309));
  });
  describe.only('minEdge', () => {
    const aa = (domain, range) => (a, b, expected) => {
      it(p`${a}-${b} => ${expected}`, () => {
        const result = minEdge(domain, range)(a, b);
        expect(result.x).toBeCloseTo(expected.x);
        expect(result.y).toBeCloseTo(expected.y);
      });
    };

    const assert = aa({ min: -4, max: 4 }, { min: -4, max: 4 });

    // assert(xy(-1, -1), xy(2, 2), xy(-4, -4));
    // assert(xy(0, 0), xy(1, 1), xy(-4, -4));
    // assert(xy(0, 0), xy(1, 2), xy(-2, -4));
    // assert(xy(-1, -2), xy(0, 0), xy(-2, -4));
    assert(xy(-1, 2), xy(0, 0), xy(2, -4));
    assert(xy(-1, 2), xy(0, 0), xy(2, -4));
    assert(xy(0, 0), xy(-1, 2), xy(2, -4));
  });

  describe.only('maxEdge', () => {
    const aa = (domain, range) => (a, b, expected) => {
      it(p`${a}-${b} => ${expected}`, () => {
        const result = maxEdge(domain, range)(a, b);
        expect(result.x).toBeCloseTo(expected.x);
        expect(result.y).toBeCloseTo(expected.y);
      });
    };

    const assert = aa({ min: -4, max: 4 }, { min: -4, max: 4 });

    assert(xy(-1, 2), xy(0, 0), xy(-2, 4));
    assert(xy(0, 0), xy(-1, 2), xy(-2, 4));
    // assert(xy(-1, -1), xy(2, 2), xy(4, 4));
    // assert(xy(-2, -2), xy(-1, -1), xy(4, 4));
    // assert(xy(0, 0), xy(2, 2), xy(4, 4));
    // assert(xy(0, 0), xy(1, 1), xy(4, 4));
    // assert(xy(0, 0), xy(2, 1), xy(4, 2));
    // assert(xy(-1, -1), xy(1, 0), xy(4, 1.5));
    // assert(xy(0, 0), xy(3, 1), xy(4, 1.333));
    // assert(xy(0, 0), xy(1, 2), xy(2, 4));
    // assert(xy(0, 0), xy(1, 3), xy(1.333, 4));
  });
});
