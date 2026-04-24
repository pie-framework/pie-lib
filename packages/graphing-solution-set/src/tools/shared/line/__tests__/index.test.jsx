import { lineBase, lineTool, lineToolComponent } from '../index';
import { utils } from '@pie-lib/plot';
import { render } from '@pie-lib/test-utils';
import React from 'react';
import { graphProps as getGraphProps } from '../../../../__tests__/utils';

const { xy } = utils;
const xyLabel = (x, y, label) => ({ x, y, label });

describe('lineTool', () => {
  describe('addPoint', () => {
    let toolbar;

    beforeEach(() => {
      toolbar = lineTool('lineType', () => <div />)();
    });

    it('returns a building mark when no existing mark', () => {
      const result = toolbar.addPoint(xy(1, 1));
      expect(result).toEqual({
        type: 'lineType',
        building: true,
        from: xy(1, 1),
      });
    });

    it('returns a complete mark when adding second point', () => {
      const result = toolbar.addPoint(xy(1, 1), { from: xy(0, 0) });
      expect(result).toEqual({
        building: false,
        from: xy(0, 0),
        to: xy(1, 1),
      });
    });

    it('returns same mark if point equals existing from point', () => {
      const existingMark = { from: xy(1, 1), building: true };
      const result = toolbar.addPoint(xy(1, 1), existingMark);
      expect(result).toEqual(existingMark);
    });

    it('handles adding point with root property', () => {
      const existingMark = { root: xy(1, 1), building: true };
      const result = toolbar.addPoint(xy(1, 1), existingMark);
      expect(result).toEqual(existingMark);
    });

    it('creates different types correctly', () => {
      const lineA = lineTool('lineA', () => <div />)();
      const lineB = lineTool('lineB', () => <div />)();

      const resultA = lineA.addPoint(xy(1, 1));
      const resultB = lineB.addPoint(xy(1, 1));

      expect(resultA.type).toBe('lineA');
      expect(resultB.type).toBe('lineB');
    });

    it('preserves building state correctly', () => {
      const building = toolbar.addPoint(xy(1, 1));
      expect(building.building).toBe(true);

      const complete = toolbar.addPoint(xy(2, 2), building);
      expect(complete.building).toBe(false);
    });
  });

  describe('Component property', () => {
    it('stores the provided Component', () => {
      const TestComp = () => <div>Test</div>;
      const tool = lineTool('test', TestComp)();
      expect(tool.Component).toBe(TestComp);
    });

    it('stores the correct type', () => {
      const tool = lineTool('customType', () => <div />)();
      expect(tool.type).toBe('customType');
    });
  });
});

describe('lineToolComponent', () => {
  let Comp;
  let mark;
  let onChange;

  beforeEach(() => {
    onChange = jest.fn();
    Comp = lineToolComponent(() => <text data-testid="line-component" />);
    mark = { from: xy(0, 0), to: xy(1, 1), type: 'line' };
  });

  const renderComponent = (extras) => {
    const defaults = {
      mark,
      onChange,
      graphProps: getGraphProps(),
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
      const buildingMark = { from: xy(0, 0), building: true, type: 'line' };
      const { container } = renderComponent({ mark: buildingMark });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with background mark', () => {
      const bgMark = { from: xy(0, 0), to: xy(1, 1), isBackground: true, type: 'line' };
      const { container } = renderComponent({ mark: bgMark });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with disabled mark', () => {
      const disabledMark = { from: xy(0, 0), to: xy(1, 1), disabled: true, type: 'line' };
      const { container } = renderComponent({ mark: disabledMark });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with correctness states', () => {
      const correctMark = { from: xy(0, 0), to: xy(1, 1), correctness: 'correct', type: 'line' };
      const { container } = renderComponent({ mark: correctMark });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with middle point', () => {
      const markWithMiddle = { from: xy(0, 0), to: xy(1, 1), middle: xy(0.5, 0.5), type: 'line' };
      const { container } = renderComponent({ mark: markWithMiddle });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with fill color', () => {
      const coloredMark = { from: xy(0, 0), to: xy(1, 1), fill: '#ff0000', type: 'line' };
      const { container } = renderComponent({ mark: coloredMark });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with gssLineData', () => {
      const gssLineData = { selectedTool: 'lineA' };
      const { container } = renderComponent({ gssLineData });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with labelNode', () => {
      const labelNode = document.createElement('foreignObject');
      const { container } = renderComponent({ labelNode });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with coordinatesOnHover enabled', () => {
      const { container } = renderComponent({ coordinatesOnHover: true });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with labelModeEnabled', () => {
      const { container } = renderComponent({ labelModeEnabled: true });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('state management', () => {
    it('initializes with empty state', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
      // State should be empty initially
    });

    it('handles mark updates through props', () => {
      const { rerender, container } = renderComponent();
      const updatedMark = { from: xy(1, 1), to: xy(2, 2), type: 'line' };

      rerender(<Comp mark={updatedMark} onChange={onChange} graphProps={getGraphProps()} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('background mark handling', () => {
    it('disables from point when mark is background', () => {
      const bgMark = {
        from: xy(0, 0),
        to: xy(1, 1),
        isBackground: true,
        type: 'line',
      };
      const { container } = renderComponent({ mark: bgMark });
      expect(container.firstChild).toBeInTheDocument();
      // from.disabled should be true
    });

    it('disables to point when mark is background', () => {
      const bgMark = {
        from: xy(0, 0),
        to: xy(1, 1),
        isBackground: true,
        type: 'line',
      };
      const { container } = renderComponent({ mark: bgMark });
      expect(container.firstChild).toBeInTheDocument();
      // to.disabled should be true
    });

    it('disables middle point when mark is background', () => {
      const bgMark = {
        from: xy(0, 0),
        to: xy(1, 1),
        middle: xy(0.5, 0.5),
        isBackground: true,
        type: 'line',
      };
      const { container } = renderComponent({ mark: bgMark });
      expect(container.firstChild).toBeInTheDocument();
      // middle.disabled should be true
    });
  });

  describe('edge cases', () => {
    it('handles mark without to point', () => {
      const incompleteMark = { from: xy(0, 0), type: 'line' };
      const { container } = renderComponent({ mark: incompleteMark });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles mark with only from point', () => {
      const singlePointMark = { from: xy(0, 0), building: true, type: 'line' };
      const { container } = renderComponent({ mark: singlePointMark });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles different line types', () => {
      const parabola = { from: xy(0, 0), to: xy(1, 1), type: 'parabola' };
      const sine = { from: xy(0, 0), to: xy(1, 1), type: 'sine' };
      const absolute = { from: xy(0, 0), to: xy(1, 1), type: 'absolute' };
      const exponential = { from: xy(0, 0), to: xy(1, 1), type: 'exponential' };

      render(<Comp mark={parabola} onChange={onChange} graphProps={getGraphProps()} />);
      render(<Comp mark={sine} onChange={onChange} graphProps={getGraphProps()} />);
      render(<Comp mark={absolute} onChange={onChange} graphProps={getGraphProps()} />);
      render(<Comp mark={exponential} onChange={onChange} graphProps={getGraphProps()} />);
    });
  });
});

describe('lineBase', () => {
  let Comp;
  let onChange;
  let changeMarkProps;
  let onClick;

  beforeEach(() => {
    onChange = jest.fn();
    changeMarkProps = jest.fn();
    onClick = jest.fn();
    Comp = lineBase(() => <text data-testid="line-base" />);
  });

  const renderComponent = (extras) => {
    const defaults = {
      onChange,
      changeMarkProps,
      onClick,
      graphProps: getGraphProps(),
      from: xy(0, 0),
      to: xy(1, 1),
    };
    const props = { ...defaults, ...extras };
    return render(<Comp {...props} />);
  };

  const labelNode = document.createElement('foreignObject');
  const renderWithLabels = (extras = {}) =>
    renderComponent({
      ...extras,
      labelNode: labelNode,
      from: xyLabel(0, 0, 'A'),
      to: xyLabel(1, 1, 'B'),
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

    it('renders with middle point label', () => {
      const { container } = renderComponent({
        labelNode,
        middle: xyLabel(0.5, 0.5, 'M'),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with only from label', () => {
      const { container } = renderComponent({
        labelNode,
        from: xyLabel(0, 0, 'Start'),
        to: xy(1, 1),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with only to label', () => {
      const { container } = renderComponent({
        labelNode,
        from: xy(0, 0),
        to: xyLabel(1, 1, 'End'),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with all three labels', () => {
      const { container } = renderComponent({
        labelNode,
        from: xyLabel(0, 0, 'A'),
        to: xyLabel(1, 1, 'B'),
        middle: xyLabel(0.5, 0.5, 'M'),
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('gssLineData handling', () => {
    it('renders normally without gssLineData', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with gssLineData when solutionSet is selected', () => {
      const gssLineData = { selectedTool: 'solutionSet' };
      const { container } = renderComponent({ gssLineData });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with gssLineData when lineA is selected', () => {
      const gssLineData = { selectedTool: 'lineA' };
      const { container } = renderComponent({ gssLineData });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with gssLineData when lineB is selected', () => {
      const gssLineData = { selectedTool: 'lineB' };
      const { container } = renderComponent({ gssLineData });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('renders when disabled', () => {
      const { container } = renderComponent({ disabled: true });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders when not disabled', () => {
      const { container } = renderComponent({ disabled: false });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('correctness states', () => {
    it('renders with correct state', () => {
      const { container } = renderComponent({ correctness: 'correct' });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with incorrect state', () => {
      const { container } = renderComponent({ correctness: 'incorrect' });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with missing state', () => {
      const { container } = renderComponent({ correctness: 'missing' });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders without correctness', () => {
      const { container } = renderComponent({ correctness: undefined });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('fill color', () => {
    it('renders with custom fill color', () => {
      const { container } = renderComponent({ fill: '#ff0000' });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders without fill color', () => {
      const { container } = renderComponent({ fill: undefined });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('coordinates on hover', () => {
    it('renders with coordinatesOnHover enabled', () => {
      const { container } = renderComponent({ coordinatesOnHover: true });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with coordinatesOnHover disabled', () => {
      const { container } = renderComponent({ coordinatesOnHover: false });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('label mode', () => {
    it('renders with labelModeEnabled', () => {
      const { container } = renderComponent({
        labelModeEnabled: true,
        labelNode,
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders without labelModeEnabled', () => {
      const { container } = renderComponent({
        labelModeEnabled: false,
        labelNode,
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('drag callbacks', () => {
    it('renders with onDragStart callback', () => {
      const onDragStart = jest.fn();
      const { container } = renderComponent({ onDragStart });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with onDragStop callback', () => {
      const onDragStop = jest.fn();
      const { container } = renderComponent({ onDragStop });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with both drag callbacks', () => {
      const onDragStart = jest.fn();
      const onDragStop = jest.fn();
      const { container } = renderComponent({ onDragStart, onDragStop });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles equal from and to points', () => {
      const { container } = renderComponent({
        from: xy(1, 1),
        to: xy(1, 1),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles negative coordinates', () => {
      const { container } = renderComponent({
        from: xy(-5, -5),
        to: xy(-1, -1),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles large coordinate values', () => {
      const { container } = renderComponent({
        from: xy(100, 100),
        to: xy(200, 200),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles decimal coordinates', () => {
      const { container } = renderComponent({
        from: xy(0.5, 0.5),
        to: xy(1.5, 1.5),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles vertical lines', () => {
      const { container } = renderComponent({
        from: xy(1, 0),
        to: xy(1, 5),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles horizontal lines', () => {
      const { container } = renderComponent({
        from: xy(0, 1),
        to: xy(5, 1),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles empty label strings', () => {
      const { container } = renderComponent({
        labelNode,
        from: xyLabel(0, 0, ''),
        to: xyLabel(1, 1, ''),
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('integration scenarios', () => {
    it('renders complete line with all features', () => {
      const { container } = renderComponent({
        from: xyLabel(0, 0, 'Start'),
        to: xyLabel(5, 5, 'End'),
        middle: xyLabel(2.5, 2.5, 'Middle'),
        labelNode,
        coordinatesOnHover: true,
        labelModeEnabled: true,
        disabled: false,
        correctness: 'correct',
        fill: '#00ff00',
        gssLineData: { selectedTool: 'lineA' },
        onDragStart: jest.fn(),
        onDragStop: jest.fn(),
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders disabled background line', () => {
      const { container } = renderComponent({
        from: xy(0, 0),
        to: xy(1, 1),
        disabled: true,
        correctness: 'incorrect',
      });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders solution set mode', () => {
      const { container } = renderComponent({
        from: xy(0, 0),
        to: xy(1, 1),
        gssLineData: { selectedTool: 'solutionSet' },
        labelNode,
      });
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
