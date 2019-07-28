import { shallow } from 'enzyme';
import React from 'react';
import ChartAxes from '../axes';
import { graphProps } from '../__tests__/utils';

describe('ChartAxes', () => {
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand: {
        bandwidth: () => {}
      }
    };
    const props = { ...defaults, ...extras };
    return shallow(<ChartAxes {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => expect(wrapper()).toMatchSnapshot());
  });
});
