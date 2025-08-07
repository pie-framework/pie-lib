import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import { Protractor } from '../index';
import React from 'react';

describe('protractor', () => {
  describe('snapshot', () => {
    it('renders', () => {
      const wrapper = shallow(<Protractor classes={{}} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
