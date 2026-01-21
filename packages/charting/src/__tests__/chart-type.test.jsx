import React from 'react';
import { render } from '@pie-lib/test-utils';
import ChartType from '../chart-type';

describe('ChartType', () => {
  let props;
  const onChange = jest.fn();

  beforeEach(() => {
    props = {
      classes: {},
      value: 'bar',
      onChange,
    };
  });

  describe('rendering', () => {
    it('renders chart type selector', () => {
      const { container } = render(<ChartType {...props} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
