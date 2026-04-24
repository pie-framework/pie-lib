import React from 'react';
import { render } from '@pie-lib/test-utils';
import { Grid } from '../grid';
import { createBandScale, graphProps } from './utils';

describe('Grid', () => {
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand: createBandScale(['a', 'b', 'c'], [0, 400]),
    };
    const props = { ...defaults, ...extras };
    return render(
      <svg>
        <Grid {...props} />
      </svg>,
    );
  };

  describe('rendering', () => {
    it('renders grid container', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders grid with SVG group', () => {
      const { container } = renderComponent();
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // Grid renders a <g> element (StyledGridGroup)
      const gridGroup = container.querySelector('g');
      expect(gridGroup).toBeInTheDocument();
    });
  });
});
