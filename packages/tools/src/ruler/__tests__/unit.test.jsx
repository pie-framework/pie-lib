import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import { Unit } from '../unit';
import React from 'react';

describe('unit', () => {
  describe('snapshot', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Unit
          index={2}
          width={30}
          height={20}
          last={false}
          config={{ ticks: 10 }}
          classes={{}}
        />
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
