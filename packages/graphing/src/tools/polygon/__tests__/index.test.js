import { addPointToArray, tool } from '../index';
import Polygon from '../component';

const xy = (x, y) => ({ x, y });

/**
 * Test suite for polygon tool
 *
 * Note: equalPoints() uses roundNumber() which rounds to 4 decimal places.
 * - Values like 1.0001 and 1.0002 are considered DIFFERENT (round to 1.0001 and 1.0002)
 * - Values like 1.00001 and 1.00002 are considered EQUAL (both round to 1.0000)
 */

describe('polygon', () => {
  describe('addPointToArray', () => {
    const assertAddPoint = (point, arr, expected) => {
      it(`returns expected result when adding point to array`, () => {
        const result = addPointToArray(point, arr);
        expect(result).toEqual(expected);
      });
    };

    assertAddPoint(xy(0, 0), [], { closed: false, points: [xy(0, 0)] });
    assertAddPoint(xy(0, 0), [xy(0, 0)], { closed: false, points: [xy(0, 0)] });
    assertAddPoint(xy(1, 1), [xy(0, 0)], {
      closed: false,
      points: [xy(0, 0), xy(1, 1)],
    });

    it('handles undefined array', () => {
      const result = addPointToArray(xy(1, 2), undefined);
      expect(result).toEqual({ points: [xy(1, 2)], closed: false });
    });

    it('handles null array', () => {
      const result = addPointToArray(xy(1, 2), null);
      expect(result).toEqual({ points: [xy(1, 2)], closed: false });
    });

    it('closes polygon when clicking first point', () => {
      const firstPoint = xy(1, 2);
      const points = [firstPoint, xy(3, 4), xy(5, 6)];
      const result = addPointToArray(firstPoint, points);

      expect(result).toEqual({ points, closed: true });
    });

    it('does not add duplicate point in middle', () => {
      const points = [xy(1, 2), xy(3, 4), xy(5, 6)];
      const result = addPointToArray(points[1], points);

      expect(result).toEqual({ points, closed: false });
    });

    it('adds new point to array with 2+ points', () => {
      const points = [xy(0, 0), xy(1, 1)];
      const newPoint = xy(2, 2);
      const result = addPointToArray(newPoint, points);

      expect(result).toEqual({
        points: [...points, newPoint],
        closed: false,
      });
    });

    it('handles points within rounding tolerance', () => {
      // roundNumber rounds to 4 decimal places
      // 1.0001 and 1.0002 round to different values after toFixed(4)
      const firstPoint = xy(1.0001, 2.0001);
      const closePoint = xy(1.0002, 2.0002);
      const result = addPointToArray(closePoint, [firstPoint]);

      // Since they round to different values, both points are added
      expect(result).toEqual({ points: [firstPoint, closePoint], closed: false });
    });

    it('handles points that round to exactly the same value', () => {
      // Points that round to exactly the same value after toFixed(4)
      const firstPoint = xy(1.0001, 2.0001);
      const samePoint = xy(1.0001, 2.0001);
      const result = addPointToArray(samePoint, [firstPoint]);

      // Since they round to the same value, point is not added
      expect(result).toEqual({ points: [firstPoint], closed: false });
    });
  });
});

describe('tool', () => {
  let t;

  beforeEach(() => {
    t = tool();
  });

  describe('tool structure', () => {
    it('creates polygon type', () => {
      expect(t.type).toEqual('polygon');
    });

    it('has Component property', () => {
      expect(t.Component).toBe(Polygon);
    });

    it('has complete method', () => {
      expect(typeof t.complete).toBe('function');
    });

    it('has addPoint method', () => {
      expect(typeof t.addPoint).toBe('function');
    });
  });

  describe('complete', () => {
    it('closes polygon', () => {
      expect(t.complete()).toEqual({ building: false, closed: true });
    });

    it('marks polygon as not building', () => {
      const mark = {
        type: 'polygon',
        points: [xy(1, 2), xy(3, 4)],
        closed: false,
        building: true,
      };
      const result = t.complete(null, mark);

      expect(result.building).toBe(false);
    });

    it('marks polygon as closed', () => {
      const mark = {
        type: 'polygon',
        points: [xy(1, 2), xy(3, 4)],
        closed: false,
        building: true,
      };
      const result = t.complete(null, mark);

      expect(result.closed).toBe(true);
    });

    it('preserves other mark properties', () => {
      const mark = {
        type: 'polygon',
        points: [xy(1, 2)],
        closed: false,
        building: true,
        label: 'Test',
        color: 'red',
      };
      const result = t.complete(null, mark);

      expect(result.label).toBe('Test');
      expect(result.color).toBe('red');
    });
  });

  describe('addPoint', () => {
    it('creates new polygon with first point', () => {
      const mark = t.addPoint({ x: 0, y: 0 });
      expect(mark).toEqual({
        type: 'polygon',
        points: [{ x: 0, y: 0 }],
        closed: false,
        building: true,
      });
    });

    it('adds second point to existing mark', () => {
      const mark = t.addPoint({ x: 0, y: 0 }, { points: [{ x: 1, y: 1 }] });
      expect(mark).toEqual({
        building: true,
        closed: false,
        points: [
          { x: 1, y: 1 },
          { x: 0, y: 0 },
        ],
      });
    });

    it('creates mark with building flag true', () => {
      const mark = t.addPoint(xy(1, 2));
      expect(mark.building).toBe(true);
    });

    it('creates mark with closed flag false', () => {
      const mark = t.addPoint(xy(1, 2));
      expect(mark.closed).toBe(false);
    });

    it('adds multiple points sequentially', () => {
      let mark = t.addPoint(xy(0, 0));
      mark = t.addPoint(xy(1, 1), mark);
      mark = t.addPoint(xy(2, 2), mark);

      expect(mark.points).toHaveLength(3);
      expect(mark.points).toEqual([xy(0, 0), xy(1, 1), xy(2, 2)]);
    });

    it('closes polygon when clicking first point', () => {
      const firstPoint = xy(1, 2);
      let mark = t.addPoint(firstPoint);
      mark = t.addPoint(xy(3, 4), mark);
      mark = t.addPoint(xy(5, 6), mark);
      mark = t.addPoint(firstPoint, mark);

      expect(mark.closed).toBe(true);
      expect(mark.building).toBe(false);
    });

    it('does not add duplicate points', () => {
      const point = xy(1, 2);
      let mark = t.addPoint(point);
      mark = t.addPoint(xy(3, 4), mark);
      // Adding the first point again would close it
      // Let's add it one more time after closing to test duplicate handling
      mark = t.addPoint(point, mark);

      // When we add the first point to a polygon with 2+ points, it closes
      expect(mark.points).toHaveLength(2);
      expect(mark.closed).toBe(true);
      expect(mark.building).toBe(false);
    });

    it('does not add duplicate non-first points', () => {
      const firstPoint = xy(1, 2);
      const secondPoint = xy(3, 4);
      let mark = t.addPoint(firstPoint);
      mark = t.addPoint(secondPoint, mark);
      mark = t.addPoint(xy(5, 6), mark);
      // Try to add the second point again (not the first point)
      mark = t.addPoint(secondPoint, mark);

      // Should not add the duplicate point
      expect(mark.points).toHaveLength(3);
      expect(mark.points).toEqual([firstPoint, secondPoint, xy(5, 6)]);
      expect(mark.closed).toBe(false);
    });

    it('preserves mark properties when adding points', () => {
      const mark = {
        type: 'polygon',
        points: [xy(1, 2)],
        closed: false,
        building: true,
        label: 'My Shape',
      };

      const result = t.addPoint(xy(3, 4), mark);
      expect(result.label).toBe('My Shape');
    });
  });

  describe('integration scenarios', () => {
    it('creates complete triangle', () => {
      const p1 = xy(0, 0);
      const p2 = xy(1, 0);
      const p3 = xy(0.5, 1);

      let mark = t.addPoint(p1);
      mark = t.addPoint(p2, mark);
      mark = t.addPoint(p3, mark);
      mark = t.addPoint(p1, mark);

      expect(mark.points).toEqual([p1, p2, p3]);
      expect(mark.closed).toBe(true);
      expect(mark.building).toBe(false);
    });

    it('creates complete square', () => {
      const points = [xy(0, 0), xy(1, 0), xy(1, 1), xy(0, 1)];

      let mark = t.addPoint(points[0]);
      points.slice(1).forEach((p) => {
        mark = t.addPoint(p, mark);
      });
      mark = t.addPoint(points[0], mark);

      expect(mark.points).toEqual(points);
      expect(mark.closed).toBe(true);
    });

    it('can force complete without closing', () => {
      let mark = t.addPoint(xy(0, 0));
      mark = t.addPoint(xy(1, 1), mark);
      mark = t.complete(null, mark);

      expect(mark.closed).toBe(true);
      expect(mark.building).toBe(false);
      expect(mark.points).toHaveLength(2);
    });
  });
});
