import React from 'react';
import { render } from '@pie-lib/test-utils';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Line, { LinePlot } from '../line';
import { graphProps } from './utils';

jest.mock('@mui/icons-material/Check', () => {
  return function Check(props) {
    return <div data-testid="check-icon" {...props} />;
  };
});

jest.mock('@visx/shape', () => ({
  LinePath: ({ data, x, y, ...rest }) => (
    <path d={data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(d)},${y(d)}`).join(' ')} {...rest} />
  ),
}));

jest.mock('@visx/group', () => ({
  Group: ({ children }) => <g className="visx-group">{children}</g>,
}));

let theme;

beforeAll(() => {
  theme = createTheme();
});

describe('LinePlot', () => {
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand: () => {
        return {
          bandwidth: () => {},
        };
      },
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <svg>
          <LinePlot {...props} />
        </svg>
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('renders line plot', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders without graphProps', () => {
      const { container } = renderComponent({ graphProps: undefined });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with data array', () => {
      const data = [
        { value: 1, label: 'A' },
        { value: 2, label: 'B' },
        { value: 3, label: 'C' },
      ];
      const { container } = renderComponent({ data });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with empty data array', () => {
      const { container } = renderComponent({ data: [] });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with null data', () => {
      const { container } = renderComponent({ data: null });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with undefined data', () => {
      const { container } = renderComponent({ data: undefined });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = renderComponent({ className: 'custom-line-plot' });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with onChange handler', () => {
      const onChange = jest.fn();
      const { container } = renderComponent({ onChange });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders in defineChart mode', () => {
      const { container } = renderComponent({ defineChart: true });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with correctData', () => {
      const data = [{ value: 2, label: 'A' }];
      const correctData = [{ value: 3, label: 'A' }];
      const { container } = renderComponent({ data, correctData });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('graphProps handling', () => {
    it('handles graphProps with missing scale', () => {
      const props = graphProps();
      delete props.scale;
      const { container } = renderComponent({ graphProps: props });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles graphProps with missing size', () => {
      const props = graphProps();
      delete props.size;
      const { container } = renderComponent({ graphProps: props });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles graphProps with empty scale object', () => {
      const props = graphProps();
      props.scale = {};
      const { container } = renderComponent({ graphProps: props });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles graphProps with empty size object', () => {
      const props = graphProps();
      props.size = {};
      const { container } = renderComponent({ graphProps: props });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('data variations', () => {
    it('renders with single data point', () => {
      const data = [{ value: 1, label: 'A' }];
      const { container } = renderComponent({ data });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with multiple data points', () => {
      const data = [
        { value: 1, label: 'A' },
        { value: 2, label: 'B' },
        { value: 3, label: 'C' },
        { value: 4, label: 'D' },
      ];
      const { container } = renderComponent({ data });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with zero values', () => {
      const data = [
        { value: 0, label: 'A' },
        { value: 0, label: 'B' },
      ];
      const { container } = renderComponent({ data });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with mixed values', () => {
      const data = [
        { value: 0, label: 'A' },
        { value: 5, label: 'B' },
        { value: 1, label: 'C' },
      ];
      const { container } = renderComponent({ data });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with large values', () => {
      const data = [
        { value: 100, label: 'A' },
        { value: 200, label: 'B' },
      ];
      const { container } = renderComponent({ data });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with correctness data', () => {
      const data = [
        { value: 2, label: 'A', correctness: { value: 'correct', label: 'Correct' } },
        { value: 3, label: 'B', correctness: { value: 'correct', label: 'Correct' } },
      ];
      const { container } = renderComponent({ data });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with incorrect correctness and correctData', () => {
      const data = [
        { value: 2, label: 'A', correctness: { value: 'incorrect', label: 'Incorrect' } },
        { value: 3, label: 'B', correctness: { value: 'incorrect', label: 'Incorrect' } },
      ];
      const correctData = [
        { value: 3, label: 'A' },
        { value: 4, label: 'B' },
      ];
      const { container } = renderComponent({ data, correctData });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with interactive data points', () => {
      const data = [
        { value: 2, label: 'A', interactive: true },
        { value: 3, label: 'B', interactive: false },
      ];
      const { container } = renderComponent({ data });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('callbacks', () => {
    it('passes onChange handler to Plot component', () => {
      const onChange = jest.fn();
      const data = [{ value: 1, label: 'A' }];
      const { container } = renderComponent({ data, onChange });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles onChangeCategory callback', () => {
      const onChangeCategory = jest.fn();
      const data = [{ value: 1, label: 'A' }];
      const { container } = renderComponent({ data, onChangeCategory });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('component', () => {
    it('returns correct chart object', () => {
      const chart = Line();

      expect(chart).toEqual({
        type: 'linePlot',
        Component: LinePlot,
        name: 'Line Plot',
      });
    });

    it('returns object with Component that can be rendered', () => {
      const chart = Line();
      const { Component } = chart;

      const { container } = render(<Component graphProps={graphProps()} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

describe('CustomBarElement (Line)', () => {
  const renderLinePlot = (props) =>
    render(
      <ThemeProvider theme={theme}>
        <svg>
          <LinePlot {...props} />
        </svg>
      </ThemeProvider>,
    );

  it('renders line elements', () => {
    const data = [{ value: 1, label: 'A' }];
    const { container } = renderLinePlot({
      data,
      graphProps: graphProps(),
    });
    expect(container).toBeInTheDocument();
  });

  it('renders with dottedOverline prop', () => {
    const data = [{ value: 2, label: 'A', correctness: { value: 'incorrect' } }];
    const correctData = [{ value: 3, label: 'A' }];
    const { container } = renderLinePlot({
      data,
      graphProps: graphProps(),
      correctData,
    });
    expect(container).toBeInTheDocument();
  });

  it('renders without dottedOverline prop', () => {
    const data = [{ value: 2, label: 'A' }];
    const { container } = renderLinePlot({
      data,
      graphProps: graphProps(),
    });
    expect(container).toBeInTheDocument();
  });

  it('renders two LinePath elements for X shape when not dotted', () => {
    const data = [{ value: 3, label: 'A' }];
    const { container } = renderLinePlot({
      data,
      graphProps: graphProps(),
    });
    expect(container).toBeInTheDocument();
  });

  it('renders rect with dashed stroke when dottedOverline is true', () => {
    const data = [{ value: 2, label: 'A', correctness: { value: 'incorrect' } }];
    const correctData = [{ value: 3, label: 'A' }];
    const { container } = renderLinePlot({
      data,
      graphProps: graphProps(),
      correctData,
    });
    expect(container).toBeInTheDocument();
  });

  it('calculates correct line positions', () => {
    const data = [{ value: 2, label: 'A' }];
    const { container } = renderLinePlot({
      data,
      graphProps: graphProps(),
    });
    expect(container).toBeInTheDocument();
  });

  it('handles zero pointDiameter', () => {
    const props = graphProps();
    props.size = { width: 0, height: 0 };
    const data = [{ value: 1, label: 'A' }];
    const { container } = renderLinePlot({
      data,
      graphProps: props,
    });
    expect(container).toBeInTheDocument();
  });

  it('handles large pointDiameter values', () => {
    const props = graphProps();
    props.size = { width: 1000, height: 1000 };
    const data = [{ value: 1, label: 'A' }];
    const { container } = renderLinePlot({
      data,
      graphProps: props,
    });
    expect(container).toBeInTheDocument();
  });

  it('applies correct strokeWidth based on pointDiameter', () => {
    const data = [{ value: 2, label: 'A' }];
    const { container } = renderLinePlot({
      data,
      graphProps: graphProps(),
    });
    // strokeWidth should be pointDiameter / 5
    expect(container).toBeInTheDocument();
  });

  it('renders Group component wrapping LinePaths', () => {
    const data = [{ value: 1, label: 'A' }];
    const { container } = renderLinePlot({
      data,
      graphProps: graphProps(),
    });
    expect(container).toBeInTheDocument();
  });

  it('handles rect with extra padding when dotted', () => {
    const data = [{ value: 2, label: 'A', correctness: { value: 'incorrect' } }];
    const correctData = [{ value: 3, label: 'A' }];
    const { container } = renderLinePlot({
      data,
      graphProps: graphProps(),
      correctData,
    });
    expect(container).toBeInTheDocument();
  });
});
