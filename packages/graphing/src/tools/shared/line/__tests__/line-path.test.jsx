import { shallow } from 'enzyme';
import React from 'react';
describe('LinePath', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange
    };
    const props = { ...defaults, ...extras };
    return shallow(<LinePath {...props} />);
  };
  describe('snapshot', () => {
    it.todo('renders');
  });
});
