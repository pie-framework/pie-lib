import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import { Rotatable } from '../rotatable';
import React from 'react';
/** Note: we use the test renderer because we need to make use of ref mocking. */
import TestRenderer from 'react-test-renderer'; // ES6
import { distanceBetween } from '../anchor-utils';

import Point from '@mapbox/point-geometry';

jest.mock('../anchor-utils', () => ({
  distanceBetween: jest.fn(() => ({ x: 2, y: 2 })),
  toPoint: jest.fn(() => ({ x: 0, y: 0 })),
  getAnchor: jest.fn(() => ({ left: 0, top: 0 })),
  toDegrees: jest.fn(() => 90),
  arctangent: jest.fn(() => 90)
}));

const event = (x = 0, y = 0) => ({
  pageX: x,
  pageY: y,
  clientX: x,
  clientY: y,
  preventDefault: jest.fn()
});

describe('rotatable', () => {
  describe('snapshot', () => {
    it('renders', () => {
      const wrapper = shallow(<Rotatable classes={{}}>foo</Rotatable>);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders with transforms', () => {
      const wrapper = shallow(<Rotatable classes={{}}>foo</Rotatable>);

      wrapper.setState({
        translate: {
          x: 10,
          y: 10
        },
        rotation: 10,
        origin: 'bottom left'
      });
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let wrapper, el, instance;

    beforeEach(() => {
      el = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      };
      wrapper = TestRenderer.create(
        <Rotatable
          handle={[{ class: 'foo', origin: 'bottom left' }]}
          classes={{ rotatable: 'rotatable' }}
        >
          <div className={'foo'}>foo</div>
        </Rotatable>,
        {
          createNodeMock: e => {
            if (e.props.className === 'rotatable') {
              return {
                querySelector: jest.fn(() => el),
                getBoundingClientRect: jest.fn(() => ({
                  left: 0,
                  top: 0,
                  width: 100,
                  height: 100
                }))
              };
            }
          }
        }
      );

      document.addEventListener = jest.fn();
      document.removeEventListener = jest.fn();
      instance = wrapper.root.instance;
    });

    describe('rotate', () => {
      describe('init', () => {
        it('call el.addEventListener(mousedown)', () => {
          expect(el.addEventListener).toBeCalledWith(
            'mousedown',
            expect.anything()
          );
        });
        it('call el.addEventListener(mouseup)', () => {
          expect(el.addEventListener).toBeCalledWith(
            'mouseup',
            instance.rotateStop
          );
        });
      });

      describe('rotateStart', () => {
        let e;
        beforeEach(() => {
          e = event();

          distanceBetween.mockReturnValue({
            x: 22,
            y: 4
          });
          instance.state.origin = 'bottom right';

          instance.state.position = {
            left: 0,
            top: 0
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
            top: 4
          });
        });

        it('updates the startAngle', () => {
          expect(instance.state.startAngle).toEqual(90);
        });

        it('updates the anchor', () => {
          expect(instance.state.anchor).toMatchObject({
            left: 0,
            top: 0
          });
        });
      });

      describe('rotate', () => {
        let e;
        beforeEach(() => {
          e = event();

          instance.state.anchor = {
            left: 0,
            top: 0
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
          expect(document.removeEventListener).toBeCalledWith(
            'mousemove',
            instance.rotate
          );
        });
        it('calls document.removeEventListener(mousemove), drag', () => {
          expect(document.removeEventListener).toBeCalledWith(
            'mousemove',
            instance.drag
          );
        });
      });
    });

    describe('drag', () => {
      describe('mouseDown', () => {
        it('calls document.addEventListener(mousemove)', () => {
          instance.mouseDown(event());

          expect(document.addEventListener).toBeCalledWith(
            'mousemove',
            instance.drag
          );
        });
      });

      describe('mouseup', () => {
        it('calls document.removeEventListener(mousemove)', () => {
          instance.state.translate = { x: 10, y: 10 };
          instance.mouseUp({});

          expect(document.removeEventListener).toBeCalledWith(
            'mousemove',
            instance.drag
          );
        });

        it('updates the state', () => {
          instance.state.translate = { x: 10, y: 10 };
          instance.state.position = { left: 0, top: 0 };
          instance.mouseUp({});

          expect(instance.state.position).toEqual({
            left: 10,
            top: 10
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
