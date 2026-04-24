import { tool } from '../index';
import Parabola from '../component';

describe('parabola tool', () => {
  let parabolaTool;

  beforeEach(() => {
    parabolaTool = tool();
  });

  describe('tool structure', () => {
    it('returns an object with required properties', () => {
      expect(parabolaTool).toHaveProperty('type', 'parabola');
      expect(parabolaTool).toHaveProperty('Component', Parabola);
      expect(parabolaTool).toHaveProperty('complete');
      expect(parabolaTool).toHaveProperty('addPoint');
    });

    it('has correct type', () => {
      expect(parabolaTool.type).toBe('parabola');
    });

    it('uses Parabola component', () => {
      expect(parabolaTool.Component).toBe(Parabola);
    });
  });

  describe('addPoint', () => {
    describe('no existing mark', () => {
      it('creates new parabola with root point', () => {
        const point = { x: 1, y: 2 };
        const result = parabolaTool.addPoint(point, null);

        expect(result).toEqual({
          type: 'parabola',
          root: point,
          edge: undefined,
          closed: false,
          building: true,
        });
      });

      it('creates parabola with undefined argument', () => {
        const point = { x: 3, y: 4 };
        const result = parabolaTool.addPoint(point);

        expect(result).toEqual({
          type: 'parabola',
          root: point,
          edge: undefined,
          closed: false,
          building: true,
        });
      });

      it('marks parabola as building', () => {
        const result = parabolaTool.addPoint({ x: 0, y: 0 });

        expect(result.building).toBe(true);
        expect(result.closed).toBe(false);
      });

      it('initializes with undefined edge', () => {
        const result = parabolaTool.addPoint({ x: 1, y: 1 });

        expect(result.edge).toBeUndefined();
      });
    });

    describe('existing mark with root', () => {
      it('adds edge point to complete parabola', () => {
        const root = { x: 1, y: 2 };
        const edge = { x: 3, y: 4 };
        const mark = {
          type: 'parabola',
          root,
          edge: undefined,
          closed: false,
          building: true,
        };

        const result = parabolaTool.addPoint(edge, mark);

        expect(result).toEqual({
          type: 'parabola',
          root,
          edge,
          closed: true,
          building: false,
        });
      });

      it('closes parabola when edge is added', () => {
        const mark = {
          type: 'parabola',
          root: { x: 0, y: 0 },
          edge: undefined,
          closed: false,
          building: true,
        };

        const result = parabolaTool.addPoint({ x: 1, y: 1 }, mark);

        expect(result.closed).toBe(true);
        expect(result.building).toBe(false);
      });

      it('preserves other mark properties when adding edge', () => {
        const mark = {
          type: 'parabola',
          root: { x: 1, y: 2 },
          edge: undefined,
          closed: false,
          building: true,
          label: 'My Parabola',
          color: 'blue',
        };

        const result = parabolaTool.addPoint({ x: 3, y: 4 }, mark);

        expect(result.label).toBe('My Parabola');
        expect(result.color).toBe('blue');
      });
    });

    describe('duplicate points', () => {
      it('returns same mark when clicking root point again', () => {
        const root = { x: 1, y: 2 };
        const mark = {
          type: 'parabola',
          root,
          edge: undefined,
          closed: false,
          building: true,
        };

        const result = parabolaTool.addPoint(root, mark);

        expect(result).toBe(mark);
      });

      it('returns same mark when clicking near root point', () => {
        const root = { x: 1.00001, y: 2.00001 };
        const nearRoot = { x: 1.00002, y: 2.00002 };
        const mark = {
          type: 'parabola',
          root,
          edge: undefined,
          closed: false,
          building: true,
        };

        const result = parabolaTool.addPoint(nearRoot, mark);

        expect(result).toBe(mark);
      });
    });

    describe('same axes constraint', () => {
      it('returns same mark when clicking on same x-axis as root', () => {
        const root = { x: 5, y: 3 };
        const sameXPoint = { x: 5, y: 7 };
        const mark = {
          type: 'parabola',
          root,
          edge: undefined,
          closed: false,
          building: true,
        };

        const result = parabolaTool.addPoint(sameXPoint, mark);

        expect(result).toBe(mark);
      });

      it('returns same mark when clicking on same y-axis as root', () => {
        const root = { x: 3, y: 5 };
        const sameYPoint = { x: 7, y: 5 };
        const mark = {
          type: 'parabola',
          root,
          edge: undefined,
          closed: false,
          building: true,
        };

        const result = parabolaTool.addPoint(sameYPoint, mark);

        expect(result).toBe(mark);
      });

      it('allows edge point on different axes', () => {
        const root = { x: 3, y: 5 };
        const edge = { x: 7, y: 9 };
        const mark = {
          type: 'parabola',
          root,
          edge: undefined,
          closed: false,
          building: true,
        };

        const result = parabolaTool.addPoint(edge, mark);

        expect(result).not.toBe(mark);
        expect(result.edge).toEqual(edge);
      });

      it('handles points within rounding tolerance on same x-axis', () => {
        const root = { x: 5.00001, y: 3 };
        const nearSameX = { x: 5.00002, y: 7 };
        const mark = {
          type: 'parabola',
          root,
          edge: undefined,
          closed: false,
          building: true,
        };

        const result = parabolaTool.addPoint(nearSameX, mark);

        expect(result).toBe(mark);
      });

      it('handles points within rounding tolerance on same y-axis', () => {
        const root = { x: 3, y: 5.00001 };
        const nearSameY = { x: 7, y: 5.00002 };
        const mark = {
          type: 'parabola',
          root,
          edge: undefined,
          closed: false,
          building: true,
        };

        const result = parabolaTool.addPoint(nearSameY, mark);

        expect(result).toBe(mark);
      });
    });

    describe('error handling', () => {
      it('throws error when mark exists but has no root', () => {
        const mark = {
          type: 'parabola',
          edge: undefined,
          closed: false,
          building: true,
        };

        expect(() => {
          parabolaTool.addPoint({ x: 1, y: 2 }, mark);
        }).toThrow('no root - should never happen');
      });

      it('throws error when mark has null root', () => {
        const mark = {
          type: 'parabola',
          root: null,
          edge: undefined,
          closed: false,
          building: true,
        };

        expect(() => {
          parabolaTool.addPoint({ x: 1, y: 2 }, mark);
        }).toThrow('no root - should never happen');
      });

      it('throws error when mark has undefined root', () => {
        const mark = {
          type: 'parabola',
          root: undefined,
          edge: undefined,
          closed: false,
          building: true,
        };

        expect(() => {
          parabolaTool.addPoint({ x: 1, y: 2 }, mark);
        }).toThrow('no root - should never happen');
      });
    });

    describe('coordinates', () => {
      it('handles negative coordinates', () => {
        const root = { x: -3, y: -5 };
        const result = parabolaTool.addPoint(root);

        expect(result.root).toEqual(root);
      });

      it('handles zero coordinates', () => {
        const root = { x: 0, y: 0 };
        const result = parabolaTool.addPoint(root);

        expect(result.root).toEqual(root);
      });

      it('handles decimal coordinates', () => {
        const root = { x: 1.5, y: 2.75 };
        const result = parabolaTool.addPoint(root);

        expect(result.root).toEqual(root);
      });

      it('creates parabola with negative root and positive edge', () => {
        const mark = parabolaTool.addPoint({ x: -2, y: -3 });
        const result = parabolaTool.addPoint({ x: 1, y: 2 }, mark);

        expect(result.root).toEqual({ x: -2, y: -3 });
        expect(result.edge).toEqual({ x: 1, y: 2 });
      });
    });
  });

  describe('complete', () => {
    it('marks parabola as complete and closed', () => {
      const mark = {
        type: 'parabola',
        root: { x: 1, y: 2 },
        edge: { x: 3, y: 4 },
        closed: false,
        building: true,
      };

      const result = parabolaTool.complete(null, mark);

      expect(result).toEqual({
        type: 'parabola',
        root: mark.root,
        edge: mark.edge,
        closed: true,
        building: false,
      });
    });

    it('sets building to false', () => {
      const mark = {
        type: 'parabola',
        root: { x: 0, y: 0 },
        edge: undefined,
        closed: false,
        building: true,
      };

      const result = parabolaTool.complete(null, mark);

      expect(result.building).toBe(false);
    });

    it('sets closed to true', () => {
      const mark = {
        type: 'parabola',
        root: { x: 0, y: 0 },
        edge: undefined,
        closed: false,
        building: true,
      };

      const result = parabolaTool.complete(null, mark);

      expect(result.closed).toBe(true);
    });

    it('preserves all mark properties', () => {
      const mark = {
        type: 'parabola',
        root: { x: 1, y: 2 },
        edge: { x: 3, y: 4 },
        closed: false,
        building: true,
        label: 'Test Parabola',
        color: 'green',
        id: 456,
      };

      const result = parabolaTool.complete(null, mark);

      expect(result.label).toBe('Test Parabola');
      expect(result.color).toBe('green');
      expect(result.id).toBe(456);
    });

    it('can force complete parabola with only root', () => {
      const mark = {
        type: 'parabola',
        root: { x: 1, y: 2 },
        edge: undefined,
        closed: false,
        building: true,
      };

      const result = parabolaTool.complete(null, mark);

      expect(result.closed).toBe(true);
      expect(result.building).toBe(false);
      expect(result.edge).toBeUndefined();
    });
  });

  describe('integration scenarios', () => {
    it('creates complete parabola with two clicks', () => {
      const root = { x: 0, y: 0 };
      const edge = { x: 2, y: 4 };

      let mark = parabolaTool.addPoint(root);
      expect(mark.building).toBe(true);
      expect(mark.closed).toBe(false);

      mark = parabolaTool.addPoint(edge, mark);
      expect(mark.root).toEqual(root);
      expect(mark.edge).toEqual(edge);
      expect(mark.building).toBe(false);
      expect(mark.closed).toBe(true);
    });

    it('ignores clicks on same axis during construction', () => {
      const root = { x: 0, y: 0 };
      let mark = parabolaTool.addPoint(root);

      // Try to add point on same x-axis
      const sameXMark = parabolaTool.addPoint({ x: 0, y: 5 }, mark);
      expect(sameXMark).toBe(mark);
      expect(sameXMark.edge).toBeUndefined();

      // Try to add point on same y-axis
      const sameYMark = parabolaTool.addPoint({ x: 5, y: 0 }, mark);
      expect(sameYMark).toBe(mark);
      expect(sameYMark.edge).toBeUndefined();

      // Add valid edge point
      const finalMark = parabolaTool.addPoint({ x: 2, y: 4 }, mark);
      expect(finalMark.edge).toEqual({ x: 2, y: 4 });
      expect(finalMark.closed).toBe(true);
    });

    it('ignores duplicate clicks on root', () => {
      const root = { x: 1, y: 2 };
      let mark = parabolaTool.addPoint(root);

      // Click root again
      const sameMark = parabolaTool.addPoint(root, mark);
      expect(sameMark).toBe(mark);
      expect(sameMark.edge).toBeUndefined();
    });

    it('handles typical parabola in different quadrants', () => {
      // Quadrant 1
      let mark1 = parabolaTool.addPoint({ x: 1, y: 1 });
      mark1 = parabolaTool.addPoint({ x: 2, y: 3 }, mark1);
      expect(mark1.closed).toBe(true);

      // Quadrant 2
      let mark2 = parabolaTool.addPoint({ x: -1, y: 1 });
      mark2 = parabolaTool.addPoint({ x: -2, y: 3 }, mark2);
      expect(mark2.closed).toBe(true);

      // Quadrant 3
      let mark3 = parabolaTool.addPoint({ x: -1, y: -1 });
      mark3 = parabolaTool.addPoint({ x: -2, y: -3 }, mark3);
      expect(mark3.closed).toBe(true);

      // Quadrant 4
      let mark4 = parabolaTool.addPoint({ x: 1, y: -1 });
      mark4 = parabolaTool.addPoint({ x: 2, y: -3 }, mark4);
      expect(mark4.closed).toBe(true);
    });
  });
});
