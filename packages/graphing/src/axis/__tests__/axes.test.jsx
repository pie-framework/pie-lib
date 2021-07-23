import { shallow } from 'enzyme';
import React from 'react';
import { graphProps } from '../../__tests__/utils';

import Axes, { RawXAxis, RawYAxis, firstNegativeValue, sharedValues } from '../axes';

describe('RawXAxis', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: graphProps(),
      includeArrows: {
        left: true,
        right: true,
        up: true,
        down: true
      }
    };
    const props = { ...defaults, ...extras };
    return shallow(<RawXAxis {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});

describe('RawYAxis', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: graphProps(),
      includeArrows: {
        left: true,
        right: true,
        up: true,
        down: true
      }
    };
    const props = { ...defaults, ...extras };
    return shallow(<RawYAxis {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});

const customScaleMock = distance => {
  const fn = jest.fn(n => n * distance);
  fn.invert = jest.fn(n => n * distance);
  return fn;
};

describe.only('Axes', () => {
  let w;
  let onChange = jest.fn();

  const customGraphProps = {
    ...graphProps(),
    domain: {
      min: -2,
      max: 2,
      labelStep: 1,
      step: 1
    },
    range: {
      min: -2,
      max: 2,
      step: 1,
      labelStep: 1
    },
    scale: {
      x: customScaleMock(200),
      y: customScaleMock(150)
    }
  };

  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      graphProps: customGraphProps
    };

    const props = { ...defaults, ...extras };
    return shallow(<Axes {...props} />);
  };
  describe('xValues', () => {
    it('renders', () => {
      w = wrapper();
      const result = w.instance().xValues();
      expect(result).toEqual({
        columnTicksValues: expect.arrayContaining([-2, -1, 0, 1, 2]),
        distantceFromOriginToFirstNegativeX: 150,
        firstNegativeX: -1
      });
    });
  });
  describe('yValues', () => {
    it('renders', () => {
      w = wrapper();
      const result = w.instance().yValues();
      expect(result).toEqual({
        rowTickValues: expect.arrayContaining([-2, -1, 0, 1, 2]),
        distantceFromOriginToFirstNegativeY: 200,
        firstNegativeY: -1
      });
    });
  });
});

describe('firstNegativeValue should return undefiend for undefined interval', () => {
  const interval = undefined;
  const result = firstNegativeValue(interval);
  expect(result).toEqual(undefined);
});

describe('firstNegativeValue should return undefiend for empty interval', () => {
  const interval = [];
  const result = firstNegativeValue(interval);
  expect(result).toEqual(undefined);
});

describe('firstNegativeValue should return undefined if there is no negative in interval array', () => {
  const interval = [1, 5, 7, 4, 5];
  const result = firstNegativeValue(interval);
  expect(result).toEqual(undefined);
});

describe('firstNegativeValue should return first negative number from interval', () => {
  const interval = [1, 5, 7, -2, 4, 5, -1];
  const result = firstNegativeValue(interval);
  expect(result).toEqual(-2);
});

describe('skipValue should be empty array if firstNegativeValue for one of the axes is undefined', () => {
  // x
  const intervalX = [1, 2, 3, 4, 5, 6];
  const firstNegativeX = firstNegativeValue(intervalX);
  const distantceFromOriginToFirstNegativeX = -22;

  // y
  const intervalY = [-1, -2, 1, 2, 3, 4, 5, 6];
  const firstNegativeY = firstNegativeValue(intervalY);
  const distantceFromOriginToFirstNegativeY = -22;

  const deltaAllowance = 5;

  const result = sharedValues(
    firstNegativeX,
    firstNegativeY,
    distantceFromOriginToFirstNegativeX,
    distantceFromOriginToFirstNegativeY,
    deltaAllowance
  );

  expect(result).toEqual([]);
});

describe('skipValue should be empty array if firstNegativeX and firstNegativeY are equal but they do not overlap', () => {
  // x
  const intervalX = [-1, -2, 1, 2, 3, 4, 5, 6];
  const firstNegativeX = firstNegativeValue(intervalX);
  const distantceFromOriginToFirstNegativeX = -7;

  // y
  const intervalY = [-1, -2, 1, 2, 3, 4, 5, 6];
  const firstNegativeY = firstNegativeValue(intervalY);
  const distantceFromOriginToFirstNegativeY = -22;

  const deltaAllowance = 5;

  const result = sharedValues(
    firstNegativeX,
    firstNegativeY,
    distantceFromOriginToFirstNegativeX,
    distantceFromOriginToFirstNegativeY,
    deltaAllowance
  );

  expect(result).toEqual([]);
});

describe('skipValue should be -1 if firstNegativeX and firstNegativeY are equal and they overlap', () => {
  // x
  const intervalX = [-1, -2, 1, 2, 3, 4, 5, 6];
  const firstNegativeX = firstNegativeValue(intervalX);
  const distantceFromOriginToFirstNegativeX = -20;

  // y
  const intervalY = [-1, -2, 1, 2, 3, 4, 5, 6];
  const firstNegativeY = firstNegativeValue(intervalY);
  const distantceFromOriginToFirstNegativeY = -22;

  const deltaAllowance = 5;

  const result = sharedValues(
    firstNegativeX,
    firstNegativeY,
    distantceFromOriginToFirstNegativeX,
    distantceFromOriginToFirstNegativeY,
    deltaAllowance
  );

  expect(result).toEqual([-1]);
});
