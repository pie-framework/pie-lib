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
      const chart = Dot();

      expect(chart).toEqual({
        type: 'dotPlot',
        Component: DotPlot,
        name: 'Dot Plot',
      });
    });
  });
});
