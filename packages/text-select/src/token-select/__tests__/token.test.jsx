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
          text={'foo bar'}
        />
      );
      expect(w).toMatchSnapshot();
    });

    it('renders with brs', () => {
      const w = shallow(
        <Token
          classes={{
            token: 'token',
            selectable: 'selectable'
          }}
          text={'foo \nbar'}
        />
      );
      expect(w).toMatchSnapshot();
    });
  });
});
