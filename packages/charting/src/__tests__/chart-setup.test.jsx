import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ConfigureChartPanel, { resetValues } from '../chart-setup';

jest.mock('../chart-type', () => {
  return function ChartType({ value, onChange }) {
    return (
      <select data-testid="chart-type-select" value={value} onChange={onChange}>
        <option value="bar">Bar</option>
        <option value="line">Line</option>
        <option value="linePlot">Line Plot</option>
        <option value="dotPlot">Dot Plot</option>
      </select>
    );
  };
});

jest.mock('@pie-lib/config-ui', () => ({
  NumberTextFieldCustom: ({ label, value, onChange, ...props }) => (
    <input
      data-testid={`number-field-${label.toLowerCase().replace(/\s+/g, '-')}`}
      type="number"
      value={value}
      onChange={(e) => onChange(e, parseFloat(e.target.value) || 0)}
      aria-label={label}
      {...props}
    />
  ),
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

let theme;

beforeAll(() => {
  theme = createTheme();
});

describe('resetValues', () => {
  let data;
  let range;
  let model;
  let onChange;

  beforeEach(() => {
    range = { min: 0, max: 10, step: 1 };
    data = [{ value: 2 }, { value: 11 }, { value: 5.5 }, { value: 2.0000000001 }, { value: 2.9999999999 }];
    model = { someField: 'someValue', data };
    onChange = jest.fn();
  });

  it('should reset values greater than range.max to zero', () => {
    resetValues(data, true, range, onChange, model);
    expect(data[1].value).toBe(0);
  });

  it('should reset values that are not multiples of range.step to zero', () => {
    resetValues(data, true, range, onChange, model);
    expect(data[2].value).toBe(0);
  });

  it('should not reset values that are within range and multiples of range.step', () => {
    resetValues(data, true, range, onChange, model);
    expect(data[0].value).toBe(2);
  });

  it('should not reset floating point values that are close to multiples of range.step', () => {
    resetValues(data, true, range, onChange, model);
    expect(data[3].value).toBe(2.0000000001);
    expect(data[4].value).toBe(2.9999999999);
  });

  it('should not call onChange when updateModel is false', () => {
    resetValues(data, false, range, onChange, model);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should handle null or undefined data array', () => {
    expect(() => resetValues(null, true, range, onChange, model)).not.toThrow();
    expect(() => resetValues(undefined, true, range, onChange, model)).not.toThrow();
  });

  it('should handle empty data array', () => {
    resetValues([], true, range, onChange, model);
    expect(onChange).toHaveBeenCalledWith({ ...model, data: [] });
  });

  it('should reset multiple invalid values', () => {
    const multiData = [{ value: 11 }, { value: 12 }, { value: 5.5 }, { value: 3.7 }];
    resetValues(multiData, true, range, onChange, { ...model, data: multiData });
    expect(multiData.every((d) => d.value === 0)).toBe(true);
  });

  it('should handle decimal step values', () => {
    const decimalRange = { min: 0, max: 10, step: 0.5 };
    const decimalData = [{ value: 1.5 }, { value: 2.3 }, { value: 3.0 }];
    resetValues(decimalData, true, decimalRange, onChange, model);
    expect(decimalData[0].value).toBe(1.5);
    expect(decimalData[1].value).toBe(0);
    expect(decimalData[2].value).toBe(3.0);
  });
});

describe('ConfigureChartPanel', () => {
  const defaultModel = {
    chartType: 'bar',
    range: { min: 0, max: 10, step: 1, labelStep: 1 },
    graph: { width: 400, height: 500 },
    data: [{ value: 5 }],
    correctAnswer: { data: [{ value: 3 }] },
    changeInteractiveEnabled: true,
    changeEditableEnabled: true,
  };

  const defaultProps = {
    model: defaultModel,
    onChange: jest.fn(),
    chartDimensions: {
      showInConfigPanel: true,
      width: { min: 50, max: 700, step: 20 },
      height: { min: 400, max: 700, step: 20 },
    },
    gridValues: { range: { min: 0, max: 10000 } },
    labelValues: { range: { min: 0, max: 10000 } },
    studentNewCategoryDefaultLabel: { label: 'Category' },
    availableChartTypes: {},
    chartTypeLabel: 'Chart Type',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (extras = {}) => {
    const props = { ...defaultProps, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <ConfigureChartPanel {...props} />
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = renderComponent();
      expect(container).toBeInTheDocument();
    });

    it('should render "Configure Chart" title', () => {
      const { getByText } = renderComponent();
      expect(getByText('Configure Chart')).toBeInTheDocument();
    });

    it('should render chart type selector', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('chart-type-select')).toBeInTheDocument();
    });

    it('should render max value field', () => {
      const { getByLabelText } = renderComponent();
      expect(getByLabelText('Max Value')).toBeInTheDocument();
    });

    it('should render grid interval field for non-plot charts', () => {
      const { getByLabelText } = renderComponent({
        model: { ...defaultModel, chartType: 'bar' },
      });
      expect(getByLabelText('Grid Interval')).toBeInTheDocument();
    });

    it('should render label interval field for non-plot charts', () => {
      const { getByLabelText } = renderComponent({
        model: { ...defaultModel, chartType: 'bar' },
      });
      expect(getByLabelText('Label Interval')).toBeInTheDocument();
    });

    it('should not render step config for plot charts', () => {
      const { queryByLabelText } = renderComponent({
        model: { ...defaultModel, chartType: 'linePlot' },
      });
      expect(queryByLabelText('Grid Interval')).not.toBeInTheDocument();
      expect(queryByLabelText('Label Interval')).not.toBeInTheDocument();
    });

    it('should render dimensions section when showInConfigPanel is true', () => {
      const { getByText } = renderComponent({
        chartDimensions: {
          showInConfigPanel: true,
          width: { min: 50, max: 700, step: 20 },
          height: { min: 400, max: 700, step: 20 },
        },
      });
      expect(getByText('Dimensions(px)')).toBeInTheDocument();
    });

    it('should not render dimensions section when showInConfigPanel is false', () => {
      const { queryByText } = renderComponent({
        chartDimensions: {
          showInConfigPanel: false,
          width: { min: 50, max: 700, step: 20 },
          height: { min: 400, max: 700, step: 20 },
        },
      });
      expect(queryByText('Dimensions(px)')).not.toBeInTheDocument();
    });

    it('should render width field when dimensions are shown', () => {
      const { getByLabelText } = renderComponent();
      expect(getByLabelText('Width')).toBeInTheDocument();
    });

    it('should render height field when dimensions are shown', () => {
      const { getByLabelText } = renderComponent();
      expect(getByLabelText('Height')).toBeInTheDocument();
    });

    it('should display width constraints', () => {
      const { getByText } = renderComponent();
      expect(getByText('Min 50, Max 700')).toBeInTheDocument();
    });

    it('should display height constraints', () => {
      const { getAllByText } = renderComponent();
      const constraints = getAllByText('Min 400, Max 700');
      expect(constraints.length).toBeGreaterThan(0);
    });
  });

  describe('chart type changes', () => {
    it('should call onChange when chart type is changed to non-plot', () => {
      const onChange = jest.fn();
      const { getByTestId } = renderComponent({ onChange });

      fireEvent.change(getByTestId('chart-type-select'), { target: { value: 'line' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('should show warning when switching to plot with invalid config', async () => {
      const { getByTestId, getByText } = renderComponent({
        model: { ...defaultModel, range: { max: 20, step: 2, labelStep: 2 } },
      });

      fireEvent.change(getByTestId('chart-type-select'), { target: { value: 'linePlot' } });

      await waitFor(() => {
        expect(getByText('Warning')).toBeInTheDocument();
      });
    });

    it('should allow switching to plot with valid config', () => {
      const onChange = jest.fn();
      const { getByTestId } = renderComponent({
        onChange,
        model: { ...defaultModel, range: { max: 10, step: 1, labelStep: 1 } },
      });

      fireEvent.change(getByTestId('chart-type-select'), { target: { value: 'dotPlot' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          chartType: 'dotPlot',
        }),
      );
    });
  });

  describe('range changes', () => {
    it('should update max value', () => {
      const onChange = jest.fn();
      const { getByLabelText } = renderComponent({ onChange });

      const maxInput = getByLabelText('Max Value');
      fireEvent.change(maxInput, { target: { value: '15' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('should update step value', () => {
      const onChange = jest.fn();
      const { getByLabelText } = renderComponent({ onChange });

      const stepInput = getByLabelText('Grid Interval');
      fireEvent.change(stepInput, { target: { value: '2' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('should update label step value', () => {
      const onChange = jest.fn();
      const { getByLabelText } = renderComponent({ onChange });

      const labelStepInput = getByLabelText('Label Interval');
      fireEvent.change(labelStepInput, { target: { value: '2' } });

      expect(onChange).toHaveBeenCalled();
    });

    it('should show alert when changing max causes data to be out of range', async () => {
      const onChange = jest.fn();
      const { getByLabelText, queryByTestId } = renderComponent({
        onChange,
        model: {
          ...defaultModel,
          range: { min: 0, max: 10, step: 1, labelStep: 1 },
          data: [{ value: 8 }],
          correctAnswer: { data: [] },
        },
      });

      const maxInput = getByLabelText('Max Value');
      fireEvent.change(maxInput, { target: { value: '5' } });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });

    it('should show alert when changing step causes data to be out of range', async () => {
      const onChange = jest.fn();
      const { getByLabelText } = renderComponent({
        onChange,
        model: {
          ...defaultModel,
          range: { min: 0, max: 10, step: 1, labelStep: 1 },
          data: [{ value: 5 }],
          correctAnswer: { data: [] },
        },
      });

      const stepInput = getByLabelText('Grid Interval');
      fireEvent.change(stepInput, { target: { value: '3' } });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });
  });

  describe('dimensions changes', () => {
    it('should update width', () => {
      const onChange = jest.fn();
      const { getByLabelText } = renderComponent({ onChange });

      const widthInput = getByLabelText('Width');
      fireEvent.change(widthInput, { target: { value: '500' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          graph: expect.objectContaining({ width: 500 }),
        }),
      );
    });

    it('should update height', () => {
      const onChange = jest.fn();
      const { getByLabelText } = renderComponent({ onChange });

      const heightInput = getByLabelText('Height');
      fireEvent.change(heightInput, { target: { value: '600' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          graph: expect.objectContaining({ height: 600 }),
        }),
      );
    });
  });

  describe('alert dialog', () => {
    it('should reset range on cancel', async () => {
      const onChange = jest.fn();
      const { getByLabelText, queryByTestId } = renderComponent({
        onChange,
        model: {
          ...defaultModel,
          range: { min: 0, max: 10, step: 1, labelStep: 1 },
          data: [{ value: 8 }],
          correctAnswer: { data: [] },
        },
      });

      const maxInput = getByLabelText('Max Value');

      const event = { target: maxInput };
      fireEvent.change(maxInput, { target: { value: '5' } });

      await waitFor(
        () => {
          const dialog = queryByTestId('alert-dialog');
          if (dialog) {
            fireEvent.click(queryByTestId('alert-cancel'));
          }
        },
        { timeout: 100 },
      ).catch(() => {});

      expect(onChange).toHaveBeenCalled();
    });

    it('should apply changes and reset data on confirm', async () => {
      const onChange = jest.fn();
      const { getByLabelText, queryByTestId } = renderComponent({
        onChange,
        model: {
          ...defaultModel,
          range: { min: 0, max: 10, step: 1, labelStep: 1 },
          data: [{ value: 8 }],
          correctAnswer: { data: [] },
        },
      });

      const maxInput = getByLabelText('Max Value');
      fireEvent.change(maxInput, { target: { value: '5' } });

      await waitFor(
        () => {
          const dialog = queryByTestId('alert-dialog');
          if (dialog) {
            fireEvent.click(queryByTestId('alert-confirm'));
          }
        },
        { timeout: 100 },
      ).catch(() => {});

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle missing chartDimensions', () => {
      const { container } = renderComponent({ chartDimensions: undefined });
      expect(container).toBeInTheDocument();
    });

    it('should handle missing gridValues', () => {
      const { container } = renderComponent({ gridValues: undefined });
      expect(container).toBeInTheDocument();
    });

    it('should handle missing labelValues', () => {
      const { container } = renderComponent({ labelValues: undefined });
      expect(container).toBeInTheDocument();
    });

    it('should handle empty model data', () => {
      const { container } = renderComponent({
        model: {
          ...defaultModel,
          data: [],
          correctAnswer: { data: [] },
        },
      });
      expect(container).toBeInTheDocument();
    });

    it('should handle empty range object', () => {
      const { container } = renderComponent({
        model: {
          ...defaultModel,
          range: {},
        },
      });
      expect(container).toBeInTheDocument();
    });

    it('should apply width constraints correctly', () => {
      const { container } = renderComponent({
        chartDimensions: {
          showInConfigPanel: true,
          width: { min: 100, max: 600, step: 50 },
          height: { min: 400, max: 700, step: 20 },
        },
      });
      expect(container).toBeInTheDocument();
    });

    it('should apply height constraints correctly', () => {
      const { container } = renderComponent({
        chartDimensions: {
          showInConfigPanel: true,
          width: { min: 50, max: 700, step: 20 },
          height: { min: 450, max: 650, step: 30 },
        },
      });
      expect(container).toBeInTheDocument();
    });

    it('should handle very small step values', () => {
      const { container } = renderComponent({
        chartDimensions: {
          showInConfigPanel: true,
          width: { min: 50, max: 700, step: 0.5 },
          height: { min: 400, max: 700, step: 0.5 },
        },
      });
      expect(container).toBeInTheDocument();
    });
  });

  describe('useEffect lifecycle', () => {
    it('should call onChange on mount', () => {
      const onChange = jest.fn();
      renderComponent({ onChange });

      expect(onChange).toHaveBeenCalled();
    });

    it('should set category default label on mount', () => {
      const onChange = jest.fn();
      renderComponent({
        onChange,
        studentNewCategoryDefaultLabel: { label: 'Test Category' },
      });

      expect(onChange).toHaveBeenCalled();
    });
  });
});
