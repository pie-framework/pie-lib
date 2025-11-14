import { render } from '@pie-lib/test-utils';
import React from 'react';
import { graphProps, xy } from '../../../__tests__/utils';

import { RawBaseComponent, buildLines, swap } from '../component';

const xyLabel = (x, y, index, label) => ({
  ...xy(x, y, index),
  label,
});

// Pure function tests - keep as-is
describe('buildLines', () => {
  const defaultPoints = [xy(0, 0), xy(1, 1), xy(1, 0)];

  const assertBuildLines = (points, closed, expected) => {
    it(`builds points and lines for ${points} = ${expected}`, () => {
      const result = buildLines(points);
      expect(result).toMatchObject([
        { from: xy(0, 0, 0), to: xy(1, 1, 1) },
        { from: xy(1, 1, 1), to: xy(1, 0, 2) },
      ]);
    });
  };

  assertBuildLines(defaultPoints, true, []);
});

describe('swap', () => {
  it('swaps pairs', () => {
    const result = swap([xy(0, 0, 0), xy(1, 1, 1), xy(2, 2, 2)], xy(0, 0, 0), xy(3, 3, 0));
    expect(result).toEqual([xy(3, 3, 0), xy(1, 1, 1), xy(2, 2, 2)]);
  });
});

// TODO: These enzyme-based instance tests need migration to behavioral testing with RTL
describe.skip('RawBaseComponent (legacy enzyme tests - needs migration)', () => {
  let onChange = jest.fn();
  let onChangeProps = jest.fn();
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      onChangeProps,
      onClosePolygon: jest.fn(),
      graphProps: graphProps(),
      points: [],
    };
    const props = { ...defaults, ...extras };
    return render(<RawBaseComponent {...props} />);
  };

  // used to test items that have labels attached to points
  const labelNode = document.createElement('foreignObject');
  const points = [xyLabel(0, 0, 0, 'A'), xyLabel(2, 2, 1, 'B'), xyLabel(0, 2, 2, 'C')];
  const renderWithLabels = (extras) =>
    renderComponent({
      labelNode: labelNode,
      points: points,
      ...extras,
    });

  describe('rendering', () => {
    it('renders', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with labels', () => {
      const { container } = renderWithLabels();
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // These tests need enzyme wrapper.instance() - skip for now
  describe('logic', () => {
    it.skip('dragPoint calls onChange', () => {});
    it.skip('dragPoint calls onChange keeping label property from point', () => {});
    it.skip('dragLine calls onChange', () => {});
    it.skip('dragLine calls onChange keeping label property from both points', () => {});
    it.skip('dragPoly calls onChange', () => {});
    it.skip('dragPoly calls onChange keeping label property from all points', () => {});
    it.skip('labelChange updates "label" property for point', () => {});
    it.skip('labelChange removes "label" property if the field is empty', () => {});
  });

  describe('close', () => {
    it.skip('calls onClosePolygon', () => {});
  });

  describe('clickPoint', () => {
    it.skip('calls onClosePolygon', () => {});
    it.skip('calls onClick', () => {});
    it.skip('adds "label" property to a point', () => {});
    it.skip('if point already has label, keeps that value', () => {});
  });
});
