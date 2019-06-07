import { shallow } from 'enzyme';
import React from 'react';
import { ArrowHead, ArrowMarker } from '../arrow-head';
describe('ArrowHead', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = { size: 10, transform: '' };
    const props = { ...defaults, ...extras };
    return shallow(<ArrowHead {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});

describe('ArrowMarker', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = { id: 'id', size: 10, className: 'className' };
    const props = { ...defaults, ...extras };
    return shallow(<ArrowMarker {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      const w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});
