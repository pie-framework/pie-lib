import { render } from '@pie-lib/test-utils';
import React from 'react';
import { Line } from '../line';
import { graphProps } from '../../../__tests__/utils';

describe('Line', () => {
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
    };
    const props = { ...defaults, ...extras };
    return render(<Line {...props} />);
  };
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
