import { shallow } from 'enzyme';
import React from 'react';
import { MarkLabel } from '../mark-label';

// jest.mock('react', () => {
//   const Actual = jest.requireActual('react');

//   Actual.useState = jest.fn();
//   Actual.useEffect = jest.fn();
//   Actual.useCallback = jest.fn();
//   console.log('actual:', Actual);
//   // return {
//   //   default: Actual,
//   //   useState: jest.fn(),
//   //   useEffect: jest.fn()
//   // };
//   return Actual;
// });

const xyFn = () => {
  const out = jest.fn(n => n);
  out.invert = jest.fn(n => n);
  return out;
};

const getGraphProps = (dmin = -5, dmax = 5, rmin = -5, rmax = 5) => ({
  scale: {
    x: xyFn(),
    y: xyFn()
  },
  snap: {
    x: xyFn(),
    y: xyFn()
  },
  domain: {
    min: dmin,
    max: dmax
  },
  range: {
    min: rmin,
    max: rmax
  },
  size: {
    width: 500,
    height: 500
  }
});

describe('MarkLabel', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      mark: { x: 1, y: 1 },
      graphProps: getGraphProps()
    };
    const props = { ...defaults, ...extras };
    return shallow(<MarkLabel {...props} />);
  };
  describe('snapshot', () => {
    it('', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});
