import { shallow } from 'enzyme';
import React from 'react';
import { graphProps, xy } from '../../../__tests__/utils';

import { RawBaseCircle } from '../component';

describe('Component', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: graphProps(),
      center: xy(0, 0),
      outerPoint: xy(1, 1)
    };
    const props = { ...defaults, ...extras };
    return shallow(<RawBaseCircle {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {
    beforeEach(() => (w = wrapper()));

    describe('moveCenter', () => {
      it('calls onChange', () => {
        w.instance().moveCenter(xy(1, 1));
        expect(onChange).toHaveBeenCalledWith({
          center: xy(1, 1),
          outerPoint: xy(1, 1)
        });
      });
    });

    describe('dragCenter', () => {
      it('sets draggedCenter', () => {
        w.instance().dragCenter(xy(3, 3));
        expect(w.state().draggedCenter).toEqual(xy(3, 3));
      });
    });

    describe('moveOuter', () => {
      it('calls onChange', () => {
        w.instance().moveOuter(xy(4, 4));
        expect(onChange).toHaveBeenCalledWith({
          center: xy(0, 0),
          outerPoint: xy(4, 4)
        });
      });
    });

    describe('dragOuter', () => {
      it('sets draggedOuter', () => {
        w.instance().dragOuter(xy(3, 3));
        expect(w.state().draggedOuter).toEqual(xy(3, 3));
      });
    });

    describe('dragCircle', () => {
      it('sets draggedCircle', () => {
        w.instance().dragCircle(xy(3, 3));
        expect(w.state().draggedCenter).toEqual(xy(3, 3));
        expect(w.state().draggedOuter).toEqual(xy(4, 4));
      });
    });
    describe('moveCircle', () => {
      it('calls onChange', () => {
        w.instance().moveCircle(xy(1, 1));
        expect(onChange).toHaveBeenCalledWith({
          center: xy(1, 1),
          outerPoint: xy(2, 2)
        });
      });
    });
  });
});
