import React from 'react';
import { render } from '@pie-lib/test-utils';
import '@testing-library/jest-dom/extend-expect';
import Histogram, { Histogram as HistogramChart } from '../histogram';
import { graphProps } from './utils';

describe('HistogramChart', () => {
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand: () => {
        return {
          bandwidth: () => {},
        };
      },
    };
    const props = { ...defaults, ...extras };
    return render(<HistogramChart {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const { container } = renderComponent();
      expect(container).toMatchSnapshot();
    });

    it('renders without graphProps', () => {
      const { container } = renderComponent({ graphProps: undefined });
      expect(container).toMatchSnapshot();
    });
  });

  describe('component', () => {
    it('returns correct chart object', () => {
      const chart = Histogram();

      expect(chart).toEqual({
        type: 'histogram',
        Component: HistogramChart,
        name: 'Histogram',
      });
    });
  });
});
