import { render } from '@pie-lib/test-utils';
import React from 'react';
import { BgCircle } from '../bg-circle';
import { graphProps } from '../../../__tests__/utils';

describe('BgCircle', () => {
  let onChange = jest.fn();
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      x: 0,
      y: 0,
      graphProps: graphProps(),
    };
    const props = { ...defaults, ...extras };
    return render(<BgCircle {...props} />);
  };
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
