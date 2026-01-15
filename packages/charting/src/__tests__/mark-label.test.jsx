import React from 'react';
import { render } from '@pie-lib/test-utils';
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

  describe('rendering', () => {
    it('renders mark label', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders mark label at different positions', () => {
      const { container } = renderComponent({ mark: { x: 10, y: 10 } });
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
