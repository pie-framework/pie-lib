import React from 'react';
import { render } from '@pie-lib/test-utils';
import { Grid } from '../grid';
import { graphProps, createBandScale } from './utils';

describe('Grid', () => {
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand: createBandScale(['a', 'b', 'c'], [0, 400]),
    };
    const props = { ...defaults, ...extras };
    return render(<Grid {...props} />);
  };

  describe('rendering', () => {
    it('renders grid container', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders grid lines', () => {
      const { container } = renderComponent();
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // Check for grid line groups
      expect(container.querySelector('.vx-rows') || container.querySelector('.vx-columns')).toBeInTheDocument();
    });
  });
});
