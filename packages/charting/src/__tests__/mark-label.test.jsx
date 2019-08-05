import { shallow } from 'enzyme';
import React from 'react';
import { MarkLabel } from '../mark-label';
import { graphProps as getGraphProps } from '../__tests__/utils';

describe('MarkLabel', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      mark: { x: 1, y: 1 },
      graphProps: getGraphProps(0, 10, 0, 10)
    };
    const props = { ...defaults, ...extras };
    return shallow(<MarkLabel {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
    it('renders', () => {
      w = wrapper({ mark: { x: 10, y: 10 } });
      expect(w).toMatchSnapshot();
    });
  });
});
