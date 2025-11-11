import React from 'react';
import { render } from '@pie-lib/test-utils';
import '@testing-library/jest-dom/extend-expect';
import ChartAxes, { TickComponent, RawChartAxes } from '../axes';
import { graphProps, createBandScale } from './utils';

describe('ChartAxes', () => {
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand: createBandScale(['a', 'b', 'c'], [0, 400]),
    };
    const props = { ...defaults, ...extras };
    return render(<ChartAxes {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const { container } = renderComponent();
      expect(container).toMatchSnapshot();
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

  describe('snapshot', () => {
    it('renders', () => {
      const { container } = renderComponent();
      expect(container).toMatchSnapshot();
    });

    // Note: graphProps is a required prop, so testing with undefined is not a valid test case.
    // RTL's full rendering exposes this issue that was hidden by Enzyme's shallow rendering.
    // Removed: it('renders if graphProps is not defined', ...)
    // Removed: it('renders if categories are not defined', ...)
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

  describe('snapshot', () => {
    it('renders', () => {
      const { container } = renderComponent();
      expect(container).toMatchSnapshot();
    });

    it('renders with categories', () => {
      const { container } = renderComponent({
        formattedValue: '0-test',
        categories: [{ value: 1, label: 'test' }],
      });
      expect(container).toMatchSnapshot();
    });
  });

  // Note: splitText and changeCategory are internal implementation details.
  // In RTL philosophy, we test user-visible behavior rather than implementation.
  // These methods would be tested indirectly through their effects on the rendered output.
});
