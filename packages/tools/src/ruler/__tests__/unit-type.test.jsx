import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import { UnitType } from '../unit-type';
import React from 'react';

describe('unit-type', () => {
  describe('snapshot', () => {
    it('renders', () => {
      const wrapper = shallow(<UnitType classes={{}} label={'cm'} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
