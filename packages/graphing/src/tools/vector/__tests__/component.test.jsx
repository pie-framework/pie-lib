import { shallow } from 'enzyme';
import React from 'react';
import { Line } from '../component';
import { graphProps as getGraphProps } from '../../../__tests__/utils';
import { utils } from '@pie-lib/plot';

describe('Line', () => {
  let w;
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: getGraphProps(),
      from: utils.xy(0, 0),
      to: utils.xy(1, 1)
    };
    const props = { ...defaults, ...extras };
    return shallow(<Line {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});
