import * as React from 'react';
import { shallow } from 'enzyme';

export function shallowChild(Component, defaultProps = {}, nestLevel) {
  return function innerRender(props = {}) {
    let rendered = shallow(<Component {...defaultProps} {...props} />);

    if (nestLevel) {
      let repeat = nestLevel;

      while (repeat--) {
        rendered = rendered.first().shallow();
      }
    }

    return rendered;
  };
}
