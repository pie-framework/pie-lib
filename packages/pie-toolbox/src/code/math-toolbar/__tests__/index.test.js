import { RawPureToolbar } from '../index';
import { shallow } from 'enzyme';
import React from 'react';

describe('snapshot', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = (extras) => {
      const defaults = {
        classes: {},
        controlledKeypad: true,
        showKeypad: true,
      };
      const props = { ...defaults, ...extras };

      return shallow(<RawPureToolbar {...props} />);
    };
  });

  it('renders with DONE button if hideDoneButton is not defined', () => {
    expect(wrapper()).toMatchSnapshot();
  });

  it('renders without DONE button if hideDoneButton value is true', () => {
    expect(wrapper({ hideDoneButton: true })).toMatchSnapshot();
  });
});
