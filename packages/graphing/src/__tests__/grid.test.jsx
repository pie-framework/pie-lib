import { shallow } from 'enzyme';
import React from 'react';
import { Grid } from '../grid';
import { graphProps } from '../__tests__/utils';

describe('Grid', () => {
  let w;
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps()
    };
    const props = { ...defaults, ...extras };
    return shallow(<Grid {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());
  });
});
