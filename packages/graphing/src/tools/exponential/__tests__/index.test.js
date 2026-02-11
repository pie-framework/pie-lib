import { tool } from '../index';
import { equalPoints, sameAxes } from '../../../utils';

jest.mock('../../../utils', () => ({
  equalPoints: jest.fn(),
  sameAxes: jest.fn(),
}));

jest.mock('debug', () => {
  return jest.fn(() => jest.fn());
});

describe('exponential tool', () => {
  let exponentialTool;

  beforeEach(() => {
    jest.clearAllMocks();
    exponentialTool = tool();
  });

  describe('tool configuration', () => {
    it('creates a tool object', () => {
      expect(exponentialTool).toBeDefined();
      expect(typeof exponentialTool).toBe('object');
    });

    it('has type exponential', () => {
      expect(exponentialTool.type).toBe('exponential');
    });

    it('has a Component', () => {
      expect(exponentialTool.Component).toBeDefined();
    });

    it('has complete function', () => {
      expect(typeof exponentialTool.complete).toBe('function');
    });

    it('has addPoint function', () => {
      expect(typeof exponentialTool.addPoint).toBe('function');
    });

    it('does not have hover function', () => {
      expect(exponentialTool.hover).toBeUndefined();
    });
  });

  describe('complete', () => {
    it('marks exponential as complete', () => {
      const data = { x: 5, y: 10 };
      const mark = {
        type: 'exponential',
        root: { x: 0, y: 1 },
        edge: { x: 5, y: 10 },
        building: true,
        closed: false,
      };

      const result = exponentialTool.complete(data, mark);

      expect(result).toEqual({
        ...mark,
        building: false,
        closed: true,
      });
    });

    it('sets building to false', () => {
      const mark = {
        type: 'exponential',
        root: { x: 0, y: 1 },
        building: true,
      };

      const result = exponentialTool.complete({}, mark);

      expect(result.building).toBe(false);
    });

    it('sets closed to true', () => {
      const mark = {
        type: 'exponential',
        root: { x: 0, y: 1 },
        closed: false,
      };

      const result = exponentialTool.complete({}, mark);

      expect(result.closed).toBe(true);
    });

    it('preserves mark properties', () => {
      const mark = {
        type: 'exponential',
        root: { x: 0, y: 1 },
        edge: { x: 5, y: 10 },
        label: 'Exp A',
        correctness: { value: 'correct' },
      };

      const result = exponentialTool.complete({}, mark);

      expect(result.label).toBe('Exp A');
      expect(result.correctness).toEqual({ value: 'correct' });
      expect(result.root).toEqual(mark.root);
      expect(result.edge).toEqual(mark.edge);
    });

    it('does not mutate original mark', () => {
      const mark = {
        type: 'exponential',
        root: { x: 0, y: 1 },
        building: true,
        closed: false,
      };
      const originalMark = { ...mark };

      exponentialTool.complete({}, mark);

      expect(mark).toEqual(originalMark);
    });
  });

  describe('addPoint', () => {
    describe('first point (creating root)', () => {
      it('creates new exponential mark when no mark exists', () => {
        const point = { x: 0, y: 5 };
        const mark = null;
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, mark);

        expect(result).toEqual({
          type: 'exponential',
          root: point,
          edge: undefined,
          closed: false,
          building: true,
        });
      });

      it('creates mark with building true', () => {
        const point = { x: 2, y: 3 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, null);

        expect(result.building).toBe(true);
      });

      it('creates mark with closed false', () => {
        const point = { x: 2, y: 3 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, null);

        expect(result.closed).toBe(false);
      });

      it('creates mark with undefined edge', () => {
        const point = { x: 2, y: 3 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, null);

        expect(result.edge).toBeUndefined();
      });

      it('works with positive coordinates', () => {
        const point = { x: 5, y: 10 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, null);

        expect(result.root).toEqual(point);
      });

      it('works with negative y coordinate', () => {
        const point = { x: 5, y: -10 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, null);

        expect(result.root).toEqual(point);
      });

      it('works with decimal coordinates', () => {
        const point = { x: 3.5, y: 7.25 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, null);

        expect(result.root).toEqual(point);
      });
    });

    describe('second point (completing exponential)', () => {
      it('completes exponential when adding edge point', () => {
        const root = { x: 0, y: 1 };
        const edge = { x: 5, y: 10 };
        const mark = {
          type: 'exponential',
          root,
          edge: undefined,
          closed: false,
          building: true,
        };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(edge, mark);

        expect(result).toEqual({
          ...mark,
          edge,
          closed: true,
          building: false,
        });
      });

      it('sets building to false', () => {
        const mark = {
          type: 'exponential',
          root: { x: 0, y: 1 },
          building: true,
        };
        const point = { x: 5, y: 10 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, mark);

        expect(result.building).toBe(false);
      });

      it('sets closed to true', () => {
        const mark = {
          type: 'exponential',
          root: { x: 0, y: 1 },
          closed: false,
        };
        const point = { x: 5, y: 10 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, mark);

        expect(result.closed).toBe(true);
      });

      it('preserves root when adding edge', () => {
        const root = { x: 1, y: 2 };
        const mark = {
          type: 'exponential',
          root,
          building: true,
        };
        const edge = { x: 5, y: 8 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(edge, mark);

        expect(result.root).toEqual(root);
        expect(result.edge).toEqual(edge);
      });

      it('preserves mark properties', () => {
        const mark = {
          type: 'exponential',
          root: { x: 0, y: 1 },
          label: 'Exp 1',
          correctness: { value: 'correct' },
        };
        const point = { x: 5, y: 10 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, mark);

        expect(result.label).toBe('Exp 1');
        expect(result.correctness).toEqual({ value: 'correct' });
      });
    });

    describe('same point handling', () => {
      it('returns same mark when clicking equal point', () => {
        const point = { x: 5, y: 10 };
        const mark = {
          type: 'exponential',
          root: point,
          building: true,
        };
        equalPoints.mockReturnValue(true);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, mark);

        expect(result).toBe(mark);
      });

      it('returns same mark when clicking point on same axis', () => {
        const mark = {
          type: 'exponential',
          root: { x: 5, y: 10 },
          building: true,
        };
        const point = { x: 8, y: 10 }; // same y
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(true);

        const result = exponentialTool.addPoint(point, mark);

        expect(result).toBe(mark);
      });

      it('calls equalPoints with correct arguments', () => {
        const point = { x: 5, y: 10 };
        const mark = {
          type: 'exponential',
          root: { x: 5, y: 10 },
          building: true,
        };
        equalPoints.mockReturnValue(true);

        exponentialTool.addPoint(point, mark);

        expect(equalPoints).toHaveBeenCalledWith(mark.root, point);
      });

      it('calls sameAxes with correct arguments', () => {
        const point = { x: 8, y: 10 };
        const mark = {
          type: 'exponential',
          root: { x: 5, y: 10 },
          building: true,
        };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(true);

        exponentialTool.addPoint(point, mark);

        expect(sameAxes).toHaveBeenCalledWith(mark.root, point);
      });
    });

    describe('opposite sign y-coordinates', () => {
      it('returns same mark when root and point have opposite sign y', () => {
        const mark = {
          type: 'exponential',
          root: { x: 0, y: 5 }, // positive y
          building: true,
        };
        const point = { x: 5, y: -10 }; // negative y
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, mark);

        expect(result).toBe(mark);
      });

      it('returns same mark when root is negative and point is positive', () => {
        const mark = {
          type: 'exponential',
          root: { x: 0, y: -5 }, // negative y
          building: true,
        };
        const point = { x: 5, y: 10 }; // positive y
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, mark);

        expect(result).toBe(mark);
      });

      it('allows points with same sign y (both positive)', () => {
        const mark = {
          type: 'exponential',
          root: { x: 0, y: 5 },
          building: true,
        };
        const point = { x: 5, y: 10 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, mark);

        expect(result.edge).toEqual(point);
        expect(result.building).toBe(false);
      });

      it('allows points with same sign y (both negative)', () => {
        const mark = {
          type: 'exponential',
          root: { x: 0, y: -5 },
          building: true,
        };
        const point = { x: 5, y: -10 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, mark);

        expect(result.edge).toEqual(point);
        expect(result.building).toBe(false);
      });
    });

    describe('zero y-coordinate handling', () => {
      it('returns same mark when point has y = 0', () => {
        const mark = {
          type: 'exponential',
          root: { x: 0, y: 5 },
          building: true,
        };
        const point = { x: 5, y: 0 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, mark);

        expect(result).toBe(mark);
      });

      it('prevents adding point with zero y', () => {
        const point = { x: 5, y: 0 };
        const mark = {
          type: 'exponential',
          root: { x: 1, y: 2 },
          building: true,
        };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, mark);

        expect(result).toBe(mark);
        expect(result.edge).toBeUndefined();
      });

      it('prevents creating root with zero y', () => {
        const point = { x: 5, y: 0 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, null);

        expect(result).toBeNull();
      });

      it('allows positive y values close to zero', () => {
        const point = { x: 5, y: 0.001 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, null);

        expect(result.root).toEqual(point);
      });

      it('allows negative y values close to zero', () => {
        const point = { x: 5, y: -0.001 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, null);

        expect(result.root).toEqual(point);
      });
    });

    describe('error handling', () => {
      it('throws error when mark has no root', () => {
        const mark = {
          type: 'exponential',
          building: true,
          // root is missing
        };
        const point = { x: 5, y: 10 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        expect(() => {
          exponentialTool.addPoint(point, mark);
        }).toThrow(); // Will throw TypeError when accessing undefined.y
      });

      it('throws error when mark root is null', () => {
        const mark = {
          type: 'exponential',
          root: null,
          building: true,
        };
        const point = { x: 5, y: 10 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        expect(() => {
          exponentialTool.addPoint(point, mark);
        }).toThrow(); // Will throw TypeError when accessing null.y
      });

      it('throws error when mark root is undefined', () => {
        const mark = {
          type: 'exponential',
          root: undefined,
          building: true,
        };
        const point = { x: 5, y: 10 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        expect(() => {
          exponentialTool.addPoint(point, mark);
        }).toThrow(); // Will throw TypeError when accessing undefined.y
      });
    });

    describe('edge cases', () => {
      it('handles undefined mark on first click', () => {
        const point = { x: 5, y: 10 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, undefined);

        expect(result.type).toBe('exponential');
        expect(result.root).toEqual(point);
        expect(result.building).toBe(true);
      });

      it('handles very large positive y', () => {
        const point = { x: 5, y: 10000 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, null);

        expect(result.root).toEqual(point);
      });

      it('handles very large negative y', () => {
        const point = { x: 5, y: -10000 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, null);

        expect(result.root).toEqual(point);
      });

      it('handles negative x coordinates', () => {
        const point = { x: -5, y: 10 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, null);

        expect(result.root).toEqual(point);
      });

      it('handles mark with existing edge', () => {
        const mark = {
          type: 'exponential',
          root: { x: 0, y: 1 },
          edge: { x: 3, y: 3 },
          building: false,
          closed: true,
        };
        const newEdge = { x: 5, y: 5 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(newEdge, mark);

        expect(result.edge).toEqual(newEdge);
        expect(result.closed).toBe(true);
        expect(result.building).toBe(false);
      });
    });

    describe('immutability', () => {
      it('does not mutate original mark when adding edge', () => {
        const mark = {
          type: 'exponential',
          root: { x: 0, y: 1 },
          building: true,
        };
        const originalMark = { ...mark };
        const point = { x: 5, y: 10 };
        equalPoints.mockReturnValue(false);
        sameAxes.mockReturnValue(false);

        const result = exponentialTool.addPoint(point, mark);

        expect(mark).toEqual(originalMark);
        expect(result).not.toBe(mark);
      });

      it('does not mutate original mark when returning same', () => {
        const mark = {
          type: 'exponential',
          root: { x: 5, y: 10 },
          building: true,
        };
        const point = { x: 5, y: 10 };
        equalPoints.mockReturnValue(true);

        const result = exponentialTool.addPoint(point, mark);

        expect(result).toBe(mark);
      });
    });
  });

  describe('integration scenarios', () => {
    it('handles full exponential creation flow', () => {
      equalPoints.mockReturnValue(false);
      sameAxes.mockReturnValue(false);

      // First click - create root
      const firstPoint = { x: 0, y: 1 };
      const mark1 = exponentialTool.addPoint(firstPoint, null);
      expect(mark1.root).toEqual(firstPoint);
      expect(mark1.building).toBe(true);
      expect(mark1.closed).toBe(false);

      // Second click - complete exponential
      const secondPoint = { x: 5, y: 10 };
      const mark2 = exponentialTool.addPoint(secondPoint, mark1);
      expect(mark2.root).toEqual(firstPoint);
      expect(mark2.edge).toEqual(secondPoint);
      expect(mark2.building).toBe(false);
      expect(mark2.closed).toBe(true);

      // Complete
      const mark3 = exponentialTool.complete({}, mark2);
      expect(mark3.building).toBe(false);
      expect(mark3.closed).toBe(true);
    });

    it('handles rejected second point (zero y)', () => {
      equalPoints.mockReturnValue(false);
      sameAxes.mockReturnValue(false);

      const firstPoint = { x: 0, y: 1 };
      const mark1 = exponentialTool.addPoint(firstPoint, null);

      const secondPoint = { x: 5, y: 0 };
      const mark2 = exponentialTool.addPoint(secondPoint, mark1);

      // Should return unchanged mark
      expect(mark2).toBe(mark1);
      expect(mark2.edge).toBeUndefined();
    });

    it('handles rejected second point (opposite sign)', () => {
      equalPoints.mockReturnValue(false);
      sameAxes.mockReturnValue(false);

      const firstPoint = { x: 0, y: 5 };
      const mark1 = exponentialTool.addPoint(firstPoint, null);

      const secondPoint = { x: 5, y: -10 };
      const mark2 = exponentialTool.addPoint(secondPoint, mark1);

      // Should return unchanged mark
      expect(mark2).toBe(mark1);
      expect(mark2.edge).toBeUndefined();
    });

    it('handles rejected second point (same axes)', () => {
      equalPoints.mockReturnValue(false);
      sameAxes.mockReturnValue(true);

      const firstPoint = { x: 0, y: 5 };
      const mark1 = exponentialTool.addPoint(firstPoint, null);

      const secondPoint = { x: 10, y: 5 }; // same y
      const mark2 = exponentialTool.addPoint(secondPoint, mark1);

      // Should return unchanged mark
      expect(mark2).toBe(mark1);
    });

    it('handles exponential with negative y values', () => {
      equalPoints.mockReturnValue(false);
      sameAxes.mockReturnValue(false);

      const firstPoint = { x: 0, y: -1 };
      const mark1 = exponentialTool.addPoint(firstPoint, null);

      const secondPoint = { x: 5, y: -10 };
      const mark2 = exponentialTool.addPoint(secondPoint, mark1);

      expect(mark2.root).toEqual(firstPoint);
      expect(mark2.edge).toEqual(secondPoint);
      expect(mark2.building).toBe(false);
      expect(mark2.closed).toBe(true);
    });

    it('handles exponential with properties', () => {
      equalPoints.mockReturnValue(false);
      sameAxes.mockReturnValue(false);

      const firstPoint = { x: 0, y: 1, label: 'Start' };
      const mark1 = exponentialTool.addPoint(firstPoint, null);

      // Add properties
      mark1.label = 'Exp A';
      mark1.correctness = { value: 'correct' };

      const secondPoint = { x: 5, y: 10 };
      const mark2 = exponentialTool.addPoint(secondPoint, mark1);

      expect(mark2.label).toBe('Exp A');
      expect(mark2.correctness).toEqual({ value: 'correct' });
    });
  });
});
