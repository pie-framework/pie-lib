import { shallow } from 'enzyme';
import React from 'react';
import { graphProps } from '../../__tests__/utils';

import { RawXAxis, RawYAxis } from '../axes';

describe('RawXAxis', () => {
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
    return shallow(<RawXAxis {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});

describe('RawYAxis', () => {
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
    return shallow(<RawYAxis {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});
