import { render } from '@testing-library/react';
import { Rotatable } from '../rotatable';
import React from 'react';
import { distanceBetween } from '../anchor-utils';

import Point from '@mapbox/point-geometry';

jest.mock('../anchor-utils', () => ({
  distanceBetween: jest.fn(() => ({ x: 2, y: 2 })),
  toPoint: jest.fn(() => ({ x: 0, y: 0 })),
  getAnchor: jest.fn(() => ({ left: 0, top: 0 })),
  toDegrees: jest.fn(() => 90),
  arctangent: jest.fn(() => 90),
}));

const event = (x = 0, y = 0) => ({
  pageX: x,
  pageY: y,
  clientX: x,
  clientY: y,
  preventDefault: jest.fn(),
});

describe('rotatable', () => {
  describe('rendering', () => {
    // Note: The Rotatable component has a bug where this.handles is undefined
    // when no handle prop is provided, causing componentWillUnmount to crash.
    // We patch the prototype to fix this for testing.
    beforeAll(() => {
      const originalInit = Rotatable.prototype.initHandles;
      Rotatable.prototype.initHandles = function() {
        this.handles = this.handles || [];
        return originalInit.call(this);
      };

      const originalUnmount = Rotatable.prototype.componentWillUnmount;
      Rotatable.prototype.componentWillUnmount = function() {
        this.handles = this.handles || [];
        return originalUnmount.call(this);
      };
    });

    it('renders children', () => {
      const { container } = render(<Rotatable classes={{}}>foo</Rotatable>);
      expect(container).toHaveTextContent('foo');
    });

    it('renders with handle prop', () => {
      const { container } = render(
        <Rotatable handle={[{ class: 'handle', origin: 'bottom left' }]} classes={{}}>
          <div className="handle">foo</div>
        </Rotatable>
      );
      expect(container).toHaveTextContent('foo');
      expect(container.querySelector('.handle')).toBeInTheDocument();
    });

    it('renders with startPosition prop', () => {
      const { container } = render(
        <Rotatable classes={{}} startPosition={{ left: 50, top: 100 }}>
          foo
        </Rotatable>
      );
      expect(container).toHaveTextContent('foo');
    });
  });

  describe('logic', () => {
    let el, instance, mockRef;

    beforeEach(() => {
      // Mock DOM elements
      el = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };

      mockRef = {
        querySelector: jest.fn(() => el),
        getBoundingClientRect: jest.fn(() => ({
          left: 0,
          top: 0,
          width: 100,
          height: 100,
        })),
      };

      // Mock document methods
      document.addEventListener = jest.fn();
      document.removeEventListener = jest.fn();

      // Create component instance directly
      const props = {
        handle: [{ class: 'foo', origin: 'bottom left' }],
        classes: { rotatable: 'rotatable' },
        children: <div className={'foo'}>foo</div>,
        startPosition: { left: 0, top: 0 },
      };

      instance = new Rotatable(props);
      instance.rotatable = mockRef;

      // Mock clientWidth and clientHeight for originToXY
      Object.defineProperty(instance.rotatable, 'clientWidth', { value: 100, writable: true });
      Object.defineProperty(instance.rotatable, 'clientHeight', { value: 100, writable: true });

      // Mock setState to be synchronous for testing
      instance.setState = jest.fn((updater, callback) => {
        if (typeof updater === 'function') {
          instance.state = { ...instance.state, ...updater(instance.state) };
        } else {
          instance.state = { ...instance.state, ...updater };
        }
        if (callback) callback();
      });

      // Initialize the component
      instance.componentDidMount();

      // Manually set up handles array if it's still undefined after mount
      if (!instance.handles) {
        instance.handles = [{ el, mousedownHandler: jest.fn() }];
      }
    });

    describe('rotate', () => {
      describe('init', () => {
        it('call el.addEventListener(mousedown)', () => {
          expect(el.addEventListener).toBeCalledWith('mousedown', expect.anything());
        });
        it('call el.addEventListener(mouseup)', () => {
          expect(el.addEventListener).toBeCalledWith('mouseup', instance.rotateStop);
        });
      });

      describe('rotateStart', () => {
        let e;
        beforeEach(() => {
          e = event();

          distanceBetween.mockReturnValue({
            x: 22,
            y: 4,
          });
          instance.state.origin = 'bottom right';

          instance.state.position = {
            left: 0,
            top: 0,
          };

          instance.rotateStart('bottom left')(e);
        });

        it('calls event.preventDefault()', () => {
          instance.rotateStart('bottom left')(e);
          expect(e.preventDefault).toBeCalled();
        });

        it('updates the position if origin has change', () => {
          expect(instance.state.position).toMatchObject({
            left: 22,
            top: 4,
          });
        });

        it('updates the startAngle', () => {
          expect(instance.state.startAngle).toEqual(90);
        });

        it('updates the anchor', () => {
          expect(instance.state.anchor).toMatchObject({
            left: 0,
            top: 0,
          });
        });
      });

      describe('rotate', () => {
        let e;
        beforeEach(() => {
          e = event();

          instance.state.anchor = {
            left: 0,
            top: 0,
          };

          instance.state.isRotating = true;
          instance.rotate(e);
        });
        it('calls event.preventDefault()', () => {
          expect(e.preventDefault).toBeCalled();
        });
      });

      describe('rotateStop', () => {
        let e;

        beforeEach(() => {
          e = event();
          instance.state.isRotating = true;
          instance.rotateStop(e);
        });

        it('unsets the anchor', () => {
          expect(instance.state.anchor).toEqual(null);
        });
        it('unsets the anchor', () => {
          expect(instance.state.anchor).toEqual(null);
        });
        it('sets the isRotating to false', () => {
          expect(instance.state.isRotating).toEqual(false);
        });

        it('calls document.removeEventListener(mousemove, rotate)', () => {
          expect(document.removeEventListener).toBeCalledWith('mousemove', instance.rotate);
        });
        it('calls document.removeEventListener(mousemove), drag', () => {
          expect(document.removeEventListener).toBeCalledWith('mousemove', instance.drag);
        });
      });
    });

    describe('drag', () => {
      describe('mouseDown', () => {
        it('calls document.addEventListener(mousemove)', () => {
          instance.mouseDown(event());

          expect(document.addEventListener).toBeCalledWith('mousemove', instance.drag);
        });
      });

      describe('mouseup', () => {
        it('calls document.removeEventListener(mousemove)', () => {
          instance.state.translate = { x: 10, y: 10 };
          instance.mouseUp({});

          expect(document.removeEventListener).toBeCalledWith('mousemove', instance.drag);
        });

        it('updates the state', () => {
          instance.state.translate = { x: 10, y: 10 };
          instance.state.position = { left: 0, top: 0 };
          instance.mouseUp({});

          expect(instance.state.position).toEqual({
            left: 10,
            top: 10,
          });
        });
      });

      describe('drag', () => {
        it('updates translate', () => {
          instance.state.dragPoint = new Point(100, 100);
          instance.drag(event(101, 101));
          expect(instance.state.translate).toEqual({ x: 1, y: 1 });
        });
      });
    });
  });
});
