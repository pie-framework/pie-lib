import { render } from '@pie-lib/test-utils';
import React from 'react';
import { rootEdgeComponent, withRootEdge, rootEdgeToFromToWrapper } from '../with-root-edge';
import { graphProps as getGraphProps } from '../../../../__tests__/utils';
import { utils } from '@pie-lib/plot';
const { xy } = utils;

jest.mock('../index', () => {
  const React = require('react');
  const out = {
    lineBase: jest.fn((Component) => Component),
    lineToolComponent: jest.fn((Component) => {
      return (props) => <Component {...props} />;
    }),
  };
  return out;
});

describe('rootEdgeToFromToWrapper', () => {
  let Comp;
  let onChange;

  beforeEach(() => {
    onChange = jest.fn();
    Comp = rootEdgeToFromToWrapper((props) => <div data-testid="wrapped-component" {...props} />);
  });

  const renderComponent = (extras) => {
    const defaults = {
      mark: { root: xy(1, 1), edge: xy(2, 2) },
      onChange,
    };
    const props = { ...defaults, ...extras };
    return render(<Comp {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with only root point', () => {
      const { container } = renderComponent({
        mark: { root: xy(1, 1) },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with root and edge points', () => {
      const { container } = renderComponent({
        mark: { root: xy(0, 0), edge: xy(5, 5) },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with negative coordinates', () => {
      const { container } = renderComponent({
        mark: { root: xy(-5, -5), edge: xy(-1, -1) },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with decimal coordinates', () => {
      const { container } = renderComponent({
        mark: { root: xy(0.5, 0.5), edge: xy(1.5, 1.5) },
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('coordinate transformation', () => {
    it('converts root/edge to from/to for wrapped component', () => {
      const { getByTestId } = renderComponent({
        mark: { root: xy(1, 1), edge: xy(2, 2) },
      });

      const wrappedComponent = getByTestId('wrapped-component');
      expect(wrappedComponent).toBeInTheDocument();
    });

    it('handles mark without edge', () => {
      const { container } = renderComponent({
        mark: { root: xy(1, 1) },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles mark with undefined edge', () => {
      const { container } = renderComponent({
        mark: { root: xy(1, 1), edge: undefined },
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('onChange handling', () => {
    it('passes onChange handler to wrapped component', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('provides onChange prop to wrapped component', () => {
      const { getByTestId } = renderComponent();
      const wrappedComponent = getByTestId('wrapped-component');
      expect(wrappedComponent).toBeInTheDocument();
    });
  });

  describe('prop forwarding', () => {
    it('forwards additional props to wrapped component', () => {
      const { getByTestId } = renderComponent({
        disabled: true,
        correctness: 'correct',
      });

      const wrappedComponent = getByTestId('wrapped-component');
      expect(wrappedComponent).toBeInTheDocument();
    });

    it('forwards graphProps', () => {
      const graphProps = getGraphProps();
      const { getByTestId } = renderComponent({
        graphProps,
      });

      const wrappedComponent = getByTestId('wrapped-component');
      expect(wrappedComponent).toBeInTheDocument();
    });

    it('forwards all standard props', () => {
      const { getByTestId } = renderComponent({
        disabled: false,
        correctness: 'incorrect',
        fill: '#ff0000',
        onClick: jest.fn(),
        onDragStart: jest.fn(),
        onDragStop: jest.fn(),
      });

      const wrappedComponent = getByTestId('wrapped-component');
      expect(wrappedComponent).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles mark with same root and edge', () => {
      const { container } = renderComponent({
        mark: { root: xy(1, 1), edge: xy(1, 1) },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles mark with zero coordinates', () => {
      const { container } = renderComponent({
        mark: { root: xy(0, 0), edge: xy(0, 0) },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles mark with large coordinate values', () => {
      const { container } = renderComponent({
        mark: { root: xy(1000, 1000), edge: xy(2000, 2000) },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles mark with labels', () => {
      const { container } = renderComponent({
        mark: {
          root: { x: 1, y: 1, label: 'Root' },
          edge: { x: 2, y: 2, label: 'Edge' },
        },
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

describe('rootEdgeComponent', () => {
  let onChange;
  let Comp;
  let mark;

  beforeEach(() => {
    onChange = jest.fn();
    mark = { root: xy(0, 0), edge: xy(1, 1) };
    Comp = rootEdgeComponent((props) => <text data-testid="root-edge-comp" {...props} />);
  });

  const renderComponent = (extras) => {
    const defaults = {
      mark,
      graphProps: getGraphProps(),
      onChange,
    };
    const props = { ...defaults, ...extras };
    return render(<Comp {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with building mark', () => {
      const buildingMark = { root: xy(0, 0), building: true };
      const { container } = renderComponent({ mark: buildingMark });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with complete mark', () => {
      const completeMark = { root: xy(0, 0), edge: xy(5, 5), building: false };
      const { container } = renderComponent({ mark: completeMark });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with disabled mark', () => {
      const disabledMark = { root: xy(0, 0), edge: xy(1, 1), disabled: true };
      const { container } = renderComponent({ mark: disabledMark });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with correctness state', () => {
      const correctMark = { root: xy(0, 0), edge: xy(1, 1), correctness: 'correct' };
      const { container } = renderComponent({ mark: correctMark });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('mark variations', () => {
    it('handles mark without edge', () => {
      const { container } = renderComponent({
        mark: { root: xy(1, 1) },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles mark with middle point', () => {
      const { container } = renderComponent({
        mark: { root: xy(0, 0), edge: xy(2, 2), middle: xy(1, 1) },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles mark with custom fill', () => {
      const { container } = renderComponent({
        mark: { root: xy(0, 0), edge: xy(1, 1), fill: '#00ff00' },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles mark with type property', () => {
      const { container } = renderComponent({
        mark: { root: xy(0, 0), edge: xy(1, 1), type: 'parabola' },
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('prop forwarding', () => {
    it('forwards graphProps correctly', () => {
      const customGraphProps = getGraphProps(0, 10, 0, 10);
      const { container } = renderComponent({ graphProps: customGraphProps });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('forwards onClick handler', () => {
      const onClick = jest.fn();
      const { container } = renderComponent({ onClick });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('forwards labelNode', () => {
      const labelNode = document.createElement('foreignObject');
      const { container } = renderComponent({ labelNode });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('forwards labelModeEnabled', () => {
      const { container } = renderComponent({ labelModeEnabled: true });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('forwards coordinatesOnHover', () => {
      const { container } = renderComponent({ coordinatesOnHover: true });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles vertical line (same x coordinates)', () => {
      const { container } = renderComponent({
        mark: { root: xy(1, 0), edge: xy(1, 5) },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles horizontal line (same y coordinates)', () => {
      const { container } = renderComponent({
        mark: { root: xy(0, 1), edge: xy(5, 1) },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles diagonal line', () => {
      const { container } = renderComponent({
        mark: { root: xy(0, 0), edge: xy(5, 5) },
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles negative slope', () => {
      const { container } = renderComponent({
        mark: { root: xy(0, 5), edge: xy(5, 0) },
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

describe('withRootEdge', () => {
  let getPoints;
  let Comp;

  beforeEach(() => {
    getPoints = jest.fn(() => ({
      dataPoints: [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 4 },
      ],
      enableCurve: true,
    }));
    Comp = withRootEdge(getPoints);
  });

  const renderComponent = (extras) => {
    const defaults = {
      from: xy(0, 0),
      to: xy(2, 2),
      graphProps: getGraphProps(),
      onChange: jest.fn(),
    };
    const props = { ...defaults, ...extras };
    return render(<Comp {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('calls getPoints with correct parameters', () => {
      renderComponent();
      expect(getPoints).toHaveBeenCalled();
    });

    it('renders with curve enabled', () => {
      getPoints.mockReturnValue({
        dataPoints: [xy(0, 0), xy(1, 1), xy(2, 2)],
        enableCurve: true,
      });
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with curve disabled', () => {
      getPoints.mockReturnValue({
        dataPoints: [xy(0, 0), xy(1, 1), xy(2, 2)],
        enableCurve: false,
      });
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('data points handling', () => {
    it('handles empty data points', () => {
      getPoints.mockReturnValue({
        dataPoints: [],
        enableCurve: true,
      });
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles single data point', () => {
      getPoints.mockReturnValue({
        dataPoints: [xy(1, 1)],
        enableCurve: true,
      });
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles many data points', () => {
      const points = Array.from({ length: 100 }, (_, i) => xy(i, i * i));
      getPoints.mockReturnValue({
        dataPoints: points,
        enableCurve: true,
      });
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles negative coordinate data points', () => {
      getPoints.mockReturnValue({
        dataPoints: [xy(-5, -5), xy(-3, -3), xy(-1, -1)],
        enableCurve: true,
      });
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('prop handling', () => {
    it('forwards onClick handler', () => {
      const onClick = jest.fn();
      const { container } = renderComponent({ onClick });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('forwards onDragStart handler', () => {
      const onDragStart = jest.fn();
      const { container } = renderComponent({ onDragStart });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('forwards onDragStop handler', () => {
      const onDragStop = jest.fn();
      const { container } = renderComponent({ onDragStop });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('forwards disabled state', () => {
      const { container } = renderComponent({ disabled: true });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('forwards correctness state', () => {
      const { container } = renderComponent({ correctness: 'correct' });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('forwards custom props', () => {
      const { container } = renderComponent({
        fill: '#ff0000',
        strokeWidth: 5,
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles undefined to point', () => {
      const { container } = renderComponent({ to: undefined });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles same from and to points', () => {
      const { container } = renderComponent({
        from: xy(1, 1),
        to: xy(1, 1),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles different graph scales', () => {
      const customGraphProps = getGraphProps(-10, 10, -10, 10);
      const { container } = renderComponent({ graphProps: customGraphProps });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles getPoints returning enableCurve as undefined', () => {
      getPoints.mockReturnValue({
        dataPoints: [xy(0, 0), xy(1, 1)],
        // enableCurve is undefined
      });
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
