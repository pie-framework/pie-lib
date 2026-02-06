import React from 'react';
import { render } from '@pie-lib/test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ChartAxes, { RawChartAxes, TickComponent } from '../axes';
import { createBandScale, graphProps } from './utils';

const theme = createTheme();

describe('ChartAxes', () => {
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand: createBandScale(['a', 'b', 'c'], [0, 400]),
      categories: [],
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <svg>
          <ChartAxes {...props} />
        </svg>
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('renders axes container', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders SVG with axes group', () => {
      const { container } = renderComponent();
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // Component renders StyledAxesGroup which is a <g> element
      const axesGroup = container.querySelector('g');
      expect(axesGroup).toBeInTheDocument();
    });
  });
});

describe('RawChartAxes', () => {
  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      graphProps: graphProps(),
      xBand: createBandScale(['a', 'b', 'c'], [0, 400]),
      categories: [],
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <svg>
          <RawChartAxes {...props} />
        </svg>
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('renders raw axes container', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders SVG with axes group', () => {
      const { container } = renderComponent();
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // Component renders StyledAxesGroup which is a <g> element
      const axesGroup = container.querySelector('g');
      expect(axesGroup).toBeInTheDocument();
    });
  });
});

describe('TickComponent', () => {
  const renderComponent = (extras) => {
    const defaults = {
      graphProps: graphProps(),
      xBand: createBandScale(['a', 'b', 'c'], [0, 400]),
      categories: [{ value: 1, label: 'test', editable: false, interactive: false }],
      formattedValue: '0-test',
      bandWidth: 100,
      barWidth: 100,
      x: 50,
      y: 50,
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <svg>
          <TickComponent {...props} />
        </svg>
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('renders tick component', () => {
      const { container } = renderComponent();
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // TickComponent renders a <g> element
      expect(container.querySelector('g')).toBeInTheDocument();
    });

    it('renders with categories', () => {
      const { container } = renderComponent({
        formattedValue: '0-test',
        categories: [{ value: 1, label: 'test', editable: false, interactive: false }],
      });
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(container.querySelector('g')).toBeInTheDocument();
    });
  });

  // Note: splitText and changeCategory are internal implementation details.
  // In RTL philosophy, we test user-visible behavior rather than implementation.
  // These methods would be tested indirectly through their effects on the rendered output.
});
