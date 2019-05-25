import { shallow } from 'enzyme/build';
import React from 'react';
import { graphProps, xy } from '../../../__tests__/utils';

import { RawBaseSegment } from '../component';

describe('Component', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: graphProps(),
      from: xy(0, 0),
      to: xy(1, 1)
    };
    const props = { ...defaults, ...extras };
    return shallow(<RawBaseSegment {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {
    beforeEach(() => (w = wrapper()));

    describe('moveFrom', () => {
      it('does not call onChange', () => {
        w.instance().moveFrom(xy(1, 1));
        expect(onChange).not.toHaveBeenCalledWith({
          from: xy(1, 1),
          to: xy(1, 1)
        });
      });

      it('calls onChange', () => {
        w.instance().moveFrom(xy(5, 5));
        expect(onChange).toHaveBeenCalledWith({
          from: xy(5, 5),
          to: xy(1, 1)
        });
      });
    });

    describe('dragFrom', () => {
      it('sets draggedFrom', () => {
        w.instance().dragFrom(xy(3, 3));
        expect(w.state().draggedFrom).toEqual(xy(3, 3));
      });
    });

    describe('moveTo', () => {
      it('does not call onChange', () => {
        w.instance().moveTo(xy(0, 0));
        expect(onChange).not.toHaveBeenCalledWith({
          from: xy(1, 1),
          to: xy(1, 1)
        });
      });

      it('calls onChange', () => {
        w.instance().moveTo(xy(4, 4));
        expect(onChange).toHaveBeenCalledWith({
          from: xy(0, 0),
          to: xy(4, 4)
        });
      });
    });

    describe('dragTo', () => {
      it('sets draggedTo', () => {
        w.instance().dragTo(xy(3, 3));
        expect(w.state().draggedTo).toEqual(xy(3, 3));
      });
    });

    describe('dragSegment', () => {
      it('sets isSegmentDrag', () => {
        w.instance().dragSegment(xy(3, 3));
        expect(w.state().draggedFrom).toEqual(xy(3, 3));
        expect(w.state().draggedTo).toEqual(xy(4, 4));
        expect(w.state().isSegmentDrag).toEqual(true);
      });
    });

    describe('moveSegment', () => {
      it('calls onChange', () => {
        w.instance().moveSegment(xy(1, 1));
        expect(onChange).toHaveBeenCalledWith({
          from: xy(1, 1),
          to: xy(2, 2)
        });
      });
    });

    describe('getDirectionPoint', () => {
      const w = wrapper({
        graphProps: {
          ...graphProps(),
          domain: {
            min: -14,
            max: 10,
            step: 1
          },
          range: {
            min: -14,
            max: 14,
            step: 1
          }
        },
        from: xy(0, 0),
        to: xy(2, 2)
      });

      const assertDirectionPoint = (from, to, rayPosition, expected) => {
        it(`${from.x},${from.y} ${to.x},${to.y} => ${expected.x},${expected.y}`, () => {
          const result = w.instance().getDirectionPoint(from, to, rayPosition);

          expect(result).toEqual(expected);
        });
      };

      const assertDirectionPointWhileDragging = (from, to, rayPosition, expected) => {
        it(`${from.x},${from.y} ${to.x},${to.y} => ${expected.x},${expected.y}`, () => {
          w.instance().setState({
            isSegmentDrag: true,
            draggedFrom: { x: -1, y: 0 },
            draggedTo: { x: 1, y: 2 }
          });

          const result = w.instance().getDirectionPoint(from, to, rayPosition);
          expect(result).toEqual(expected);
        });
      };

      describe('not dragging', () => {
        assertDirectionPoint({ x: 0, y: 0 }, { x: 2, y: 2 }, 'forward', {
          x: -14,
          y: -14
        });
        assertDirectionPoint({ x: 0, y: 0 }, { x: 2, y: 2 }, 'backward', { x: 10, y: 10 });
      });

      describe('dragging', () => {
        assertDirectionPointWhileDragging({ x: 0, y: 0 }, { x: 2, y: 2 }, 'forward', {
          x: -13,
          y: -13
        });
        assertDirectionPointWhileDragging({ x: 0, y: 0 }, { x: 2, y: 2 }, 'backward', {
          x: 11,
          y: 11
        });
      });
    });
  });
});
