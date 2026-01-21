import { render } from '@pie-lib/test-utils';
import React from 'react';
import { graphProps } from '../../__tests__/utils';

import Axes, { RawXAxis, RawYAxis, firstNegativeValue, sharedValues } from '../axes';

describe('RawXAxis', () => {
  let onChange = jest.fn();
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: graphProps(),
      includeArrows: {
        left: true,
        right: true,
        up: true,
        down: true,
      },
      columnTicksValues: [-1, 0, 1],
      skipValues: [],
      distanceFromOriginToFirstNegativeY: 0,
      dy: 0,
    };
    const props = { ...defaults, ...extras };
    return render(<RawXAxis {...props} />);
  };
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

describe('RawYAxis', () => {
  let onChange = jest.fn();
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: graphProps(),
      includeArrows: {
        left: true,
        right: true,
        up: true,
        down: true,
      },
      rowTickValues: [-1, 0, 1],
      skipValues: [],
    };
    const props = { ...defaults, ...extras };
    return render(<RawYAxis {...props} />);
  };
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

const customScaleMock = (distance) => {
  const fn = jest.fn((n) => n * distance);
  fn.invert = jest.fn((n) => n * distance);
  fn.domain = jest.fn(() => fn);
  fn.range = jest.fn(() => fn);
  fn.copy = jest.fn(() => customScaleMock(distance));
  return fn;
};

describe('Axes', () => {
  let onChange = jest.fn();

  const customGraphProps = {
    ...graphProps(),
    domain: {
      min: -2,
      max: 2,
      labelStep: 1,
      step: 1,
    },
    range: {
      min: -2,
      max: 2,
      step: 1,
      labelStep: 1,
    },
    scale: {
      x: customScaleMock(200),
      y: customScaleMock(150),
    },
  };

  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: customGraphProps,
    };

    const props = { ...defaults, ...extras };
    return render(<Axes {...props} />);
  };
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

describe('firstNegativeValue', () => {
  it('should return undefined for undefined interval', () => {
    const interval = undefined;
    const result = firstNegativeValue(interval);
    expect(result).toEqual(undefined);
  });

  it('should return undefined for empty interval', () => {
    const interval = [];
    const result = firstNegativeValue(interval);
    expect(result).toEqual(undefined);
  });

  it('should return undefined if there is no negative in interval array', () => {
    const interval = [1, 5, 7, 4, 5];
    const result = firstNegativeValue(interval);
    expect(result).toEqual(undefined);
  });

  it('should return first negative number from interval', () => {
    const interval = [1, 5, 7, -2, 4, 5, -1];
    const result = firstNegativeValue(interval);
    expect(result).toEqual(-2);
  });
});

describe('sharedValues', () => {
  it('should be empty array if firstNegativeValue for one of the axes is undefined', () => {
    // x
    const intervalX = [1, 2, 3, 4, 5, 6];
    const firstNegativeX = firstNegativeValue(intervalX);
    const distanceFromOriginToFirstNegativeX = -22;

    // y
    const intervalY = [-1, -2, 1, 2, 3, 4, 5, 6];
    const firstNegativeY = firstNegativeValue(intervalY);
    const distanceFromOriginToFirstNegativeY = -22;

    const deltaAllowance = 5;

    const result = sharedValues(
      firstNegativeX,
      firstNegativeY,
      distanceFromOriginToFirstNegativeX,
      distanceFromOriginToFirstNegativeY,
      deltaAllowance,
    );

    expect(result).toEqual([]);
  });

  it('should be empty array if firstNegativeX and firstNegativeY are equal but they do not overlap', () => {
    // x
    const intervalX = [-1, -2, 1, 2, 3, 4, 5, 6];
    const firstNegativeX = firstNegativeValue(intervalX);
    const distanceFromOriginToFirstNegativeX = -7;

    // y
    const intervalY = [-1, -2, 1, 2, 3, 4, 5, 6];
    const firstNegativeY = firstNegativeValue(intervalY);
    const distanceFromOriginToFirstNegativeY = -22;

    const deltaAllowance = 5;

    const result = sharedValues(
      firstNegativeX,
      firstNegativeY,
      distanceFromOriginToFirstNegativeX,
      distanceFromOriginToFirstNegativeY,
      deltaAllowance,
    );

    expect(result).toEqual([]);
  });

  it('should be -1 if firstNegativeX and firstNegativeY are equal and they overlap', () => {
    // x
    const intervalX = [-1, -2, 1, 2, 3, 4, 5, 6];
    const firstNegativeX = firstNegativeValue(intervalX);
    const distanceFromOriginToFirstNegativeX = -20;

    // y
    const intervalY = [-1, -2, 1, 2, 3, 4, 5, 6];
    const firstNegativeY = firstNegativeValue(intervalY);
    const distanceFromOriginToFirstNegativeY = -22;

    const deltaAllowance = 5;
    const dy = -20; // dy needs to be within the range for the condition to pass

    const result = sharedValues(
      firstNegativeX,
      firstNegativeY,
      distanceFromOriginToFirstNegativeX,
      distanceFromOriginToFirstNegativeY,
      deltaAllowance,
      dy,
    );

    expect(result).toEqual([-1]);
  });
});
