import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import { Graphic } from '../graphic';
import React from 'react';

describe('graphic', () => {
  describe('snapshot', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Graphic
          width={300}
          height={100}
          units={12}
          unit={{
            type: 'in'
          }}
          classes={{ bg: 'bg' }}
        />
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
