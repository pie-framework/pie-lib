import { shallow } from 'enzyme';
import React from 'react';
import { Polygon, getPointString } from '../polygon';
import { graphProps } from '../../../__tests__/utils';

const xy = (x, y) => ({ x, y });

describe('Polygon', () => {
  let w;
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      closed: false
    };
    const props = { ...defaults, ...extras };
    return shallow(<Polygon {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper({ points: [{ x: 1, y: 1 }] });
      expect(w).toMatchSnapshot();
    });
  });
});

describe('getPointString', () => {
  const assertString = (arr, expected) => {
    it('creates: ', () => {
      const result = getPointString(arr, {
        x: jest.fn(n => n),
        y: jest.fn(n => n)
      });

      expect(result).toEqual(expected);
    });
  };

  assertString([xy(1, 1)], '1,1');
  assertString([xy(1, 1), xy(2, 1)], '1,1 2,1');
  assertString([xy(1, 1), xy(2, 1), xy(4, 4)], '1,1 2,1 4,4');
});
