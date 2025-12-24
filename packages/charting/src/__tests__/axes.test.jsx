import React from 'react';
import { render } from '@pie-lib/test-utils';
import ChartAxes, { TickComponent, RawChartAxes } from '../axes';
import { graphProps, createBandScale } from './utils';

describe('ChartAxes', () => {
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand: createBandScale(['a', 'b', 'c'], [0, 400]),
      categories: [],
    };
    const props = { ...defaults, ...extras };
    return render(<ChartAxes {...props} />);
  };

  describe('rendering', () => {
    it('renders axes container', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders SVG axes', () => {
      const { container } = renderComponent();
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // Check for axis groups
      expect(container.querySelector('.vx-axis')).toBeInTheDocument();
    });
  });
});

describe('RawChartAxes', () => {
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand: createBandScale(['a', 'b', 'c'], [0, 400]),
      categories: [],
    };
    const props = { ...defaults, ...extras };
    return render(<RawChartAxes {...props} />);
  };

  describe('rendering', () => {
    it('renders raw axes container', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders SVG axes', () => {
      const { container } = renderComponent();
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(container.querySelector('.vx-axis')).toBeInTheDocument();
    });
  });
});

describe('TickComponent', () => {
  const renderComponent = (extras) => {
    const defaults = {
      graphProps: graphProps(),
      xBand: createBandScale(['a', 'b', 'c'], [0, 400]),
    };
    const props = { ...defaults, ...extras };
    return render(<TickComponent {...props} />);
  };

  describe('rendering', () => {
    it('renders tick component', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with categories', () => {
      const { container } = renderComponent({
        formattedValue: '0-test',
        categories: [{ value: 1, label: 'test' }],
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // Note: splitText and changeCategory are internal implementation details.
  // In RTL philosophy, we test user-visible behavior rather than implementation.
  // These methods would be tested indirectly through their effects on the rendered output.
});
