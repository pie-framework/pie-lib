import { shallow } from 'enzyme';
import React from 'react';
import { KeyPad } from '../index';

describe('Keypad', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      onPress: jest.fn(),
    };
    const props = { ...defaults, ...extras };
    return shallow(<KeyPad {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});
