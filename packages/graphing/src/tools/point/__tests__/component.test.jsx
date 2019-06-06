import { shallow } from 'enzyme';
import React from 'react';
import { graphProps, xy } from '../../../__tests__/utils';

import Component from '../component';

describe('Component', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: graphProps()
    };
    const props = { ...defaults, ...extras };
    return shallow(<Component {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('move', () => {
      it('calls onChange', () => {
        const w = wrapper({ mark: { ...xy(0, 0) } });
        w.instance().move({ x: 1, y: 1 });
        expect(w.state('mark')).toMatchObject({ ...xy(1, 1) });
      });
    });

    describe('labelChange', () => {
      it.todo('calls onChange');
    });

    describe('clickPoint', () => {
      it.todo('calls onChange');
    });
  });
});
