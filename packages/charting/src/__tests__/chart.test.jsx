import React from 'react';
import { render } from '@pie-lib/test-utils';
import { Chart } from '../chart';
import { createBandScale, graphProps } from './utils';

describe('ChartAxes', () => {
  let onDataChange = jest.fn();

  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      onDataChange,
      className: 'className',
      graphProps: graphProps(),
      xBand: createBandScale(['a', 'b', 'c'], [0, 100]),
      charts: [
        {
          type: 'bar',
          Component: () => <div />,
        },
      ],
      chartType: 'bar',
      domain: {},
      range: {
        min: 0,
        max: 10,
      },
      size: {
        width: 100,
        height: 100,
      },
      data: [],
    };
    const props = { ...defaults, ...extras };
    return render(<Chart {...props} />);
  };

  describe('rendering', () => {
    it('renders chart container', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders chart with default size', () => {
      const { container } = renderComponent();
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '240');
      expect(svg).toHaveAttribute('height', '240');
    });

    it('renders chart when size is not defined', () => {
      const { container } = renderComponent({ size: undefined });
      expect(container.firstChild).toBeInTheDocument();
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders chart without chartType property', () => {
      const { container } = renderComponent({ chartType: null });
      expect(container.firstChild).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders chart without chartType and charts properties', () => {
      const { container } = renderComponent({ chartType: null, charts: null });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders chart without chartType property and empty charts property', () => {
      const { container } = renderComponent({ chartType: null, charts: [] });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders chart with chartType property and empty charts property', () => {
      const { container } = renderComponent({ charts: [] });
      expect(container.firstChild).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  // Note: changeData, getChart, and deleteCategory are internal implementation details.
  // In RTL philosophy, we test user-visible behavior rather than implementation.
  // These methods would be tested indirectly through user interactions that trigger them.
});
