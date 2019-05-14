import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import { Collapsible } from '../index';
import React from 'react';

describe('protractor', () => {
  describe('snapshot', () => {
    it('renders', () => {
      const wrapper = shallow(<Collapsible classes={{}} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
