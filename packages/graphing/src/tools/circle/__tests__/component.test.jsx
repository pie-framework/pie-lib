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
      root: xy(0, 0),
      edge: xy(1, 1)
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

    describe('dragRoot', () => {
      it('calls onChange', () => {
        w = wrapper();
        w.instance().dragRoot(xy(1, 1));
        expect(onChange).toHaveBeenCalledWith({
          root: xy(1, 1),
          edge: xy(1, 1)
        });
      });
    });

    describe('dragEdge', () => {
      it('calls onChange', () => {
        w.instance().dragEdge(xy(4, 4));
        expect(onChange).toHaveBeenCalledWith({
          root: xy(0, 0),
          edge: xy(4, 4)
        });
      });
    });

    describe('dragCircle', () => {
      it('calls onChange', () => {
        w.instance().dragCircle(xy(1, 1));
        expect(onChange).toHaveBeenCalledWith({
          root: xy(1, 1),
          edge: xy(2, 2)
        });
      });
    });
  });
});
