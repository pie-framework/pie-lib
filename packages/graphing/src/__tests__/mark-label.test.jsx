import { shallow } from 'enzyme';
import React from 'react';
import { MarkLabel, position, coordinates } from '../mark-label';
import { graphProps as getGraphProps } from '../__tests__/utils';

const xyFn = () => {
  const out = jest.fn((n) => n);
  out.invert = jest.fn((n) => n);
  return out;
};

describe('MarkLabel', () => {
  let w;
  let onChange = jest.fn();
  const wrapper = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      mark: { x: 1, y: 1 },
      graphProps: getGraphProps(0, 10, 0, 10),
    };
    const props = { ...defaults, ...extras };
    return shallow(<MarkLabel {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
    it('renders', () => {
      w = wrapper({ mark: { x: 10, y: 10 } });
      expect(w).toMatchSnapshot();
    });
  });
});

describe('position', () => {
  const assertPosition = (mark, rect, expected) => {
    it(`${mark.x},${mark.y} + ${rect.width},${rect.height} => ${expected}`, () => {
      // we set range.min to a value because in pixels - the greater the Y the lower down on the screen.
      const graphProps = getGraphProps(0, 12, 12, 0);
      const result = position(graphProps, mark, rect);
      expect(result).toEqual(expected);
    });
  };

  assertPosition({ x: 0, y: 0 }, { width: 10, height: 10 }, 'top-left');
  assertPosition({ x: 0, y: 0 }, { width: 1, height: 1 }, 'bottom-right');
  assertPosition({ x: 0, y: 0 }, { width: 10, height: 0 }, 'bottom-left');
  assertPosition({ x: 0, y: 0 }, { width: 0, height: 10 }, 'top-right');
});

describe('coordinates', () => {
  const assertCoordinates = (mark, rect, pos, expected) => {
    it(`${mark.x}, ${mark.y} -> ${pos} = ${expected.left}, ${expected.top}`, () => {
      const result = coordinates(getGraphProps(), mark, rect, pos);
      expect(result).toEqual(expected);
    });
  };
  assertCoordinates({ x: 0, y: 0 }, { width: 0, height: 0 }, 'top-left', { left: '-10rem', top: '-10rem' });
  assertCoordinates({ x: 0, y: 0 }, { width: 0, height: 0 }, 'bottom-left', { left: '-10rem', top: '10rem' });
  assertCoordinates({ x: 0, y: 0 }, { width: 0, height: 0 }, 'top-right', { left: '10rem', top: '-10rem' });
  assertCoordinates({ x: 0, y: 0 }, { width: 0, height: 0 }, 'bottom-right', {
    left: '10rem',
    top: '10rem',
  });
});
