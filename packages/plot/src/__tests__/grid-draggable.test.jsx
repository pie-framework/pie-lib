import { shallow } from 'enzyme';
import React from 'react';
import { gridDraggable } from '../grid-draggable';
import { getDelta } from '../utils';

jest.mock('../draggable', () => ({ children }) => (
  <div data-name="draggable">{children}</div>
));

jest.mock('../utils', () => ({
  getDelta: jest.fn()
}));

describe('gridDraggable', () => {
  const wrapper = (opts, extras) => {
    const defaults = {
      graphProps: {
        scale: {
          x: jest.fn(x => x),
          y: jest.fn(y => y)
        },
        snap: {
          x: jest.fn(x => x),
          y: jest.fn(y => y)
        },
        domain: {
          min: 0,
          max: 1
        },
        range: {
          min: 0,
          max: 1
        },
        size: {
          width: 500,
          height: 500
        }
      }
    };

    const props = { ...defaults, ...extras };

    opts = {
      anchorPoint: jest.fn().mockReturnValue({ x: 0, y: 0 }),
      bounds: jest
        .fn()
        .mockReturnValue({ left: 0, top: 0, bottom: 0, right: 0 }),
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
  });

  describe('logic', () => {
    describe('grid', () => {
      it('returns the grid', () => {
        const w = wrapper();
        const g = w.instance().grid();
        expect(g).toEqual({ interval: 1, x: 1, y: 1 });
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
        w.instance().onStop({}, {});
        expect(onClick).toHaveBeenCalled();
      });

      it('calls onMove if not tiny', () => {
        const onMove = jest.fn();
        const fromDelta = jest.fn().mockReturnValue(1);
        const w = wrapper({ fromDelta }, { onMove });
        w.instance().tiny = jest.fn().mockReturnValue(false);
        w.instance().applyDelta = jest.fn().mockReturnValue(1);
        w.instance().onStop({}, {});
        expect(onMove).toHaveBeenCalledWith(1);
      });
    });
  });
});
