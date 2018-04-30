import {
  getAnchor,
  normalizeAngle,
  getAngleAndHypotenuse,
  getTranslateXY
} from '../anchor-utils';

const o = (strings, ...exp) => {
  return strings.reduce((acc, v, index) => {
    const e = exp[index];
    const s = typeof e === 'object' ? JSON.stringify(e) : e;
    return `${acc}${v}${s || ''}`;
  }, '');
};

const rect = { width: 100, height: 100 };

describe('getAngleAndHypotenuse', () => {
  const assert = (corner, rect, point, expected) => {
    it(o`${corner}, ${rect}, ${point} => ${expected}`, () => {
      const result = getAngleAndHypotenuse(corner, rect, point);
      expect(result).toMatchObject(expected);
    });
  };
  assert('top-left', rect, { x: 50, y: 50 }, { degrees: -45 });
  assert('bottom-left', rect, { x: 50, y: 50 }, { degrees: -135 });
  assert('top-right', rect, { x: 50, y: 50 }, { degrees: 45 });
  assert('bottom-right', rect, { x: 50, y: 50 }, { degrees: 135 });
});

describe('getAnchor', () => {
  describe('rect', () => {
    it('does this: ', () => {
      const result = getAnchor(
        {
          width: 400,
          height: 100
        },
        { x: 0, y: 100 },
        0
      );
      expect(result.top).not.toBeUndefined();
      expect(result.left).not.toBeUndefined();
    });
  });
  describe('square', () => {
    it('square @ 45', () => {
      const result = getAnchor(
        { width: 100, height: 100 },
        { x: 50, y: 50 },
        45
      );
      expect(result.top).toBeCloseTo(70.71);
      expect(result.left).toBeCloseTo(70.71);
    });
    it('square @ 90', () => {
      const result = getAnchor(
        { width: 100, height: 100 },
        { x: 50, y: 50 },
        90
      );
      expect(result.top).toBeCloseTo(50);
      expect(result.left).toBeCloseTo(50);
    });

    it('square @ 180', () => {
      const result = getAnchor(
        { width: 100, height: 100 },
        { x: 50, y: 50 },
        180
      );
      expect(result.top).toBeCloseTo(50);
      expect(result.left).toBeCloseTo(50);
    });

    it('square @ 270', () => {
      const result = getAnchor(
        { width: 100, height: 100 },
        { x: 50, y: 50 },
        180
      );
      expect(result.top).toBeCloseTo(50);
      expect(result.left).toBeCloseTo(50);
    });

    it('square @ -45 - bottom right anchor', () => {
      const result = getAnchor(
        { width: 100, height: 100 },
        { x: 100, y: 100 },
        -45
      );
      expect(result.left).toBeCloseTo(141.42);
      expect(result.top).toBeCloseTo(70.71);
    });

    it('square @ 45 - bottom right anchor', () => {
      const result = getAnchor(
        { width: 100, height: 100 },
        { x: 100, y: 100 },
        45
      );
      expect(result.top).toBeCloseTo(141.42);
      expect(result.left).toBeCloseTo(70.71);
    });

    it('square @ 20 - bottom right anchor', () => {
      const result = getAnchor(
        { width: 100, height: 100 },
        { x: 100, y: 100 },
        20
      );

      expect(result.top).toBeCloseTo(128.17);
      expect(result.left).toBeCloseTo(93.969);
    });

    it('square @ 45, shifted center', () => {
      const result = getAnchor(
        { width: 100, height: 100 },
        { x: 25, y: 25 },
        45
      );
      expect(result.top).toBeCloseTo(35.36);
      expect(result.left).toBeCloseTo(70.71);
    });

    it('square @ 20, shifted center', () => {
      const result = getAnchor(
        { width: 100, height: 100 },
        { x: 25, y: 25 },
        20
      );
      expect(result.top).toBeCloseTo(32.04);
      expect(result.left).toBeCloseTo(49.14);
    });

    it('square @ 20', () => {
      const result = getAnchor(
        { width: 100, height: 100 },
        { x: 50, y: 50 },
        20
      );
      expect(result.top).toBeCloseTo(64.085);
      expect(result.left).toBeCloseTo(64.085);
    });

    it('square @ 135', () => {
      const result = getAnchor(
        { width: 100, height: 100 },
        { x: 50, y: 50 },
        135
      );
      expect(result.top).toBeCloseTo(70.71);
      expect(result.left).toBeCloseTo(70.71);
    });
    it('square @ 225', () => {
      const result = getAnchor(
        { width: 100, height: 100 },
        { x: 50, y: 50 },
        135
      );
      expect(result.top).toBeCloseTo(70.71);
      expect(result.left).toBeCloseTo(70.71);
    });
  });
});

describe('normalizeAngle', () => {
  const assert = (a, expected) => {
    it(`${a} -> ${expected}`, () => {
      expect(normalizeAngle(a)).toEqual(expected);
    });
  };

  assert(360, 360);
  assert(0, 0);
  assert(10, 10);
  assert(361, 1);
  assert(450, 90);
  assert(721, 1);
  assert(-1, 359);
  assert(-361, 359);
  assert(-721, 359);
});
