import { shallow } from 'enzyme';
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
      firstEnd: xy(0, 0),
      secondEnd: xy(1, 1)
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

    describe('moveFirstEnd', () => {
      it('does not call onChange', () => {
        w.instance().moveFirstEnd(xy(1, 1));
        expect(onChange).not.toHaveBeenCalledWith({
          firstEnd: xy(1, 1),
          secondEnd: xy(1, 1)
        });
      });

      it('calls onChange', () => {
        w.instance().moveFirstEnd(xy(5, 5));
        expect(onChange).toHaveBeenCalledWith({
          firstEnd: xy(5, 5),
          secondEnd: xy(1, 1)
        });
      });
    });

    describe('dragFirstEnd', () => {
      it('sets draggedFirstEnd', () => {
        w.instance().dragFirstEnd(xy(3, 3));
        expect(w.state().draggedFirstEnd).toEqual(xy(3, 3));
      });
    });

    describe('moveSecondEnd', () => {
      it('does not call onChange', () => {
        w.instance().moveSecondEnd(xy(0, 0));
        expect(onChange).not.toHaveBeenCalledWith({
          firstEnd: xy(1, 1),
          secondEnd: xy(1, 1)
        });
      });

      it('calls onChange', () => {
        w.instance().moveSecondEnd(xy(4, 4));
        expect(onChange).toHaveBeenCalledWith({
          firstEnd: xy(0, 0),
          secondEnd: xy(4, 4)
        });
      });
    });

    describe('dragSecondEnd', () => {
      it('sets draggedSecondEnd', () => {
        w.instance().dragSecondEnd(xy(3, 3));
        expect(w.state().draggedSecondEnd).toEqual(xy(3, 3));
      });
    });

    describe('dragSegment', () => {
      it('sets isSegmentDrag', () => {
        w.instance().dragSegment(xy(3, 3));
        expect(w.state().draggedFirstEnd).toEqual(xy(3, 3));
        expect(w.state().draggedSecondEnd).toEqual(xy(4, 4));
        expect(w.state().isSegmentDrag).toEqual(true);
      });
    });
    describe('moveSegment', () => {
      it('calls onChange', () => {
        w.instance().moveSegment(xy(1, 1));
        expect(onChange).toHaveBeenCalledWith({
          firstEnd: xy(1, 1),
          secondEnd: xy(2, 2)
        });
      });
    });
  });
});
