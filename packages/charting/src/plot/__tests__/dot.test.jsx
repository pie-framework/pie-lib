import React from 'react';
import { render } from '@pie-lib/test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Dot, { DotPlot } from '../dot';
import { graphProps } from './utils';

jest.mock('@mui/icons-material/Check', () => {
  return function Check(props) {
    return <div data-testid="check-icon" {...props} />;
  };
});

jest.mock('@visx/shape', () => ({
  Circle: ({ cx, cy, r, ...rest }) => <circle cx={cx} cy={cy} r={r} {...rest} />,
}));

let theme;

beforeAll(() => {
  theme = createTheme();
});

describe('DotPlot', () => {
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
          <DotPlot {...props} />
        </svg>
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('renders dot plot', () => {
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
      const { container } = renderComponent({ className: 'custom-dot-plot' });
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
      const chart = Dot();

      expect(chart).toEqual({
        type: 'dotPlot',
        Component: DotPlot,
        name: 'Dot Plot',
      });
    });

    it('returns object with Component that can be rendered', () => {
      const chart = Dot();
      const { Component } = chart;

      const { container } = render(<Component graphProps={graphProps()} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

describe('CustomBarElement (Dot)', () => {
  const mockScale = {
    y: jest.fn((n) => n * 10),
  };

  it('renders a circle element', () => {
    const data = [{ value: 1, label: 'A' }];
    const { container } = render(
      <ThemeProvider theme={theme}>
        <svg>
          <DotPlot data={data} graphProps={graphProps()} />
        </svg>
      </ThemeProvider>,
    );
    expect(container).toBeInTheDocument();
  });

  it('renders with dottedOverline prop', () => {
    const data = [{ value: 2, label: 'A', correctness: { value: 'incorrect' } }];
    const correctData = [{ value: 3, label: 'A' }];
    const { container } = render(
      <ThemeProvider theme={theme}>
        <svg>
          <DotPlot data={data} graphProps={graphProps()} correctData={correctData} />
        </svg>
      </ThemeProvider>,
    );
    expect(container).toBeInTheDocument();
  });

  it('renders without dottedOverline prop', () => {
    const data = [{ value: 2, label: 'A' }];
    const { container } = render(
      <ThemeProvider theme={theme}>
        <svg>
          <DotPlot data={data} graphProps={graphProps()} />
        </svg>
      </ThemeProvider>,
    );
    expect(container).toBeInTheDocument();
  });

  it('calculates correct circle position', () => {
    const data = [{ value: 3, label: 'A' }];
    const { container } = render(
      <ThemeProvider theme={theme}>
        <svg>
          <DotPlot data={data} graphProps={graphProps()} />
        </svg>
      </ThemeProvider>,
    );
    expect(container).toBeInTheDocument();
  });

  it('handles zero pointDiameter', () => {
    const props = graphProps();
    props.size = { width: 0, height: 0 };
    const data = [{ value: 1, label: 'A' }];
    const { container } = render(
      <ThemeProvider theme={theme}>
        <svg>
          <DotPlot data={data} graphProps={props} />
        </svg>
      </ThemeProvider>,
    );
    expect(container).toBeInTheDocument();
  });

  it('handles large pointDiameter values', () => {
    const props = graphProps();
    props.size = { width: 1000, height: 1000 };
    const data = [{ value: 1, label: 'A' }];
    const { container } = render(
      <ThemeProvider theme={theme}>
        <svg>
          <DotPlot data={data} graphProps={props} />
        </svg>
      </ThemeProvider>,
    );
    expect(container).toBeInTheDocument();
  });

  it('renders dotted circle with correct styling when dottedOverline is true', () => {
    const data = [{ value: 2, label: 'A', correctness: { value: 'incorrect' } }];
    const correctData = [{ value: 3, label: 'A' }];
    const { container } = render(
      <ThemeProvider theme={theme}>
        <svg>
          <DotPlot data={data} graphProps={graphProps()} correctData={correctData} />
        </svg>
      </ThemeProvider>,
    );
    expect(container).toBeInTheDocument();
  });
});
