import { Token } from '../token';
import { shallow } from 'enzyme';
import React from 'react';

describe('token', () => {
  describe('snapshot', () => {
    it('renders', () => {
      const w = shallow(
        <Token
          classes={{
            token: 'token',
            selectable: 'selectable'
          }}
        />
      );
      expect(w).toMatchSnapshot();
    });
  });
});
