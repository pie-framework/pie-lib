import React from 'react';
import { render } from '@pie-lib/test-utils';
import Line, { LineCross as LineChart } from '../line-cross';
import { graphProps } from './utils';

describe('LineChart', () => {
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      data: [],
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
    it('renders line cross chart', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('component', () => {
    it('returns correct chart object', () => {
      const chart = Line();

      expect(chart).toEqual({
        type: 'lineCross',
        Component: LineChart,
        name: 'Line Cross',
      });
    });
  });
});
