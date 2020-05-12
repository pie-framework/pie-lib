import { shallow } from 'enzyme';
import React from 'react';

import ToolMenu from '../tool-menu';

describe('ToolMenu', () => {
  let w;
  let onChange = jest.fn();
  const tools = ['one', 'two'];

  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      currentTool: tools[0],
      tools
    };
    const props = { ...defaults, ...extras };
    return shallow(<ToolMenu {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});
