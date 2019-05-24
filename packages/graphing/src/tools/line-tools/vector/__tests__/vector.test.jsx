import { shallow } from 'enzyme/build';
import React from 'react';
import { RawVector } from '../vector';
import { graphProps } from '../../../../__tests__/utils';

describe('RawVector', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      from: {
        x: 0,
        y: 0
      },
      to: {
        x: 0,
        y: 0
      },
      graphProps: graphProps()
    };
    const props = { ...defaults, ...extras };
    return shallow(<RawVector {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {});
});
