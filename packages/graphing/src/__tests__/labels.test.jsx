import { shallow } from 'enzyme';
import React from 'react';

import Labels, { getTransform } from '../labels';

describe('Labels', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange
    };
    const props = { ...defaults, ...extras };
    return shallow(<Labels {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});

describe('getTransform', () => {
  const assertTransform = (side, expected) => {
    it(`returns ${expected} for ${side}`, () => {
      const r = getTransform('left', 100, 100);
      expect(r).toEqual('translate(-20, 50), rotate(-90)');
    });
  };

  assertTransform('left', 'translate(-20, 50), rotate(-90)');
  assertTransform('right', 'translate(130, 50), rotate(90)');
  assertTransform('top', 'translate(50, -20), rotate(0)');
  assertTransform('bottom', 'translate(50, 130), rotate(0)');
});
