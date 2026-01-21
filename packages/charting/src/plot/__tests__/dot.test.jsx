import React from 'react';
import { render } from '@pie-lib/test-utils';
import Dot, { DotPlot } from '../dot';
import { graphProps } from './utils';

describe('DotPlot', () => {
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
    return render(<DotPlot {...props} />);
  };

  describe('rendering', () => {
    it('renders dot plot', () => {
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
      const chart = Dot();

      expect(chart).toEqual({
        type: 'dotPlot',
        Component: DotPlot,
        name: 'Dot Plot',
      });
    });
  });
});
