import { shallow } from 'enzyme';
import React from 'react';
import { BgCircle } from '../bg-circle';
import { graphProps } from '../../../__tests__/utils';

describe('BgCircle', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      x: 0,
      y: 0,
      graphProps: graphProps(),
    };
    const props = { ...defaults, ...extras };
    return shallow(<BgCircle {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {});
});
