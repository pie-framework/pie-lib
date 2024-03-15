import { shallow } from 'enzyme';
import React from 'react';
import { Line } from '../line';
import { graphProps } from '../../../__tests__/utils';

describe('Line', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
    };
    const props = { ...defaults, ...extras };
    return shallow(<Line {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {});
});
