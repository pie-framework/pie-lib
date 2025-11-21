import { render } from '@testing-library/react';
import React from 'react';
import { Root } from '../root';

jest.mock('d3-selection', () => ({
  select: jest.fn().mockReturnValue({
    on: jest.fn(),
  }),
  mouse: jest.fn(),
}));

const scaleMock = () => {
  const fn = jest.fn((n) => n);
  fn.invert = jest.fn((n) => n);
  return fn;
};

const graphProps = () => ({
  scale: {
    x: scaleMock(),
    y: scaleMock(),
  },
  snap: {
    x: jest.fn((n) => n),
    y: jest.fn((n) => n),
  },
  domain: {
    min: 0,
    max: 1,
    step: 1,
  },
  range: {
    min: 0,
    max: 1,
    step: 1,
  },
  size: {
    width: 400,
    height: 400,
  },
});

describe('root', () => {
  const defaultProps = {
    classes: {},
    graphProps: graphProps(),
  };

  it('renders with children', () => {
    const { container, getByText } = render(
      <Root {...defaultProps}>hi</Root>
    );
    expect(container.firstChild).toBeInTheDocument();
    expect(getByText('hi')).toBeInTheDocument();
  });
});
