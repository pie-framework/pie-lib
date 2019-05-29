import { shallow } from 'enzyme';
import React from 'react';
import { graphProps } from '../../../__tests__/utils';

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
});
