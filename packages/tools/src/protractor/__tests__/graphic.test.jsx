import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import { Graphic } from '../graphic';
import React from 'react';

describe('graphic', () => {
  describe('snapshot', () => {
    it('renders', () => {
      const wrapper = shallow(
        <Graphic classes={{ path: 'path', line: 'line', circle: 'circle' }} />
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
