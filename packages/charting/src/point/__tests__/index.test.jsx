import React from 'react';
import { shallow, configure } from 'enzyme';
import _ from 'lodash';
import { context as buildContext } from './mock-context';
import Adapter from 'enzyme-adapter-react-16';
import { Point } from '../index';
import Draggable from '../draggable';

configure({ adapter: new Adapter() });

export const assertProp = (getEl, name, expected) => {
  it(`sets ${name} to ${expected}`, () => {
    let el = getEl();
    expect(el.prop(name)).toEqual(expected);
  });
};

describe('point', () => {
  let wrapper, w;

  const mkWrapper = (props, context) => {
    const onMove = jest.fn();
    const onClick = jest.fn();
    const onDragStart = jest.fn();
    const onDragStop = jest.fn();
    const onDrag = jest.fn();

    const defaults = {
      interval: 10,
      position: 1,
      bounds: {
        left: -1,
        right: 9,
        top: 0,
        bottom: 0
      },
      selected: false,
      disabled: false,
      correct: false,
      empty: false,
      y: 0,
      x: 0,
      classes: {
        point: 'point',
        selected: 'selected',
        correct: 'correct',
        incorrect: 'incorrect',
        empty: 'empty'
      },
      onMove,
      onClick,
      onDragStart,
      onDragStop,
      onDrag
    };

    props = Object.assign({}, defaults, props);

    context = Object.assign({}, buildContext(), context);

    const opts = {
      context
    };

    return shallow(<Point {...props} />, opts);
  };

  describe('className', () => {
    const f = opts => () => mkWrapper(opts).find('g');

    assertProp(f({ selected: true }), 'className', 'point selected incorrect');
    assertProp(f({ selected: false }), 'className', 'point incorrect');
    assertProp(
      f({ selected: true, correct: true }),
      'className',
      'point selected correct'
    );
    assertProp(
      f({ empty: true, selected: true, correct: true }),
      'className',
      'point selected correct empty'
    );
  });

  describe('Draggable', () => {
    const f = opts => () => mkWrapper(opts).find(Draggable);
    assertProp(f(), 'axis', 'both');
    assertProp(f(), 'grid', [10, 10]);
    assertProp(f(), 'bounds', { left: -1, right: 9, bottom: 0, top: 0 });

    describe('onStart', () => {
      beforeEach(() => {
        w = mkWrapper();
        w.find(Draggable).prop('onStart')({ clientX: 0 });
      });

      it('sets state.startX', () => {
        expect(w.state('startX')).toEqual(0);
      });

      it('calls onDragStart callback', () => {
        const fn = w.instance().props.onDragStart;
        expect(fn.mock.calls.length).toEqual(1);
      });
    });

    describe('onStop', () => {
      beforeEach(() => {
        w = mkWrapper({ position: 1 });
        w.setState({ startX: 0 });
        w.find(Draggable).prop('onStop')(
          { clientX: 100, clientY: 100 },
          { lastX: 101, lastY: 101 }
        );
      });

      it('calls onDragStop callback', () => {
        const fn = w.instance().props.onDragStop;
        expect(fn.mock.calls.length).toEqual(1);
      });

      it('calls onMove callback', () => {
        const fn = w.instance().props.onMove;
        expect(fn.mock.calls[0][0]).toEqual({ x: 101, y: 101 });
      });
    });

    describe('onDrag', () => {
      beforeEach(() => {
        w = mkWrapper();
        w.find(Draggable).prop('onDrag')({}, { x: 11, y: 11 });
      });

      it('calls onDrag callback', () => {
        const fn = w.instance().props.onDrag;
        expect(fn.mock.calls[0][0]).toEqual({ x: 11, y: 11 });
      });
    });
  });
});
