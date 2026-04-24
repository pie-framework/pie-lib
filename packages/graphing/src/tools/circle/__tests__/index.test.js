import { tool } from '../index';
import { equalPoints } from '../../../utils';

jest.mock('../../../utils', () => ({
  equalPoints: jest.fn(),
}));

describe('circle tool', () => {
  let circleTool;

  beforeEach(() => {
    jest.clearAllMocks();
    circleTool = tool();
  });

  describe('tool configuration', () => {
    it('creates a tool object', () => {
      expect(circleTool).toBeDefined();
      expect(typeof circleTool).toBe('object');
    });

    it('has type circle', () => {
      expect(circleTool.type).toBe('circle');
    });

    it('has a Component', () => {
      expect(circleTool.Component).toBeDefined();
    });

    it('has hover function', () => {
      expect(typeof circleTool.hover).toBe('function');
    });

    it('has addPoint function', () => {
      expect(typeof circleTool.addPoint).toBe('function');
    });
  });

  describe('hover', () => {
    it('returns mark with edge point', () => {
      const point = { x: 5, y: 10 };
      const mark = { type: 'circle', root: { x: 0, y: 0 } };

      const result = circleTool.hover(point, mark);

      expect(result).toEqual({ ...mark, edge: point });
    });

    it('updates existing mark with new edge', () => {
      const point = { x: 7, y: 8 };
      const mark = {
        type: 'circle',
        root: { x: 1, y: 1 },
        edge: { x: 3, y: 3 },
      };

      const result = circleTool.hover(point, mark);

      expect(result.edge).toEqual(point);
      expect(result.root).toEqual(mark.root);
    });

    it('preserves mark properties', () => {
      const point = { x: 5, y: 5 };
      const mark = {
        type: 'circle',
        root: { x: 0, y: 0 },
        label: 'Circle A',
        correctness: { value: 'correct' },
      };

      const result = circleTool.hover(point, mark);

      expect(result.label).toBe('Circle A');
      expect(result.correctness).toEqual({ value: 'correct' });
    });

    it('handles null mark', () => {
      const point = { x: 5, y: 10 };
      const mark = null;

      const result = circleTool.hover(point, mark);

      expect(result).toEqual({ edge: point });
    });

    it('handles undefined mark', () => {
      const point = { x: 5, y: 10 };
      const mark = undefined;

      const result = circleTool.hover(point, mark);

      expect(result).toEqual({ edge: point });
    });

    it('works with negative coordinates', () => {
      const point = { x: -5, y: -10 };
      const mark = { type: 'circle', root: { x: -1, y: -1 } };

      const result = circleTool.hover(point, mark);

      expect(result.edge).toEqual(point);
    });

    it('works with decimal coordinates', () => {
      const point = { x: 3.5, y: 7.8 };
      const mark = { type: 'circle', root: { x: 1.2, y: 2.4 } };

      const result = circleTool.hover(point, mark);

      expect(result.edge).toEqual(point);
    });
  });

  describe('addPoint', () => {
    describe('first point (creating root)', () => {
      it('creates new circle mark when no mark exists', () => {
        const point = { x: 5, y: 10 };
        const mark = null;
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(point, mark);

        expect(result).toEqual({
          type: 'circle',
          root: point,
          building: true,
        });
      });

      it('creates building circle with correct properties', () => {
        const point = { x: 3, y: 7 };
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(point, null);

        expect(result.type).toBe('circle');
        expect(result.root).toEqual(point);
        expect(result.building).toBe(true);
        expect(result.edge).toBeUndefined();
      });

      it('works with negative coordinates', () => {
        const point = { x: -5, y: -10 };
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(point, null);

        expect(result.root).toEqual(point);
        expect(result.building).toBe(true);
      });

      it('works with zero coordinates', () => {
        const point = { x: 0, y: 0 };
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(point, null);

        expect(result.root).toEqual(point);
        expect(result.building).toBe(true);
      });

      it('works with decimal coordinates', () => {
        const point = { x: 3.5, y: 7.25 };
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(point, null);

        expect(result.root).toEqual(point);
        expect(result.building).toBe(true);
      });
    });

    describe('second point (completing circle)', () => {
      it('completes circle when adding edge point', () => {
        const root = { x: 0, y: 0 };
        const edge = { x: 5, y: 5 };
        const mark = {
          type: 'circle',
          root,
          building: true,
        };
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(edge, mark);

        expect(result).toEqual({
          ...mark,
          edge,
          building: false,
        });
      });

      it('sets building to false', () => {
        const mark = {
          type: 'circle',
          root: { x: 1, y: 1 },
          building: true,
        };
        const point = { x: 5, y: 5 };
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(point, mark);

        expect(result.building).toBe(false);
      });

      it('preserves mark type', () => {
        const mark = {
          type: 'circle',
          root: { x: 1, y: 1 },
          building: true,
        };
        const point = { x: 5, y: 5 };
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(point, mark);

        expect(result.type).toBe('circle');
      });

      it('preserves root when adding edge', () => {
        const root = { x: 2, y: 3 };
        const mark = {
          type: 'circle',
          root,
          building: true,
        };
        const edge = { x: 8, y: 9 };
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(edge, mark);

        expect(result.root).toEqual(root);
        expect(result.edge).toEqual(edge);
      });

      it('works with large radius', () => {
        const root = { x: 0, y: 0 };
        const edge = { x: 100, y: 100 };
        const mark = {
          type: 'circle',
          root,
          building: true,
        };
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(edge, mark);

        expect(result.edge).toEqual(edge);
        expect(result.building).toBe(false);
      });

      it('works with small radius', () => {
        const root = { x: 5, y: 5 };
        const edge = { x: 5.1, y: 5.1 };
        const mark = {
          type: 'circle',
          root,
          building: true,
        };
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(edge, mark);

        expect(result.edge).toEqual(edge);
        expect(result.building).toBe(false);
      });
    });

    describe('same point handling', () => {
      it('returns same mark when clicking same point as root', () => {
        const point = { x: 5, y: 10 };
        const mark = {
          type: 'circle',
          root: point,
          building: true,
        };
        equalPoints.mockReturnValue(true);

        const result = circleTool.addPoint(point, mark);

        expect(result).toBe(mark);
      });

      it('calls equalPoints with correct arguments', () => {
        const point = { x: 5, y: 10 };
        const mark = {
          type: 'circle',
          root: { x: 5, y: 10 },
          building: true,
        };
        equalPoints.mockReturnValue(true);

        circleTool.addPoint(point, mark);

        expect(equalPoints).toHaveBeenCalledWith(mark.root, point);
      });

      it('prevents zero-radius circle', () => {
        const point = { x: 5, y: 10 };
        const mark = {
          type: 'circle',
          root: { x: 5, y: 10 },
          building: true,
        };
        equalPoints.mockReturnValue(true);

        const result = circleTool.addPoint(point, mark);

        // Should return unchanged mark, not complete the circle
        expect(result).toBe(mark);
        expect(result.building).toBe(true);
      });
    });

    describe('edge cases', () => {
      it('handles undefined mark on first click', () => {
        const point = { x: 5, y: 10 };
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(point, undefined);

        expect(result.type).toBe('circle');
        expect(result.root).toEqual(point);
        expect(result.building).toBe(true);
      });

      it('handles mark with additional properties', () => {
        const mark = {
          type: 'circle',
          root: { x: 1, y: 1 },
          building: true,
          label: 'Circle 1',
          correctness: { value: 'correct' },
        };
        const point = { x: 5, y: 5 };
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(point, mark);

        expect(result.label).toBe('Circle 1');
        expect(result.correctness).toEqual({ value: 'correct' });
        expect(result.edge).toEqual(point);
        expect(result.building).toBe(false);
      });

      it('handles mark with existing edge', () => {
        const mark = {
          type: 'circle',
          root: { x: 0, y: 0 },
          edge: { x: 3, y: 3 },
          building: true,
        };
        const newEdge = { x: 5, y: 5 };
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(newEdge, mark);

        expect(result.edge).toEqual(newEdge);
        expect(result.building).toBe(false);
      });

      it('works with point at origin', () => {
        const point = { x: 0, y: 0 };
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(point, null);

        expect(result.root).toEqual(point);
        expect(result.building).toBe(true);
      });

      it('works with very large coordinates', () => {
        const point = { x: 1000, y: 1000 };
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(point, null);

        expect(result.root).toEqual(point);
        expect(result.building).toBe(true);
      });

      it('works with negative coordinates', () => {
        const point = { x: -10, y: -20 };
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(point, null);

        expect(result.root).toEqual(point);
        expect(result.building).toBe(true);
      });
    });

    describe('immutability', () => {
      it('does not mutate original mark when adding edge', () => {
        const mark = {
          type: 'circle',
          root: { x: 1, y: 1 },
          building: true,
        };
        const originalMark = { ...mark };
        const point = { x: 5, y: 5 };
        equalPoints.mockReturnValue(false);

        const result = circleTool.addPoint(point, mark);

        expect(mark).toEqual(originalMark);
        expect(result).not.toBe(mark);
      });

      it('does not mutate original mark when returning same', () => {
        const mark = {
          type: 'circle',
          root: { x: 5, y: 10 },
          building: true,
        };
        const point = { x: 5, y: 10 };
        equalPoints.mockReturnValue(true);

        const result = circleTool.addPoint(point, mark);

        expect(result).toBe(mark);
      });
    });
  });

  describe('integration scenarios', () => {
    it('handles full circle creation flow', () => {
      equalPoints.mockReturnValue(false);

      // First click - create root
      const firstPoint = { x: 5, y: 5 };
      const mark1 = circleTool.addPoint(firstPoint, null);
      expect(mark1.root).toEqual(firstPoint);
      expect(mark1.building).toBe(true);

      // Hover - show preview
      const hoverPoint = { x: 10, y: 10 };
      const mark2 = circleTool.hover(hoverPoint, mark1);
      expect(mark2.edge).toEqual(hoverPoint);

      // Second click - complete circle
      const secondPoint = { x: 10, y: 5 };
      const mark3 = circleTool.addPoint(secondPoint, mark1);
      expect(mark3.root).toEqual(firstPoint);
      expect(mark3.edge).toEqual(secondPoint);
      expect(mark3.building).toBe(false);
    });

    it('handles attempted zero-radius circle', () => {
      const point = { x: 5, y: 5 };

      // First click
      equalPoints.mockReturnValue(false);
      const mark1 = circleTool.addPoint(point, null);

      // Second click at same point
      equalPoints.mockReturnValue(true);
      const mark2 = circleTool.addPoint(point, mark1);

      // Should return unchanged mark
      expect(mark2).toBe(mark1);
      expect(mark2.building).toBe(true);
    });

    it('handles circle with labels', () => {
      equalPoints.mockReturnValue(false);

      const firstPoint = { x: 0, y: 0, label: 'Center' };
      const mark1 = circleTool.addPoint(firstPoint, null);

      const secondPoint = { x: 5, y: 0, label: 'Edge' };
      const mark2 = circleTool.addPoint(secondPoint, mark1);

      expect(mark2.root.label).toBe('Center');
      expect(mark2.building).toBe(false);
    });
  });
});
