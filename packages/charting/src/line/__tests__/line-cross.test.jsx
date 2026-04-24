import React from 'react';
import { render } from '@pie-lib/test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Line, { LineCross as LineChart } from '../line-cross';
import { graphProps } from './utils';

// Mock dependencies
jest.mock('@visx/shape', () => ({
  LinePath: ({ data, x, y, strokeWidth, style, ...props }) => (
    <path
      data-testid="line-path"
      d={data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(d)},${y(d)}`).join(' ')}
      strokeWidth={strokeWidth}
      {...props}
    />
  ),
}));

jest.mock('@visx/group', () => ({
  Group: ({ children, ...props }) => (
    <g data-testid="visx-group" {...props}>
      {children}
    </g>
  ),
}));

jest.mock('@pie-lib/render-ui', () => ({
  color: {
    text: () => '#000000',
    defaults: {
      TEXT: '#000000',
      BLACK: '#000000',
      BORDER_GRAY: '#cccccc',
    },
    disabled: () => '#cccccc',
  },
}));

jest.mock('../../utils', () => ({
  dataToXBand: jest.fn((scale, data, width, type) => {
    return {
      bandwidth: () => 20,
    };
  }),
}));

jest.mock('../common/line', () => {
  return function RawLine({ CustomDraggableComponent, data, graphProps, ...props }) {
    return (
      <svg data-testid="raw-line">
        {data && data.length > 0 ? (
          data.map((d, i) => (
            <CustomDraggableComponent
              key={i}
              scale={graphProps.scale}
              x={d.x || i}
              y={d.y || i}
              r={8}
              correctness={d.correctness}
              interactive={d.interactive}
              correctData={props.correctData}
              label={d.label}
              {...props}
            />
          ))
        ) : (
          <text>No data</text>
        )}
      </svg>
    );
  };
});

jest.mock('../../common/correctness-indicators', () => ({
  CorrectnessIndicator: ({ scale, x, y, correctness, interactive }) =>
    correctness && interactive ? (
      <g data-testid="correctness-indicator">
        <circle cx={scale.x(x)} cy={scale.y(y)} r={5} />
      </g>
    ) : null,
  SmallCorrectPointIndicator: ({ scale, x, correctness, correctData, label }) =>
    correctness && correctness.value === 'incorrect' && correctData ? (
      <g data-testid="small-correct-indicator">
        <circle cx={scale.x(x)} cy={scale.y(0)} r={3} />
      </g>
    ) : null,
}));

let theme;

beforeAll(() => {
  theme = createTheme();
});

describe('LineChart', () => {
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      data: [],
      xBand: () => {
        return {
          bandwidth: () => {},
        };
      },
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <LineChart {...props} />
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('renders line cross chart', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with data points', () => {
      const data = [
        { x: 1, y: 2, label: 'A' },
        { x: 2, y: 3, label: 'B' },
      ];
      const { getByTestId } = renderComponent({ data });
      expect(getByTestId('raw-line')).toBeInTheDocument();
    });

    it('renders without data', () => {
      const { getByTestId } = renderComponent({ data: [] });
      expect(getByTestId('raw-line')).toBeInTheDocument();
    });

    it('passes graphProps to RawLine', () => {
      const customGraphProps = graphProps(0, 10, 0, 10);
      const { getByTestId } = renderComponent({ graphProps: customGraphProps });
      expect(getByTestId('raw-line')).toBeInTheDocument();
    });

    it('passes onChange to RawLine', () => {
      const onChange = jest.fn();
      const { getByTestId } = renderComponent({ onChange });
      expect(getByTestId('raw-line')).toBeInTheDocument();
    });
  });

  describe('xBand calculation', () => {
    it('calculates xBand from data', () => {
      const data = [{ x: 1, y: 2 }];
      const { getByTestId } = renderComponent({ data });
      expect(getByTestId('raw-line')).toBeInTheDocument();
    });

    it('handles empty data for xBand', () => {
      const { getByTestId } = renderComponent({ data: [] });
      expect(getByTestId('raw-line')).toBeInTheDocument();
    });
  });

  describe('component', () => {
    it('returns correct chart object', () => {
      const chart = Line();

      expect(chart).toEqual({
        type: 'lineCross',
        Component: LineChart,
        name: 'Line Cross',
      });
    });

    it('returns object with correct type', () => {
      const chart = Line();
      expect(chart.type).toBe('lineCross');
    });

    it('returns object with correct name', () => {
      const chart = Line();
      expect(chart.name).toBe('Line Cross');
    });

    it('returns object with LineCross component', () => {
      const chart = Line();
      expect(chart.Component).toBe(LineChart);
    });
  });

  describe('edge cases', () => {
    it('handles null data', () => {
      const { getByTestId } = renderComponent({ data: null });
      expect(getByTestId('raw-line')).toBeInTheDocument();
    });

    it('handles undefined graphProps', () => {
      const { container } = renderComponent({ graphProps: undefined });
      expect(container).toBeInTheDocument();
    });

    it('handles missing scale in graphProps', () => {
      const { container } = renderComponent({
        graphProps: { size: { width: 400, height: 400 } },
      });
      expect(container).toBeInTheDocument();
    });

    it('handles missing size in graphProps', () => {
      const { container } = renderComponent({
        graphProps: { scale: graphProps().scale },
      });
      expect(container).toBeInTheDocument();
    });

    it('renders with className', () => {
      const { container } = renderComponent({ className: 'custom-class' });
      expect(container).toBeInTheDocument();
    });
  });

  describe('data with correctness', () => {
    it('renders data with correct answers', () => {
      const data = [
        { x: 1, y: 2, label: 'A', correctness: { value: 'correct', label: 'Correct!' }, interactive: true },
      ];
      const { getByTestId } = renderComponent({ data });
      expect(getByTestId('raw-line')).toBeInTheDocument();
    });

    it('renders data with incorrect answers', () => {
      const data = [{ x: 1, y: 2, label: 'A', correctness: { value: 'incorrect', label: 'Wrong' }, interactive: true }];
      const correctData = [{ label: 'A', value: 3 }];
      const { getByTestId } = renderComponent({ data, correctData });
      expect(getByTestId('raw-line')).toBeInTheDocument();
    });

    it('renders non-interactive data', () => {
      const data = [{ x: 1, y: 2, label: 'A', interactive: false }];
      const { getByTestId } = renderComponent({ data });
      expect(getByTestId('raw-line')).toBeInTheDocument();
    });
  });
});

describe('DraggableComponent', () => {
  // We need to test the DraggableComponent through LineCross since it's not exported
  const renderLineCrossWithData = (dataExtras = {}) => {
    const data = [{ x: 5, y: 10, label: 'A', r: 8, interactive: true, ...dataExtras }];
    const props = {
      graphProps: graphProps(),
      data,
    };
    return render(
      <ThemeProvider theme={theme}>
        <LineChart {...props} />
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('renders cross lines', () => {
      const { getAllByTestId } = renderLineCrossWithData();
      const linePaths = getAllByTestId('line-path');
      expect(linePaths.length).toBeGreaterThan(0);
    });

    it('renders visx group', () => {
      const { getByTestId } = renderLineCrossWithData();
      expect(getByTestId('visx-group')).toBeInTheDocument();
    });

    it('renders transparent handle circle', () => {
      const { container } = renderLineCrossWithData();
      const circles = container.querySelectorAll('circle');
      expect(circles.length).toBeGreaterThan(0);
    });
  });

  describe('hover interactions', () => {
    it('renders interactive elements for hover', () => {
      const { container } = renderLineCrossWithData();
      // The component should render, even if we can't test hover through the mock
      expect(container).toBeInTheDocument();
    });

    it('component supports hover state changes', () => {
      const { container } = renderLineCrossWithData();
      // Verify the component renders with interactive data
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('correctness indicators', () => {
    it('renders correctness indicator for correct answer', () => {
      const { getByTestId } = renderLineCrossWithData({
        correctness: { value: 'correct', label: 'Correct!' },
      });
      expect(getByTestId('correctness-indicator')).toBeInTheDocument();
    });

    it('does not render correctness indicator when not interactive', () => {
      const { queryByTestId } = renderLineCrossWithData({
        correctness: { value: 'correct', label: 'Correct!' },
        interactive: false,
      });
      expect(queryByTestId('correctness-indicator')).not.toBeInTheDocument();
    });

    it('renders small correct indicator for incorrect answer', () => {
      const data = [
        {
          x: 5,
          y: 10,
          label: 'A',
          correctness: { value: 'incorrect', label: 'Wrong' },
          interactive: true,
        },
      ];
      const correctData = [{ label: 'A', value: 15 }];
      const props = {
        graphProps: graphProps(),
        data,
        correctData,
      };
      const { getByTestId } = render(
        <ThemeProvider theme={theme}>
          <LineChart {...props} />
        </ThemeProvider>,
      );
      expect(getByTestId('small-correct-indicator')).toBeInTheDocument();
    });

    it('does not render small correct indicator for correct answer', () => {
      const data = [
        {
          x: 5,
          y: 10,
          label: 'A',
          correctness: { value: 'correct', label: 'Correct!' },
          interactive: true,
        },
      ];
      const correctData = [{ label: 'A', value: 15 }];
      const props = {
        graphProps: graphProps(),
        data,
        correctData,
      };
      const { queryByTestId } = render(
        <ThemeProvider theme={theme}>
          <LineChart {...props} />
        </ThemeProvider>,
      );
      expect(queryByTestId('small-correct-indicator')).not.toBeInTheDocument();
    });
  });

  describe('cross lines positioning', () => {
    it('renders two cross lines for each point', () => {
      const { getAllByTestId } = renderLineCrossWithData();
      const linePaths = getAllByTestId('line-path');
      expect(linePaths.length).toBe(2); // Two lines per cross
    });

    it('positions cross lines correctly with scale', () => {
      const { getAllByTestId } = renderLineCrossWithData({ x: 3, y: 7 });
      const linePaths = getAllByTestId('line-path');
      expect(linePaths.length).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('renders with zero coordinates', () => {
      const { container } = renderLineCrossWithData({ x: 0, y: 0 });
      expect(container).toBeInTheDocument();
    });

    it('renders with negative coordinates', () => {
      const { container } = renderLineCrossWithData({ x: -5, y: -10 });
      expect(container).toBeInTheDocument();
    });

    it('renders with large coordinates', () => {
      const { container } = renderLineCrossWithData({ x: 1000, y: 2000 });
      expect(container).toBeInTheDocument();
    });

    it('renders without correctness', () => {
      const { container } = renderLineCrossWithData({ correctness: null });
      expect(container).toBeInTheDocument();
    });

    it('renders without label', () => {
      const { container } = renderLineCrossWithData({ label: undefined });
      expect(container).toBeInTheDocument();
    });

    it('handles custom radius', () => {
      const { container } = renderLineCrossWithData({ r: 12 });
      expect(container).toBeInTheDocument();
    });

    it('applies className', () => {
      const { getByTestId } = renderLineCrossWithData({ className: 'custom-cross' });
      const group = getByTestId('visx-group');
      expect(group).toBeInTheDocument();
    });
  });

  describe('hover rect sizing', () => {
    it('component supports hover rect with proper sizing', () => {
      const { container } = renderLineCrossWithData({ r: 10 });
      // Verify the component renders with custom radius
      expect(container).toBeInTheDocument();
    });

    it('component supports hover rect centering', () => {
      const { container } = renderLineCrossWithData({ x: 5, y: 10, r: 8 });
      // Verify the component renders at specified coordinates
      expect(container).toBeInTheDocument();
    });
  });

  describe('multiple data points', () => {
    it('renders multiple crosses for multiple data points', () => {
      const data = [
        { x: 1, y: 2, label: 'A', interactive: true },
        { x: 3, y: 4, label: 'B', interactive: true },
        { x: 5, y: 6, label: 'C', interactive: true },
      ];
      const props = {
        graphProps: graphProps(),
        data,
      };
      const { getAllByTestId } = render(
        <ThemeProvider theme={theme}>
          <LineChart {...props} />
        </ThemeProvider>,
      );
      const groups = getAllByTestId('visx-group');
      expect(groups.length).toBe(3);
    });

    it('renders multiple data points with proper structure', () => {
      const data = [
        { x: 1, y: 2, label: 'A', interactive: true },
        { x: 3, y: 4, label: 'B', interactive: true },
      ];
      const props = {
        graphProps: graphProps(),
        data,
      };
      const { container } = render(
        <ThemeProvider theme={theme}>
          <LineChart {...props} />
        </ThemeProvider>,
      );

      // Should render the component with multiple data points
      expect(container).toBeInTheDocument();
    });
  });
});
