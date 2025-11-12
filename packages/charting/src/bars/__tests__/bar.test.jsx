import React from 'react';
import { render } from '@pie-lib/test-utils';
import Bar, { Bar as BarChart } from '../bar';
import { graphProps } from './utils';

describe('BarChart', () => {
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
    return render(<BarChart {...props} />);
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
      const chart = Bar();

      expect(chart).toEqual({
        type: 'bar',
        Component: BarChart,
        name: 'Bar',
      });
    });
  });
});
