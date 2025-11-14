import { render } from '@pie-lib/test-utils';
import React from 'react';
import { Grid } from '../grid';
import { graphProps } from './utils';

describe('Grid', () => {
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
    };
    const props = { ...defaults, ...extras };
    return render(<Grid {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
