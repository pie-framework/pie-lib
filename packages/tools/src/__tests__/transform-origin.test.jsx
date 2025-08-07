import { parse } from '../transform-origin';

describe('transform-origin', () => {
  describe('parse', () => {
    const assert = (origin, expected) => {
      it(`${origin} => ${JSON.stringify(expected)}`, () => {
        const out = parse({ width: 100, height: 100 }, origin);
        expect(out).toEqual(expected);
      });
    };

    assert(undefined, { x: 50, y: 50 });
    assert('right', { x: 100, y: 50 });
    assert('20%', { x: 20, y: 50 });
    assert('left', { x: 0, y: 50 });
    assert('top right', { x: 100, y: 0 });
    assert('right top', { x: 100, y: 0 });
    assert('bottom left', { x: 0, y: 100 });
    assert('left bottom', { x: 0, y: 100 });
    assert('0% 100%', { x: 0, y: 100 });
    assert('100% 0%', { x: 100, y: 0 });
    assert('10px 43px', { x: 10, y: 43 });
  });
});
