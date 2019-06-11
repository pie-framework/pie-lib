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
      from: xy(0, 0),
      to: xy(1, 1)
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

    describe('dragFrom', () => {
      it('calls onChange', () => {
        w = wrapper();
        w.instance().dragFrom(xy(1, 1));
        expect(onChange).toHaveBeenCalledWith({
          from: xy(1, 1),
          to: xy(1, 1)
        });
      });
    });

    describe('dragTo', () => {
      it('calls onChange', () => {
        w.instance().dragTo(xy(4, 4));
        expect(onChange).toHaveBeenCalledWith({
          from: xy(0, 0),
          to: xy(4, 4)
        });
      });
    });

    describe('dragCircle', () => {
      it('calls onChange', () => {
        w.instance().dragCircle(xy(1, 1));
        expect(onChange).toHaveBeenCalledWith({
          from: xy(1, 1),
          to: xy(2, 2)
        });
      });
    });
  });
});
