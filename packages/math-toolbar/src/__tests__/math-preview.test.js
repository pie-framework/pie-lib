import React from 'react';
import { shallow } from 'enzyme';

import MathPreview from '../math-preview';

describe('snapshot', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = (extras) => {
      const defaults = {
        node: {
          data: {
            get: jest.fn().mockReturnValue('sqrt(5)'),
          },
        },
        classes: {},
        isSelected: false,
        onFocus: jest.fn(),
        onBlur: jest.fn(),
      };
      const props = { ...defaults, ...extras };

      return shallow(<MathPreview {...props} />);
    };
  });

  it('renders', () => {
    expect(wrapper()).toMatchSnapshot();
  });
});
