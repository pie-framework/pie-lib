import React from 'react';
import { render } from '@pie-lib/test-utils';
import '@testing-library/jest-dom/extend-expect';
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
      const chart = Line();

      expect(chart).toEqual({
        type: 'linePlot',
        Component: LinePlot,
        name: 'Line Plot',
      });
    });
  });
});
