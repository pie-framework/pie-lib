import React from 'react';
import { render } from '@pie-lib/test-utils';
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

  describe('rendering', () => {
    it('renders line dot chart', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
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
