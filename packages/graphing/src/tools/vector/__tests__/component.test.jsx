import { shallow } from 'enzyme';
import React from 'react';
import { Line } from '../component';
import { graphProps as getGraphProps } from '../../../__tests__/utils';
import { xy } from '@pie-lib/plot/lib/utils';

describe('Line', () => {
  let w;
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: getGraphProps(),
      from: xy(0, 0),
      to: xy(1, 1)
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
