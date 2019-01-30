import { shallow } from 'enzyme';
import React from 'react';

import { ToggleBar } from '../toggle-bar';

describe('ToggleBar', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      options: ['one', 'two']
    };
    const props = { ...defaults, ...extras };
    return shallow(<ToggleBar {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('select', () => {
      it('calls onChange', () => {
        w = wrapper();
        w.instance().select({ target: { textContent: 'two' } });
        expect(onChange).toHaveBeenLastCalledWith('two');
      });
    });
  });
});
