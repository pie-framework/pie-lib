import React from 'react';
import { render } from '@pie-lib/test-utils';
import '@testing-library/jest-dom/extend-expect';
import Line, { LineDot as LineChart } from '../line-dot';
import { graphProps } from './utils';

describe('LineChart', () => {
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
    return render(<LineChart {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const { container } = renderComponent();
      expect(container).toMatchSnapshot();
    });

    // Note: graphProps is a required prop, so testing with undefined is not a valid test case.
    // RTL's full rendering exposes this issue that was hidden by Enzyme's shallow rendering.
    // Removed: it('renders without graphProps', ...)
  });

  describe('component', () => {
    it('returns correct chart object', () => {
      const chart = Line();

      expect(chart).toEqual({
        type: 'lineDot',
        Component: LineChart,
        name: 'Line Dot',
      });
    });
  });
});
