import { shallow } from 'enzyme/build';
import React from 'react';
import { BgVector } from '../vector';
import { graphProps } from '../../../../__tests__/utils';

describe('BgVector', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      firstEnd: {
        x: 0,
        y: 0
      },
      secondEnd: {
        x: 0,
        y: 0
      },
      graphProps: graphProps()
    };
    const props = { ...defaults, ...extras };
    return shallow(<BgVector {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {});
});
