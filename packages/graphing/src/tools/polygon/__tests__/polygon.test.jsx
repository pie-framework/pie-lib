import { render } from '@pie-lib/test-utils';
import React from 'react';
import { Polygon, getPointString } from '../polygon';
import { graphProps } from '../../../__tests__/utils';

const xy = (x, y) => ({ x, y });

describe('Polygon', () => {
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      closed: false,
    };
    const props = { ...defaults, ...extras };
    return render(<Polygon {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent({ points: [{ x: 1, y: 1 }] });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders multiple points', () => {
      const points = [xy(0, 0), xy(1, 1), xy(2, 0)];
      const { container } = renderComponent({ points });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders closed polygon', () => {
      const points = [xy(0, 0), xy(1, 1), xy(2, 0)];
      const { container } = renderComponent({ points, closed: true });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders open polygon', () => {
      const points = [xy(0, 0), xy(1, 1)];
      const { container } = renderComponent({ points, closed: false });
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

describe('getPointString', () => {
  const assertString = (arr, expected) => {
    it('creates: ', () => {
      const result = getPointString(arr, {
        x: jest.fn((n) => n),
        y: jest.fn((n) => n),
      });

      expect(result).toEqual(expected);
    });
  };

  assertString([xy(1, 1)], '1,1');
  assertString([xy(1, 1), xy(2, 1)], '1,1 2,1');
  assertString([xy(1, 1), xy(2, 1), xy(4, 4)], '1,1 2,1 4,4');
});
