import { shallow } from 'enzyme';
import React from 'react';
import { gridDraggable } from '../grid-draggable';
import { getDelta } from '../utils';

import { clientPoint } from 'd3-selection';

jest.mock('d3-selection', () => ({
  clientPoint: jest.fn().mockReturnValue([0, 0])
}));

jest.mock('../draggable', () => ({
  DraggableCore: jest.fn((type, props, children) => children)
}));

jest.mock('../utils', () => ({
  getDelta: jest.fn()
}));

const xyFn = () => {
  const out = jest.fn(n => n);
  out.invert = jest.fn(n => n);
  return out;
};
const getGraphProps = () => ({
  scale: {
    x: xyFn(),
    y: xyFn()
  },
  snap: {
    x: xyFn(),
    y: xyFn()
  },
  domain: {
    min: 0,
    max: 1,
    step: 1
  },
  range: {
    min: 0,
    max: 1,
    step: 1
  },
  size: {
    width: 500,
    height: 500
  },
  getRootNode: () => ({})
});

describe('gridDraggable', () => {
  const wrapper = (opts, extras) => {
    const defaults = {
      graphProps: getGraphProps()
    };

    defaults.graphProps.scale.x.invert = jest.fn(x => x);
    defaults.graphProps.scale.y.invert = jest.fn(x => x);

    const props = { ...defaults, ...extras };

    opts = {
      anchorPoint: jest.fn().mockReturnValue({ x: 0, y: 0 }),
      bounds: jest.fn().mockReturnValue({ left: 0, top: 0, bottom: 0, right: 0 }),
      fromDelta: jest.fn(),
      ...opts
    };

    const Comp = gridDraggable(opts)(() => <div />);
    return shallow(<Comp {...props} />);
  };

  describe('snapshot', () => {
    it('reqular', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });

    it('render with decimals', () => {
      const w = wrapper(
        {},
        {
          domain: {
            min: -1.5,
            max: 1.6,
            step: 0.3
          },
          range: {
            min: -2,
            max: 3,
            step: 0.2
          }
        }
      );
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('grid', () => {
      it('returns the grid', () => {
        const w = wrapper();
        const g = w.instance().grid();
        expect(g).toEqual({ x: 1, y: 1 });
      });
    });

    describe('onStart', () => {
      it('sets the drag state', () => {
        const w = wrapper();
        w.instance().onStart({ clientX: 100, clientY: 100 });
        expect(w.state().startX).toEqual(100);
        expect(w.state().startY).toEqual(100);
      });

      it('calls the handler', () => {
        const onDragStart = jest.fn();
        const w = wrapper(
          {},
          {
            onDragStart
          }
        );
        w.instance().onStart({ clientX: 100, clientY: 100 });
        expect(onDragStart).toHaveBeenCalled();
      });
    });

    describe('position', () => {
      it('returns position object', () => {
        const w = wrapper();
        const pos = w.instance().position();

        const anchorPoint = {
          x: 0,
          y: 0
        };
        expect(pos).toEqual({
          anchorPoint,
          x: expect.any(Function),
          y: expect.any(Function)
        });
      });
    });

    describe('tiny', () => {
      it('returns true for 10 ', () => {
        const w = wrapper();
        w.setState({ startX: 0 });
        const result = w.instance().tiny('x', { clientX: 10 });
        expect(result).toBe(false);
      });
      it('returns true for 0.01', () => {
        const w = wrapper();
        w.setState({ startX: 0 });
        const result = w.instance().tiny('x', { clientX: 0.01 });
        expect(result).toBe(true);
      });
    });

    describe('onDrag', () => {
      let onDrag, w;

      beforeEach(() => {
        onDrag = jest.fn();
        w = wrapper({}, { onDrag });
        w.instance().applyDelta = jest.fn().mockReturnValue(0);
        w.instance().onDrag({}, { x: 1, y: 1 });
      });
      it('calls applyDelta', () => {
        expect(w.instance().applyDelta).toHaveBeenCalled();
      });

      it('calls callback', () => {
        expect(onDrag).toHaveBeenCalledWith(0);
      });

      const bounds = (left, right, top, bottom) => ({ left, right, top, bottom });
      describe('bounds', () => {
        const assertEarlyExit = (bounds, dd) => {
          it(`${JSON.stringify(bounds)}, ${dd.deltaX}, ${dd.deltaY} `, () => {
            w = wrapper({}, { onDrag });
            w.instance().getScaledBounds = jest.fn().mockReturnValue(bounds);
            clientPoint.mockClear();
            w.instance().onDrag({}, dd);
            expect(clientPoint).not.toHaveBeenCalled();
          });
        };
        assertEarlyExit(bounds(0, 0, 0, 0), { deltaX: -10 });
        assertEarlyExit(bounds(0, 0, 0, 0), { deltaX: 10 });
        assertEarlyExit(bounds(-100, 100, 0, 0), { deltaY: -10 });
        assertEarlyExit(bounds(-100, 100, -100, 0), { deltaY: 10 });
        it('calls client point if it doesnt exit early bounds', () => {
          w = wrapper({}, { onDrag });
          w.instance().getScaledBounds = jest.fn().mockReturnValue(bounds(100, 100, 100, 100));
          clientPoint.mockClear();
          w.instance().onDrag({}, { deltaX: 10 });
          expect(clientPoint).toHaveBeenCalled();
        });
      });
    });

    describe('skipDragOutsideOfBounds', () => {
      let w;
      const assertSkipDrag = (dd, rawXFn, rawYFn, expected) => {
        rawXFn = rawXFn || (x => x);
        rawYFn = rawYFn || (y => y);

        it(`${dd.deltaX}, ${dd.deltaY}, ${expected}`, () => {
          w = wrapper({});
          const gp = getGraphProps();
          clientPoint.mockClear();
          clientPoint.mockReturnValue([
            rawXFn(gp.domain.min, gp.domain.max),
            rawYFn(gp.range.min, gp.range.max)
          ]);
          const result = w.instance().skipDragOutsideOfBounds(dd, {}, gp);
          expect(result).toEqual(expected);
        });
      };
      assertSkipDrag({ deltaX: 1 }, (min, max) => min - 1, (min, max) => min, true);
      assertSkipDrag({ deltaX: -1 }, (min, max) => max + 1, (min, max) => min, true);
      assertSkipDrag({ deltaY: 1 }, (min, max) => max, (min, max) => max + 1, true);
      assertSkipDrag({ deltaY: -1 }, (min, max) => max, (min, max) => min - 1, true);
      assertSkipDrag({ deltaY: 1 }, (min, max) => max, (min, max) => max, false);
      assertSkipDrag({ deltaY: -1 }, (min, max) => max, (min, max) => min, false);
    });

    describe('getDelta', () => {
      it('calls utils.getDelta', () => {
        const w = wrapper();
        w.instance().position = jest.fn().mockReturnValue({
          anchorPoint: {
            x: 0,
            y: 0
          },
          x: jest.fn(x => x),
          y: jest.fn(y => y)
        });
        w.instance().getDelta({ x: 1, y: 1 });
        expect(getDelta).toHaveBeenCalledWith({ x: 0, y: 0 }, { x: 1, y: 1 });
      });
    });
    describe('applyDelta', () => {
      it('calls fromDelta', () => {
        const fromDelta = jest.fn();
        const w = wrapper({ fromDelta });
        w.instance().getDelta = jest.fn();
        w.instance().applyDelta({ x: 1, y: 1 });
        expect(fromDelta).toHaveBeenCalledWith(expect.anything(), undefined);
      });
    });
    describe('onStop', () => {
      it('calls onDragStop', () => {
        const onDragStop = jest.fn();
        const w = wrapper({}, { onDragStop });
        w.setState({ startX: 0, startY: 0 });
        w.instance().onStop({}, {});
        expect(onDragStop).toHaveBeenCalled();
      });

      it('calls onClick if tiny', () => {
        const onClick = jest.fn();
        const w = wrapper({}, { onClick });
        w.instance().tiny = jest.fn().mockReturnValue(true);
        clientPoint.mockReturnValue([0, 0]);
        w.instance().onStop({}, {});
        expect(onClick).toHaveBeenCalledWith({ x: 0, y: 0 });
      });
    });
  });
});
