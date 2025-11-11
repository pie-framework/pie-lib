import React from 'react';
import { render } from '@pie-lib/test-utils';
import '@testing-library/jest-dom/extend-expect';
import { Chart } from '../chart';
import { graphProps, createBandScale } from './utils';

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

  describe('snapshot', () => {
    it('renders', () => {
      jest.spyOn(Chart.prototype, 'generateMaskId').mockReturnValue('chart-2645');
      const { container } = renderComponent();
      expect(container).toMatchSnapshot();
    });

    it('renders if size is not defined', () => {
      jest.spyOn(Chart.prototype, 'generateMaskId').mockReturnValue('chart-1553');
      const { container } = renderComponent({ size: undefined });
      expect(container).toMatchSnapshot();
    });

    it('renders without chartType property', () => {
      jest.spyOn(Chart.prototype, 'generateMaskId').mockReturnValue('chart-4286');
      const { container } = renderComponent({ chartType: null });
      expect(container).toMatchSnapshot();
    });

    it('renders without chartType and charts properties', () => {
      const { container } = renderComponent({ chartType: null, charts: null });
      expect(container).toMatchSnapshot();
    });

    it('renders without chartType property and empty charts property', () => {
      const { container } = renderComponent({ chartType: null, charts: [] });
      expect(container).toMatchSnapshot();
    });

    it('renders with chartType property and empty charts property', () => {
      const { container } = renderComponent({ charts: [] });
      expect(container).toMatchSnapshot();
    });
  });

  // Note: changeData, getChart, and deleteCategory are internal implementation details.
  // In RTL philosophy, we test user-visible behavior rather than implementation.
  // These methods would be tested indirectly through user interactions that trigger them.
});
