import { shallow } from 'enzyme';
import React from 'react';
import { Arrow } from '../arrow';

describe('Arrow', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      scale: {
        x: jest.fn((n) => n),
        y: jest.fn((n) => n),
      },
    };
    const props = { ...defaults, ...extras };
    return shallow(<Arrow {...props} />);
  };
  describe('snapshot', () => {
    it('up', () => {
      w = wrapper({ direction: 'up' });
      expect(w).toMatchSnapshot();
    });
    it('down', () => {
      w = wrapper({ direction: 'down' });
      expect(w).toMatchSnapshot();
    });
    it('left', () => {
      w = wrapper({ direction: 'left' });
      expect(w).toMatchSnapshot();
    });
    it('right', () => {
      w = wrapper({ direction: 'right' });
      expect(w).toMatchSnapshot();
    });
  });
});
