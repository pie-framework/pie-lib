import { render } from '@pie-lib/test-utils';
import React from 'react';

import Labels, { getTransform } from '../labels';
import { graphProps } from './utils';

describe('Labels', () => {
  let onChange = jest.fn();

  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: graphProps(),
    };
    const props = { ...defaults, ...extras };
    return render(<Labels {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

describe('getTransform', () => {
  const assertTransform = (side, expected) => {
    it(`returns ${expected} for ${side}`, () => {
      const r = getTransform('left', 100, 100);
      expect(r).toEqual('translate(-20, 50), rotate(-90)');
    });
  };

  assertTransform('left', 'translate(-20, 50), rotate(-90)');
  assertTransform('right', 'translate(130, 50), rotate(90)');
  assertTransform('top', 'translate(50, -20), rotate(0)');
  assertTransform('bottom', 'translate(50, 130), rotate(0)');
});
