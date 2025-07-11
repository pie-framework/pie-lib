import HtmlAndMath from '../html-and-math';
import { shallow } from 'enzyme';
import React from 'react';

describe('html-and-math', () => {
  const mkWrapper = (extras) => {
    const props = {
      html: '<p>hi</p>',
      ...extras,
    };

    return shallow(<HtmlAndMath {...props} />, {
      disableLifecycleMethods: true,
    });
  };

  describe('render', () => {
    it('renders', () => {
      const w = mkWrapper();

      expect(w).toMatchSnapshot();
    });
  });
});
