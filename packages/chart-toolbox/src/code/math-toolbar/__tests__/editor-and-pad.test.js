import { EditorAndPad } from '../editor-and-pad';
import { shallow } from 'enzyme';
import React from 'react';

describe('snapshot', () => {
  let wrapper;
  let onBlur = jest.fn();

  beforeAll(() => {
    wrapper = (extras) => {
      const defaults = {
        classes: {},
        classNames: {},
        onBlur,
      };
      const props = { ...defaults, ...extras };

      return shallow(<EditorAndPad {...props} />);
    };
  });

  it('renders', () => {
    expect(wrapper()).toMatchSnapshot();
  });
});
