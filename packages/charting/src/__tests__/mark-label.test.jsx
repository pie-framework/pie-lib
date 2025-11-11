import React from 'react';
import { render } from '@pie-lib/test-utils';
import '@testing-library/jest-dom/extend-expect';
import { MarkLabel } from '../mark-label';
import { graphProps as getGraphProps } from './utils';

describe('MarkLabel', () => {
  let onChange = jest.fn();

  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      defineChart: false,
      className: 'className',
      onChange,
      mark: { x: 1, y: 1 },
      graphProps: getGraphProps(0, 10, 0, 10),
    };
    const props = { ...defaults, ...extras };
    return render(<MarkLabel {...props} />);
  };

  describe('snapshot', () => {
    it('renders with mark at (1,1)', () => {
      const { container } = renderComponent();
      expect(container).toMatchSnapshot();
    });

    it('renders with mark at (10,10)', () => {
      const { container } = renderComponent({ mark: { x: 10, y: 10 } });
      expect(container).toMatchSnapshot();
    });
  });
});
