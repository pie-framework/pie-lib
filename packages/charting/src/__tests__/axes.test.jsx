import React from 'react';
import { fireEvent, render } from '@pie-lib/test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ChartAxes, { RawChartAxes, TickComponent } from '../axes';
import { createBandScale, graphProps } from './utils';

jest.mock('@visx/axis', () => ({
  AxisLeft: ({ children, ...props }) => (
    <g data-testid="axis-left" {...props}>
      {typeof children === 'function' ? children({ formattedValue: '5' }) : children}
    </g>
  ),
  AxisBottom: ({ children, tickValues, ...props }) => (
    <g data-testid="axis-bottom" {...props}>
      {typeof children === 'function'
        ? (tickValues || ['0-A', '1-B', '2-C']).map((v, i) => children({ formattedValue: v, index: i }))
        : children}
    </g>
  ),
}));

jest.mock('../mark-label', () => {
  return function MarkLabel({ mark, disabled, onChange, error, autoFocus, inputRef, correctnessIndicator }) {
    return (
      <div data-testid="mark-label">
        <input
          data-testid="mark-label-input"
          ref={inputRef}
          value={mark?.label || ''}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.value)}
          autoFocus={autoFocus}
        />
        {error && <span data-testid="mark-label-error">{error}</span>}
        {correctnessIndicator}
      </div>
    );
  };
});

jest.mock('@pie-lib/config-ui', () => ({
  AlertDialog: ({ open, title, text, onClose, onConfirm }) =>
    open ? (
      <div data-testid="alert-dialog">
        <h2>{title}</h2>
        <p>{text}</p>
        <button data-testid="alert-cancel" onClick={onClose}>
          Cancel
        </button>
        <button data-testid="alert-confirm" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    ) : null,
}));

jest.mock('../common/correctness-indicators', () => ({
  TickCorrectnessIndicator: ({ correctness, interactive }) =>
    correctness && interactive ? (
      <div data-testid="tick-correctness-indicator">{correctness.value === 'correct' ? '✓' : '✗'}</div>
    ) : null,
}));

jest.mock('@pie-lib/math-rendering', () => ({
  renderMath: jest.fn((text) => text),
}));

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
      const axesGroup = container.querySelector('g');
      expect(axesGroup).toBeInTheDocument();
    });

    it('renders axes elements', () => {
      const { container } = renderComponent();
      const groups = container.querySelectorAll('g');
      expect(groups.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('handles missing xBand', () => {
      const { container } = renderComponent({ xBand: undefined });
      expect(container).toBeInTheDocument();
    });

    it('handles empty categories', () => {
      const { container } = renderComponent({ categories: [] });
      expect(container).toBeInTheDocument();
    });

    it('handles null categories', () => {
      const { container } = renderComponent({ categories: null });
      expect(container).toBeInTheDocument();
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
      const axesGroup = container.querySelector('g');
      expect(axesGroup).toBeInTheDocument();
    });

    it('renders both axes when leftAxis is true', () => {
      const { getByTestId } = renderComponent({ leftAxis: true });
      expect(getByTestId('axis-left')).toBeInTheDocument();
      expect(getByTestId('axis-bottom')).toBeInTheDocument();
    });

    it('renders only bottom axis when leftAxis is false', () => {
      const { queryByTestId, getByTestId } = renderComponent({ leftAxis: false });
      expect(queryByTestId('axis-left')).not.toBeInTheDocument();
      expect(getByTestId('axis-bottom')).toBeInTheDocument();
    });
  });
});

describe('TickComponent', () => {
  const defaultCategories = [
    { value: 1, label: 'Category A', editable: true, interactive: true },
    { value: 2, label: 'Category B', editable: true, interactive: true },
  ];

  const renderComponent = (extras) => {
    const defaults = {
      graphProps: graphProps(),
      xBand: createBandScale(['a', 'b', 'c'], [0, 400]),
      categories: defaultCategories,
      formattedValue: '0-Category A',
      bandWidth: 100,
      barWidth: 100,
      x: 50,
      y: 50,
      top: 0,
      onChangeCategory: jest.fn(),
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

    it('renders MarkLabel component', () => {
      const { getAllByTestId } = renderComponent();
      const markLabels = getAllByTestId('mark-label');
      expect(markLabels.length).toBeGreaterThan(0);
    });

    it('renders foreignObject for labels', () => {
      const { container } = renderComponent();
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).toBeInTheDocument();
    });

    it('does not render when formattedValue is null', () => {
      const { container } = renderComponent({ formattedValue: null });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).not.toBeInTheDocument();
    });

    it('does not render when formattedValue is undefined', () => {
      const { container } = renderComponent({ formattedValue: undefined });
      const foreignObject = container.querySelector('foreignObject');
      expect(foreignObject).not.toBeInTheDocument();
    });

    it('renders hidden label for longest category', () => {
      const { getAllByTestId } = renderComponent();
      const markLabels = getAllByTestId('mark-label');
      expect(markLabels.length).toBeGreaterThan(0);
    });
  });

  describe('category label editing', () => {
    it('allows editing category label', () => {
      const onChangeCategory = jest.fn();
      const { getAllByTestId } = renderComponent({ onChangeCategory });

      const inputs = getAllByTestId('mark-label-input');
      const input = inputs[inputs.length - 1];
      fireEvent.change(input, { target: { value: 'New Label' } });

      expect(onChangeCategory).toHaveBeenCalled();
    });

    it('calls changeCategory with correct parameters', () => {
      const onChangeCategory = jest.fn();
      const { getAllByTestId } = renderComponent({ onChangeCategory });

      const inputs = getAllByTestId('mark-label-input');
      const input = inputs[inputs.length - 1];
      fireEvent.change(input, { target: { value: 'Updated' } });

      expect(onChangeCategory).toHaveBeenCalledWith(0, expect.objectContaining({ label: 'Updated' }));
    });

    it('disables editing when editable is false', () => {
      const categories = [{ value: 1, label: 'test', editable: false, interactive: true }];
      const { getAllByTestId } = renderComponent({ categories, formattedValue: '0-test' });

      const inputs = getAllByTestId('mark-label-input');
      const input = inputs[inputs.length - 1];
      expect(input).toBeDisabled();
    });

    it('enables editing in define chart mode', () => {
      const categories = [{ value: 1, label: 'test', editable: true, interactive: true }];
      const { getAllByTestId } = renderComponent({
        categories,
        formattedValue: '0-test',
        defineChart: true,
      });

      const inputs = getAllByTestId('mark-label-input');
      const input = inputs[inputs.length - 1];
      expect(input).not.toBeDisabled();
    });

    it('respects editable property when not in define chart mode', () => {
      const categories = [{ value: 1, label: 'test', editable: true, interactive: true }];
      const { getAllByTestId } = renderComponent({
        categories,
        formattedValue: '0-test',
        defineChart: false,
      });

      const inputs = getAllByTestId('mark-label-input');
      const input = inputs[inputs.length - 1];
      expect(input).not.toBeDisabled();
    });
  });

  describe('interactive checkbox', () => {
    it('shows warning when disabling interactive with correct answer', () => {
      const categories = [
        {
          value: 1,
          label: 'test',
          editable: true,
          interactive: true,
          correctness: { value: 'correct' },
        },
      ];
      const component = new TickComponent({
        categories,
        onChangeCategory: jest.fn(),
      });

      component.setState = jest.fn();
      component.changeInteractive(0, false);

      expect(component.setState).toHaveBeenCalledWith(
        expect.objectContaining({
          dialog: expect.objectContaining({
            open: true,
            title: 'Warning',
          }),
        }),
      );
    });

    it('changes interactive without warning when enabling', () => {
      const onChangeCategory = jest.fn();
      const categories = [{ value: 1, label: 'test', editable: true, interactive: false }];
      const component = new TickComponent({
        categories,
        onChangeCategory,
      });

      component.changeInteractive(0, true);

      expect(onChangeCategory).toHaveBeenCalledWith(0, expect.objectContaining({ interactive: true }));
    });
  });

  describe('editable checkbox', () => {
    it('shows warning when disabling editable with correct answer name', () => {
      const categories = [
        {
          value: 1,
          label: 'test',
          editable: true,
          interactive: true,
          correctness: { value: 'correct' },
        },
      ];
      const component = new TickComponent({
        categories,
        onChangeCategory: jest.fn(),
      });

      component.setState = jest.fn();
      component.changeEditable(0, false);

      expect(component.setState).toHaveBeenCalledWith(
        expect.objectContaining({
          dialog: expect.objectContaining({
            open: true,
            title: 'Warning',
          }),
        }),
      );
    });

    it('changes editable without warning when enabling', () => {
      const onChangeCategory = jest.fn();
      const categories = [{ value: 1, label: 'test', editable: false, interactive: true }];
      const component = new TickComponent({
        categories,
        onChangeCategory,
      });

      component.changeEditable(0, true);

      expect(onChangeCategory).toHaveBeenCalledWith(0, expect.objectContaining({ editable: true }));
    });
  });

  describe('splitText method', () => {
    it('splits text into chunks', () => {
      const component = new TickComponent({ categories: [] });
      const result = component.splitText('This is a long text', 10);

      expect(result.length).toBeGreaterThan(1);
    });

    it('splits at word boundaries', () => {
      const component = new TickComponent({ categories: [] });
      const result = component.splitText('Hello world test', 11);

      expect(result[0]).toBe('Hello world');
    });

    it('handles text shorter than max', () => {
      const component = new TickComponent({ categories: [] });
      const result = component.splitText('Short', 20);

      expect(result).toEqual(['Short']);
    });

    it('handles empty text', () => {
      const component = new TickComponent({ categories: [] });
      const result = component.splitText('', 10);

      expect(result).toEqual([]);
    });

    it('handles null text', () => {
      const component = new TickComponent({ categories: [] });
      const result = component.splitText(null, 10);

      expect(result).toEqual([]);
    });

    it('forces split when no spaces', () => {
      const component = new TickComponent({ categories: [] });
      const result = component.splitText('verylongwordwithoutspaces', 10);

      expect(result.length).toBeGreaterThan(1);
      expect(result[0].length).toBeLessThanOrEqual(10);
    });
  });

  describe('correctness display', () => {
    it('renders correctness indicator when showCorrectness is true', () => {
      const categories = [
        {
          value: 1,
          label: 'test',
          editable: true,
          interactive: true,
          correctness: { value: 'correct', label: 'Correct!' },
        },
      ];
      const { getByTestId } = renderComponent({
        categories,
        formattedValue: '0-test',
        showCorrectness: true,
      });

      expect(getByTestId('tick-correctness-indicator')).toBeInTheDocument();
    });

    it('does not render correctness indicator when showCorrectness is false', () => {
      const categories = [
        {
          value: 1,
          label: 'test',
          editable: true,
          interactive: true,
          correctness: { value: 'correct', label: 'Correct!' },
        },
      ];
      const { queryByTestId } = renderComponent({
        categories,
        formattedValue: '0-test',
        showCorrectness: false,
      });

      expect(queryByTestId('tick-correctness-indicator')).not.toBeInTheDocument();
    });

    it('does not render correctness indicator when not interactive', () => {
      const categories = [
        {
          value: 1,
          label: 'test',
          editable: true,
          interactive: false,
          correctness: { value: 'correct', label: 'Correct!' },
        },
      ];
      const { queryByTestId } = renderComponent({
        categories,
        formattedValue: '0-test',
        showCorrectness: true,
      });

      expect(queryByTestId('tick-correctness-indicator')).not.toBeInTheDocument();
    });
  });

  describe('error display', () => {
    it('renders error message for first category', () => {
      const error = { 0: 'Error message' };
      const { getByTestId } = renderComponent({
        error,
        formattedValue: '0-test',
      });

      expect(getByTestId('mark-label-error')).toBeInTheDocument();
    });

    it('renders distinct error messages', () => {
      const error = { 0: 'Error 1', 1: 'Error 1', 2: 'Error 2' };
      const { container } = renderComponent({
        error,
        formattedValue: '0-test',
      });

      const errorText = container.querySelector('text');
      expect(errorText).toBeInTheDocument();
    });

    it('does not render error when no error prop', () => {
      const { queryByTestId } = renderComponent({ error: null });
      expect(queryByTestId('mark-label-error')).not.toBeInTheDocument();
    });
  });

  describe('autoFocus handling', () => {
    it('handles autoFocus prop', () => {
      const onAutoFocusUsed = jest.fn();
      const { rerender } = renderComponent({
        autoFocus: false,
        onAutoFocusUsed,
      });

      rerender(
        <ThemeProvider theme={theme}>
          <svg>
            <TickComponent
              {...{
                graphProps: graphProps(),
                xBand: createBandScale(['a', 'b', 'c'], [0, 400]),
                categories: defaultCategories,
                formattedValue: '0-Category A',
                bandWidth: 100,
                barWidth: 100,
                x: 50,
                y: 50,
                top: 0,
                onChangeCategory: jest.fn(),
                autoFocus: true,
                onAutoFocusUsed,
              }}
            />
          </svg>
        </ThemeProvider>,
      );

      expect(onAutoFocusUsed).toHaveBeenCalled();
    });
  });

  describe('define chart mode', () => {
    it('renders interactive checkboxes when changeInteractiveEnabled', () => {
      const chartingOptions = {
        changeInteractive: { authoringLabel: 'Allow students to change' },
      };
      const { container } = renderComponent({
        defineChart: true,
        chartingOptions,
        changeInteractiveEnabled: true,
        formattedValue: '0-test',
      });

      const text = container.querySelector('text');
      expect(text).toBeInTheDocument();
    });

    it('renders editable checkboxes when changeEditableEnabled', () => {
      const chartingOptions = {
        changeEditable: { authoringLabel: 'Allow label editing' },
      };
      const { container } = renderComponent({
        defineChart: true,
        chartingOptions,
        changeEditableEnabled: true,
        formattedValue: '0-test',
      });

      const text = container.querySelector('text');
      expect(text).toBeInTheDocument();
    });

    it('splits long authoring labels', () => {
      const chartingOptions = {
        changeInteractive: { authoringLabel: 'This is a very long label that needs to be split' },
      };
      const { container } = renderComponent({
        defineChart: true,
        chartingOptions,
        changeInteractiveEnabled: true,
        formattedValue: '0-test',
      });

      const tspans = container.querySelectorAll('tspan');
      expect(tspans.length).toBeGreaterThan(1);
    });
  });

  describe('edge cases', () => {
    it('handles missing category', () => {
      const { container } = renderComponent({
        categories: [],
        formattedValue: '0-missing',
      });
      expect(container).toBeInTheDocument();
    });

    it('handles invalid formattedValue format', () => {
      const { container } = renderComponent({
        formattedValue: 'invalid',
      });
      expect(container).toBeInTheDocument();
    });

    it('handles missing graphProps', () => {
      const { container } = renderComponent({
        graphProps: null,
      });
      expect(container).toBeInTheDocument();
    });

    it('handles zero barWidth', () => {
      const { container } = renderComponent({
        barWidth: 0,
      });
      expect(container).toBeInTheDocument();
    });

    it('handles negative coordinates', () => {
      const { container } = renderComponent({
        x: -10,
        y: -20,
      });
      expect(container).toBeInTheDocument();
    });
  });

  describe('componentDidUpdate', () => {
    it('calls onAutoFocusUsed when autoFocus changes to true', () => {
      const onAutoFocusUsed = jest.fn();
      const component = new TickComponent({
        autoFocus: false,
        onAutoFocusUsed,
      });

      component.componentDidUpdate({ autoFocus: false });
      expect(onAutoFocusUsed).not.toHaveBeenCalled();

      component.props = { autoFocus: true, onAutoFocusUsed };
      component.componentDidUpdate({ autoFocus: false });
      expect(onAutoFocusUsed).toHaveBeenCalled();
    });
  });
});
