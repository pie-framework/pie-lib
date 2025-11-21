import { render } from '@testing-library/react';
import React from 'react';
import { gridDraggable } from '../grid-draggable';

jest.mock('d3-selection', () => ({
  clientPoint: jest.fn().mockReturnValue([0, 0]),
}));

jest.mock('../draggable', () => ({
  DraggableCore: ({ children }) => children,
}));

jest.mock('../utils', () => ({
  getDelta: jest.fn(),
}));

const xyFn = () => {
  const out = jest.fn((n) => n);
  out.invert = jest.fn((n) => n);
  return out;
};

const getGraphProps = () => ({
  scale: {
    x: xyFn(),
    y: xyFn(),
  },
  snap: {
    x: xyFn(),
    y: xyFn(),
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
    width: 500,
    height: 500,
  },
  getRootNode: () => ({}),
});

describe('gridDraggable', () => {
  const defaultOptions = {
    anchorPoint: jest.fn().mockReturnValue({ x: 0, y: 0 }),
    bounds: jest.fn().mockReturnValue({ left: 0, top: 0, bottom: 0, right: 0 }),
    fromDelta: jest.fn(),
  };

  const defaultProps = {
    graphProps: getGraphProps(),
  };

  it('renders regular component', () => {
    const Comp = gridDraggable(defaultOptions)(() => <div>Test</div>);
    const { container } = render(<Comp {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with decimal domain and range', () => {
    const props = {
      ...defaultProps,
      graphProps: {
        ...getGraphProps(),
        domain: {
          min: -1.5,
          max: 1.6,
          step: 0.3,
        },
        range: {
          min: -2,
          max: 3,
          step: 0.2,
        },
      },
    };
    const Comp = gridDraggable(defaultOptions)(() => <div>Test</div>);
    const { container } = render(<Comp {...props} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
