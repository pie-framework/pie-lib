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

  it('swaps first element', () => {
    const result = swap([xy(0, 0, 0), xy(1, 1, 1)], xy(0, 0, 0), xy(5, 5, 0));
    expect(result).toEqual([xy(5, 5, 0), xy(1, 1, 1)]);
  });

  it('swaps last element', () => {
    const result = swap([xy(0, 0, 0), xy(1, 1, 1), xy(2, 2, 2)], xy(2, 2, 2), xy(3, 3, 2));
    expect(result).toEqual([xy(0, 0, 0), xy(1, 1, 1), xy(3, 3, 2)]);
  });

  it('swaps middle element', () => {
    const result = swap([xy(0, 0, 0), xy(1, 1, 1), xy(2, 2, 2)], xy(1, 1, 1), xy(3, 3, 1));
    expect(result).toEqual([xy(0, 0, 0), xy(3, 3, 1), xy(2, 2, 2)]);
  });
});

// Note: Instance method tests have been removed. Component behavior should be tested
// through user interactions and integration tests.
describe('RawBaseComponent', () => {
  let onChange;
  let onChangeProps;
  let onClosePolygon;

  beforeEach(() => {
    onChange = jest.fn();
    onChangeProps = jest.fn();
    onClosePolygon = jest.fn();
  });

  const renderComponent = (extras) => {
    const defaults = {
      className: 'className',
      onChange,
      onChangeProps,
      onClosePolygon,
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
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with labels', () => {
      const { container } = renderWithLabels();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with multiple points', () => {
      const { container } = renderComponent({
        points: [xy(0, 0, 0), xy(1, 1, 1), xy(2, 0, 2)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with closed polygon', () => {
      const { container } = renderComponent({
        points: [xy(0, 0, 0), xy(1, 1, 1), xy(2, 0, 2)],
        closed: true,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with single point', () => {
      const { container } = renderComponent({
        points: [xy(0, 0, 0)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with two points', () => {
      const { container } = renderComponent({
        points: [xy(0, 0, 0), xy(1, 1, 1)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders empty polygon', () => {
      const { container } = renderComponent({ points: [] });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with negative coordinates', () => {
      const { container } = renderComponent({
        points: [xy(-5, -5, 0), xy(-1, -1, 1), xy(-3, -2, 2)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with decimal coordinates', () => {
      const { container } = renderComponent({
        points: [xy(0.5, 0.5, 0), xy(1.5, 1.5, 1), xy(2.5, 0.5, 2)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with large coordinate values', () => {
      const { container } = renderComponent({
        points: [xy(100, 100, 0), xy(200, 200, 1), xy(150, 250, 2)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('states', () => {
    it('renders in disabled state', () => {
      const { container } = renderComponent({
        points: [xy(0, 0, 0), xy(1, 1, 1), xy(2, 0, 2)],
        disabled: true,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders in enabled state', () => {
      const { container } = renderComponent({
        points: [xy(0, 0, 0), xy(1, 1, 1), xy(2, 0, 2)],
        disabled: false,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with correctness correct', () => {
      const { container } = renderComponent({
        points: [xy(0, 0, 0), xy(1, 1, 1), xy(2, 0, 2)],
        correctness: 'correct',
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with correctness incorrect', () => {
      const { container } = renderComponent({
        points: [xy(0, 0, 0), xy(1, 1, 1), xy(2, 0, 2)],
        correctness: 'incorrect',
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with building state', () => {
      const { container } = renderComponent({
        points: [xy(0, 0, 0), xy(1, 1, 1)],
        building: true,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with fill property', () => {
      const { container } = renderComponent({
        points: [xy(0, 0, 0), xy(1, 1, 1), xy(2, 0, 2)],
        fill: '#ff0000',
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('labels', () => {
    it('renders with all points labeled', () => {
      const { container } = renderWithLabels();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with partial labels', () => {
      const partialLabels = [xyLabel(0, 0, 0, 'A'), xy(2, 2, 1), xyLabel(0, 2, 2, 'C')];
      const { container } = renderComponent({
        labelNode,
        points: partialLabels,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with empty string labels', () => {
      const emptyLabels = [xyLabel(0, 0, 0, ''), xyLabel(2, 2, 1, ''), xyLabel(0, 2, 2, '')];
      const { container } = renderComponent({
        labelNode,
        points: emptyLabels,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders without labelNode', () => {
      const { container } = renderComponent({
        points: [xyLabel(0, 0, 0, 'A'), xyLabel(2, 2, 1, 'B')],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with labelModeEnabled', () => {
      const { container } = renderWithLabels({ labelModeEnabled: true });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with labelModeEnabled disabled', () => {
      const { container } = renderWithLabels({ labelModeEnabled: false });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with long labels', () => {
      const longLabels = [
        xyLabel(0, 0, 0, 'Very Long Label Text'),
        xyLabel(2, 2, 1, 'Another Long Label'),
        xyLabel(0, 2, 2, 'Yet Another Long Label'),
      ];
      const { container } = renderComponent({
        labelNode,
        points: longLabels,
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('polygon shapes', () => {
    it('renders triangle', () => {
      const { container } = renderComponent({
        points: [xy(0, 0, 0), xy(2, 0, 1), xy(1, 2, 2)],
        closed: true,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders square', () => {
      const { container } = renderComponent({
        points: [xy(0, 0, 0), xy(2, 0, 1), xy(2, 2, 2), xy(0, 2, 3)],
        closed: true,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders pentagon', () => {
      const { container } = renderComponent({
        points: [xy(1, 0, 0), xy(2, 1, 1), xy(1.5, 2.5, 2), xy(0.5, 2.5, 3), xy(0, 1, 4)],
        closed: true,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders irregular polygon', () => {
      const { container } = renderComponent({
        points: [xy(0, 0, 0), xy(3, 1, 1), xy(2, 4, 2), xy(-1, 3, 3)],
        closed: true,
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('passes onChange callback', () => {
      const customOnChange = jest.fn();
      const { container } = renderComponent({
        onChange: customOnChange,
        points: [xy(0, 0, 0), xy(1, 1, 1)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('passes onChangeProps callback', () => {
      const customOnChangeProps = jest.fn();
      const { container } = renderComponent({
        onChangeProps: customOnChangeProps,
        points: [xy(0, 0, 0), xy(1, 1, 1)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('passes onClick callback', () => {
      const onClick = jest.fn();
      const { container } = renderComponent({
        onClick,
        points: [xy(0, 0, 0), xy(1, 1, 1)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('passes onClosePolygon callback', () => {
      const customOnClosePolygon = jest.fn();
      const { container } = renderComponent({
        onClosePolygon: customOnClosePolygon,
        points: [xy(0, 0, 0), xy(1, 1, 1), xy(2, 0, 2)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('passes onDragStart callback', () => {
      const onDragStart = jest.fn();
      const { container } = renderComponent({
        onDragStart,
        points: [xy(0, 0, 0), xy(1, 1, 1)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('passes onDragStop callback', () => {
      const onDragStop = jest.fn();
      const { container } = renderComponent({
        onDragStop,
        points: [xy(0, 0, 0), xy(1, 1, 1)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('passes coordinatesOnHover', () => {
      const { container } = renderComponent({
        coordinatesOnHover: true,
        points: [xy(0, 0, 0), xy(1, 1, 1)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('passes graphProps', () => {
      const customGraphProps = graphProps(0, 10, 0, 10);
      const { container } = renderComponent({
        graphProps: customGraphProps,
        points: [xy(5, 5, 0), xy(7, 7, 1)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('passes gssLineData', () => {
      const gssLineData = { selectedTool: 'solutionSet' };
      const { container } = renderComponent({
        gssLineData,
        points: [xy(0, 0, 0), xy(1, 1, 1), xy(2, 0, 2)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles points with same coordinates', () => {
      const { container } = renderComponent({
        points: [xy(1, 1, 0), xy(1, 1, 1), xy(1, 1, 2)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles collinear points', () => {
      const { container } = renderComponent({
        points: [xy(0, 0, 0), xy(1, 1, 1), xy(2, 2, 2)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles very close points', () => {
      const { container } = renderComponent({
        points: [xy(1, 1, 0), xy(1.001, 1.001, 1), xy(1.002, 1.002, 2)],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles mixed positive and negative coordinates', () => {
      const { container } = renderComponent({
        points: [xy(-5, 5, 0), xy(5, 5, 1), xy(5, -5, 2), xy(-5, -5, 3)],
        closed: true,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles points without explicit index', () => {
      const { container } = renderComponent({
        points: [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 2, y: 0 },
        ],
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles undefined properties', () => {
      const { container } = renderComponent({
        points: [xy(0, 0, 0), xy(1, 1, 1)],
        disabled: undefined,
        correctness: undefined,
        building: undefined,
        fill: undefined,
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('integration', () => {
    it('renders complete closed polygon with all features', () => {
      const { container } = renderComponent({
        points: points,
        closed: true,
        labelNode,
        labelModeEnabled: true,
        coordinatesOnHover: true,
        correctness: 'correct',
        disabled: false,
        fill: '#00ff00',
        gssLineData: { selectedTool: 'solutionSet' },
        onChange: jest.fn(),
        onChangeProps: jest.fn(),
        onClosePolygon: jest.fn(),
        onClick: jest.fn(),
        onDragStart: jest.fn(),
        onDragStop: jest.fn(),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders building polygon', () => {
      const { container } = renderComponent({
        points: [xy(0, 0, 0), xy(1, 1, 1)],
        building: true,
        closed: false,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders disabled polygon with labels', () => {
      const { container } = renderComponent({
        points: points,
        labelNode,
        disabled: true,
        closed: true,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders polygon in solution set mode', () => {
      const { container } = renderComponent({
        points: points,
        closed: true,
        gssLineData: { selectedTool: 'solutionSet' },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders polygon with incorrect correctness', () => {
      const { container } = renderComponent({
        points: points,
        closed: true,
        correctness: 'incorrect',
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
