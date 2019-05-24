import { shallow } from 'enzyme/build';
import React from 'react';
import { RawLine } from '../line';
import { graphProps } from '../../../../__tests__/utils';

describe('RawLine', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      from: {
        x: 0,
        y: 0
      },
      to: {
        x: 0,
        y: 0
      },
      forward: {
        x: 1,
        y: 1
      },
      backward: {
        x: 1,
        y: 1
      },
      graphProps: graphProps()
    };
    const props = { ...defaults, ...extras };
    return shallow(<RawLine {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {});
});
