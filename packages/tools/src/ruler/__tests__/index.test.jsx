import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import { Ruler } from '../index';
import RulerGraphic from '../graphic';
import React from 'react';

describe('ruler', () => {
  describe('snapshot', () => {
    it('renders', () => {
      const wrapper = shallow(<Ruler classes={{}} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('sets unit for imperial', () => {
      const wrapper = shallow(
        <Ruler measure={'imperial'} classes={{}} label={'in'} />
      );
      const r = wrapper.find(RulerGraphic);
      expect(r.prop('unit')).toEqual({ ticks: 16, type: 'in' });
    });

    it('sets unit for metric', () => {
      const wrapper = shallow(
        <Ruler measure={'metric'} classes={{}} label={'cm'} />
      );
      const r = wrapper.find(RulerGraphic);
      expect(r.prop('unit')).toEqual({ ticks: 10, type: 'cm' });
    });
  });
});
