import { tool } from '../index';
import Point from '../component';

describe('point tool', () => {
  let pointTool;

  beforeEach(() => {
    pointTool = tool();
  });

  describe('tool structure', () => {
    it('returns an object with required properties', () => {
      expect(pointTool).toHaveProperty('label', 'Point');
      expect(pointTool).toHaveProperty('type', 'point');
      expect(pointTool).toHaveProperty('Component', Point);
      expect(pointTool).toHaveProperty('addPoint');
    });

    it('has correct label', () => {
      expect(pointTool.label).toBe('Point');
    });

    it('has correct type', () => {
      expect(pointTool.type).toBe('point');
    });

    it('uses Point component', () => {
      expect(pointTool.Component).toBe(Point);
    });

    it('does not have complete method', () => {
      expect(pointTool.complete).toBeUndefined();
    });
  });

  describe('addPoint', () => {
    it('creates a point mark from coordinates', () => {
      const point = { x: 1, y: 2 };
      const result = pointTool.addPoint(point);

      expect(result).toEqual({
        type: 'point',
        x: 1,
        y: 2,
      });
    });

    it('creates point with integer coordinates', () => {
      const point = { x: 5, y: 10 };
      const result = pointTool.addPoint(point);

      expect(result).toEqual({
        type: 'point',
        x: 5,
        y: 10,
      });
    });

    it('creates point with decimal coordinates', () => {
      const point = { x: 1.5, y: 2.75 };
      const result = pointTool.addPoint(point);

      expect(result).toEqual({
        type: 'point',
        x: 1.5,
        y: 2.75,
      });
    });

    it('creates point with negative coordinates', () => {
      const point = { x: -3, y: -7 };
      const result = pointTool.addPoint(point);

      expect(result).toEqual({
        type: 'point',
        x: -3,
        y: -7,
      });
    });

    it('creates point with zero coordinates', () => {
      const point = { x: 0, y: 0 };
      const result = pointTool.addPoint(point);

      expect(result).toEqual({
        type: 'point',
        x: 0,
        y: 0,
      });
    });

    it('creates point at origin', () => {
      const result = pointTool.addPoint({ x: 0, y: 0 });

      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });

    it('spreads all point properties', () => {
      const point = { x: 1, y: 2, label: 'A', color: 'red' };
      const result = pointTool.addPoint(point);

      expect(result).toEqual({
        type: 'point',
        x: 1,
        y: 2,
        label: 'A',
        color: 'red',
      });
    });

    it('preserves additional properties from point object', () => {
      const point = {
        x: 3,
        y: 4,
        id: 'point-1',
        fill: 'blue',
        stroke: 'black',
      };
      const result = pointTool.addPoint(point);

      expect(result.type).toBe('point');
      expect(result.x).toBe(3);
      expect(result.y).toBe(4);
      expect(result.id).toBe('point-1');
      expect(result.fill).toBe('blue');
      expect(result.stroke).toBe('black');
    });

    it('ignores existing mark parameter', () => {
      const point = { x: 1, y: 2 };
      const existingMark = { type: 'point', x: 5, y: 5 };
      const result = pointTool.addPoint(point, existingMark);

      // Point tool always creates new mark, ignoring existing
      expect(result).toEqual({
        type: 'point',
        x: 1,
        y: 2,
      });
    });

    it('creates new point even with same coordinates', () => {
      const point = { x: 1, y: 2 };
      const result1 = pointTool.addPoint(point);
      const result2 = pointTool.addPoint(point);

      expect(result1).toEqual(result2);
      expect(result1).not.toBe(result2); // Different object references
    });

    it('handles very large coordinates', () => {
      const point = { x: 1000000, y: -1000000 };
      const result = pointTool.addPoint(point);

      expect(result.x).toBe(1000000);
      expect(result.y).toBe(-1000000);
    });

    it('handles very small coordinates', () => {
      const point = { x: 0.0001, y: 0.0002 };
      const result = pointTool.addPoint(point);

      expect(result.x).toBe(0.0001);
      expect(result.y).toBe(0.0002);
    });
  });

  describe('edge cases', () => {
    it('handles point with only x coordinate', () => {
      const point = { x: 5 };
      const result = pointTool.addPoint(point);

      expect(result.type).toBe('point');
      expect(result.x).toBe(5);
      expect(result.y).toBeUndefined();
    });

    it('handles point with only y coordinate', () => {
      const point = { y: 5 };
      const result = pointTool.addPoint(point);

      expect(result.type).toBe('point');
      expect(result.x).toBeUndefined();
      expect(result.y).toBe(5);
    });

    it('handles empty point object', () => {
      const point = {};
      const result = pointTool.addPoint(point);

      expect(result).toEqual({
        type: 'point',
      });
    });

    it('handles NaN coordinates', () => {
      const point = { x: NaN, y: NaN };
      const result = pointTool.addPoint(point);

      expect(result.type).toBe('point');
      expect(Number.isNaN(result.x)).toBe(true);
      expect(Number.isNaN(result.y)).toBe(true);
    });

    it('handles Infinity coordinates', () => {
      const point = { x: Infinity, y: -Infinity };
      const result = pointTool.addPoint(point);

      expect(result.x).toBe(Infinity);
      expect(result.y).toBe(-Infinity);
    });
  });

  describe('multiple points', () => {
    it('creates multiple distinct points', () => {
      const points = [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ];

      const results = points.map((p) => pointTool.addPoint(p));

      expect(results).toHaveLength(3);
      results.forEach((result, i) => {
        expect(result.type).toBe('point');
        expect(result.x).toBe(points[i].x);
        expect(result.y).toBe(points[i].y);
      });
    });

    it('each point is independent', () => {
      const point1 = pointTool.addPoint({ x: 1, y: 1 });
      const point2 = pointTool.addPoint({ x: 2, y: 2 });

      point1.label = 'A';
      expect(point2.label).toBeUndefined();
    });
  });
});
