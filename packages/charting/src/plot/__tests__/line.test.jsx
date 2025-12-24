import React from 'react';
import { render } from '@pie-lib/test-utils';
import Line, { LinePlot } from '../line';
import { graphProps } from './utils';

describe('LinePlot', () => {
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
    return render(<LinePlot {...props} />);
  };

  describe('rendering', () => {
    it('renders line plot', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders without graphProps', () => {
      const { container } = renderComponent({ graphProps: undefined });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('component', () => {
    it('returns correct chart object', () => {
      const chart = Line();

      expect(chart).toEqual({
        type: 'linePlot',
        Component: LinePlot,
        name: 'Line Plot',
      });
    });
  });
});
