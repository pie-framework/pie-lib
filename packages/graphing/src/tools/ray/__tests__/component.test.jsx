import { shallow } from 'enzyme';
import React from 'react';
import { RayLine } from '../component';
import { graphProps as getGraphProps } from '../../../__tests__/utils';
import { xy } from '@pie-lib/plot/lib/utils';
describe('RayLine', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      markerId: '1',
      graphProps: getGraphProps(),
      from: xy(0, 0),
      to: xy(1, 1)
    };
    const props = { ...defaults, ...extras };
    return shallow(<RayLine {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});
