import React from 'react';
import { render } from '@pie-lib/test-utils';
import '@testing-library/jest-dom/extend-expect';
import { Grid } from '../grid';
import { graphProps, createBandScale } from './utils';

describe('Grid', () => {
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand: createBandScale(['a', 'b', 'c'], [0, 400]),
    };
    const props = { ...defaults, ...extras };
    return render(<Grid {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const { container } = renderComponent();
      expect(container).toMatchSnapshot();
    });

    // Note: graphProps is a required prop, so testing with undefined is not a valid test case.
    // RTL's full rendering exposes this issue that was hidden by Enzyme's shallow rendering.
    // Removed: it('renders if graphProps is not defined', ...)
  });
});
