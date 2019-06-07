import { shallow } from 'enzyme';
import React from 'react';
describe('MarkLabel', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange
    };
    const props = { ...defaults, ...extras };
    return shallow(<MarkLabel {...props} />);
  };
  describe('snapshot', () => {
    it.todo('renders');
  });
});
