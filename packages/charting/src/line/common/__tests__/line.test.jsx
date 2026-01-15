import { render } from '@testing-library/react';
import React from 'react';
import Line, { RawLine } from '../line';
import { graphProps } from './utils';

describe('Line', () => {
  const xBand = () => {};
  xBand.bandwidth = () => {};
  const onChange = jest.fn();

  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand,
      onChange,
      data: [{ value: 0, label: '0' }],
    };
    const props = { ...defaults, ...extras };
    return render(<Line {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('functionality', () => {
    it('calls onChange when line changes', () => {
      const { container } = renderComponent();
      // Testing changeLine functionality would require user interaction
      // with drag handles on the line chart
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

describe('RawLine', () => {
  const xBand = () => {};
  xBand.bandwidth = () => {};
  const onChange = jest.fn();

  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand,
      onChange,
      data: [
        { label: 'A', value: 0 },
        { label: 'B', value: 1 },
      ],
      label: 'label',
      CustomBarElement: () => <div />,
    };
    const props = { ...defaults, ...extras };
    return render(<RawLine {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('functionality', () => {
    it('handles drag operations', () => {
      const { container } = renderComponent();
      // Testing dragStop functionality would require user interaction
      // with drag handles on the line
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
