import { shallow } from 'enzyme';
import React from 'react';
import { Root } from '../root';
import { select, mouse } from 'd3-selection';

const scaleMock = () => {
  const fn = jest.fn((n) => n);
  fn.invert = jest.fn((n) => n);
  return fn;
};

const graphProps = () => ({
  scale: {
    x: scaleMock(),
    y: scaleMock(),
  },
  snap: {
    x: jest.fn((n) => n),
    y: jest.fn((n) => n),
  },
  domain: {
    min: 0,
    max: 1,
    step: 1,
  },
  range: {
    min: 0,
    max: 1,
    step: 1,
  },
  size: {
    width: 400,
    height: 400,
  },
});

const wrapper = (props) => {
  props = {
    classes: {},
    graphProps: graphProps(),
    ...props,
  };

  return shallow(<Root {...props}>hi</Root>, { disableLifecycleMethods: true });
};

jest.mock('d3-selection', () => ({
  select: jest.fn(),
  mouse: jest.fn(),
}));

describe('root', () => {
  describe('snapshot', () => {
    it('matches', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('mousemove', () => {
      describe('mount/unmount', () => {
        it('adds mousemove listener on compenentDidMount', () => {
          const w = wrapper();
          const g = {
            on: jest.fn(),
          };
          select.mockReturnValue(g);
          w.instance().componentDidMount();
          expect(g.on).toHaveBeenCalledWith('mousemove', expect.any(Function));
        });
        it('unsets mousemove listener on componentWillUnmount', () => {
          const w = wrapper();
          const g = {
            on: jest.fn(),
          };
          select.mockReturnValue(g);
          w.instance().componentWillUnmount();
          expect(g.on).toHaveBeenCalledWith('mousemove', null);
        });
      });

      describe('mouseMove function', () => {
        let onMouseMove, w, gp;
        beforeEach(() => {
          onMouseMove = jest.fn();
          gp = graphProps();
          w = wrapper({
            onMouseMove,
            graphProps: gp,
          });
          mouse.mockReturnValue([0, 0]);
          const g = { _groups: [[[0, 0]]] };
          w.instance().mouseMove(g);
        });
        it('calls mouse', () => {
          expect(mouse).toHaveBeenCalledWith([0, 0]);
        });
        it('calls, scale.x.invert', () => {
          expect(gp.scale.x.invert).toHaveBeenCalledWith(0);
        });
        it('calls, scale.y.invert', () => {
          expect(gp.scale.y.invert).toHaveBeenCalledWith(0);
        });
        it('calls, snap.x', () => {
          expect(gp.snap.x).toHaveBeenCalledWith(0);
        });
        it('calls, snap.y', () => {
          expect(gp.snap.y).toHaveBeenCalledWith(0);
        });

        it('calls handler', () => {
          expect(onMouseMove).toHaveBeenCalledWith({ x: 0, y: 0 });
        });
      });
    });
  });
});
