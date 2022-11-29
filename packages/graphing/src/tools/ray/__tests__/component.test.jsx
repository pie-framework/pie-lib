import { shallow } from 'enzyme';
import React from 'react';
import { RayLine } from '../component';
import { graphProps as getGraphProps } from '../../../__tests__/utils';
import { utils } from '@pie-lib/plot';
describe('RayLine', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      markerId: '1',
      graphProps: getGraphProps(),
      from: utils.xy(0, 0),
      to: utils.xy(1, 1),
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
