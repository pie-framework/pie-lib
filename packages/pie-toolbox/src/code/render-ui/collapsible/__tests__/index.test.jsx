import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme/build';
import { Collapsible } from '../index';
import React from 'react';

describe('collapsible', () => {
  describe('snapshot', () => {
    it('renders', () => {
      const wrapper = shallow(<Collapsible classes={{}} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
