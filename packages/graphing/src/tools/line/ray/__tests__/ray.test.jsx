import { shallow } from 'enzyme/build';
import React from 'react';
import { RawRay } from '../ray';
import { graphProps } from '../../../../__tests__/utils';

describe('RawRay', () => {
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
        x: 1,
        y: 1
      },
      forward: {
        x: 1,
        y: 1
      },
      graphProps: graphProps()
    };
    const props = { ...defaults, ...extras };
    return shallow(<RawRay {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {});
});
