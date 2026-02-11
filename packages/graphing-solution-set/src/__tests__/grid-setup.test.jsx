import React from 'react';
import { render, fireEvent, waitFor } from '@pie-lib/test-utils';
import GridSetup from '../grid-setup';

const mockOnChange = jest.fn();
const mockOnChangeView = jest.fn();

const defaultProps = {
  domain: {
    min: -5,
    max: 5,
    step: 1,
    labelStep: 1,
    axisLabel: 'x',
  },
  range: {
    min: -5,
    max: 5,
    step: 1,
    labelStep: 1,
    axisLabel: 'y',
  },
  size: {
    width: 480,
    height: 480,
  },
  sizeConstraints: {
    min: 300,
    max: 900,
    step: 10,
  },
  includeAxes: true,
  standardGrid: false,
  displayedFields: {
    axisLabel: { enabled: true, label: 'Axis Label' },
    min: { enabled: true, label: 'Min' },
    max: { enabled: true, label: 'Max' },
    step: { enabled: true, label: 'Interval' },
    labelStep: { enabled: true, label: 'Label Interval' },
    dimensionsEnabled: true,
    includeAxesEnabled: true,
    standardGridEnabled: true,
  },
  gridValues: {
    domain: [1, 2, 5, 10],
    range: [1, 2, 5, 10],
  },
  labelValues: {
    domain: [0, 1, 2],
    range: [0, 1, 2],
  },
  onChange: mockOnChange,
  onChangeView: mockOnChangeView,
};

describe('GridSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<GridSetup {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it('renders accordion with title', () => {
      const { getByText } = render(<GridSetup {...defaultProps} />);
      expect(getByText('Customize Grid Setup')).toBeTruthy();
    });

    it('renders Include axes toggle when enabled', () => {
      const { getByText } = render(<GridSetup {...defaultProps} />);
      expect(getByText('Include axes and labels?')).toBeTruthy();
    });

    it('does not render Include axes toggle when disabled', () => {
      const props = {
        ...defaultProps,
        displayedFields: {
          ...defaultProps.displayedFields,
          includeAxesEnabled: false,
        },
      };
      const { queryByText } = render(<GridSetup {...props} />);
      expect(queryByText('Include axes and labels?')).toBeFalsy();
    });

    it('renders standard grid toggle when enabled', () => {
      const { getByText } = render(<GridSetup {...defaultProps} />);
      expect(getByText('Constrain to standard coordinate grid?')).toBeTruthy();
    });

    it('does not render standard grid toggle when disabled', () => {
      const props = {
        ...defaultProps,
        displayedFields: {
          ...defaultProps.displayedFields,
          standardGridEnabled: false,
        },
      };
      const { queryByText } = render(<GridSetup {...props} />);
      expect(queryByText('Constrain to standard coordinate grid?')).toBeFalsy();
    });

    it('renders dimensions section when enabled', () => {
      const { getByText } = render(<GridSetup {...defaultProps} />);
      expect(getByText('Dimensions(px)')).toBeTruthy();
      expect(getByText(/Min 300, Max 900/)).toBeTruthy();
    });

    it('does not render dimensions section when disabled', () => {
      const props = {
        ...defaultProps,
        displayedFields: {
          ...defaultProps.displayedFields,
          dimensionsEnabled: false,
        },
      };
      const { queryByText } = render(<GridSetup {...props} />);
      expect(queryByText('Dimensions(px)')).toBeFalsy();
    });
  });

  describe('axes configuration', () => {
    it('renders axis headers when includeAxes is true', () => {
      const { container } = render(<GridSetup {...defaultProps} />);
      const xAxisHeader = container.querySelector('i');
      expect(xAxisHeader?.textContent).toBe('x');
    });

    it('renders min/max fields when enabled', () => {
      const { getAllByLabelText } = render(<GridSetup {...defaultProps} />);
      const minFields = getAllByLabelText('Min');
      const maxFields = getAllByLabelText('Max');
      expect(minFields.length).toBe(2); // domain and range
      expect(maxFields.length).toBe(2); // domain and range
    });

    it('does not render min/max fields when disabled', () => {
      const props = {
        ...defaultProps,
        displayedFields: {
          ...defaultProps.displayedFields,
          min: { enabled: false },
          max: { enabled: false },
        },
      };
      const { queryByLabelText } = render(<GridSetup {...props} />);
      expect(queryByLabelText('Min')).toBeFalsy();
      expect(queryByLabelText('Max')).toBeFalsy();
    });

    it('renders axis label fields when enabled', () => {
      const { getAllByText } = render(<GridSetup {...defaultProps} />);
      const axisLabelFields = getAllByText('Axis Label');
      expect(axisLabelFields.length).toBe(2); // domain and range
    });

    it('does not render axis label fields when disabled', () => {
      const props = {
        ...defaultProps,
        displayedFields: {
          ...defaultProps.displayedFields,
          axisLabel: { enabled: false },
        },
      };
      const { queryByText } = render(<GridSetup {...props} />);
      expect(queryByText('Axis Label')).toBeFalsy();
    });

    it('renders step and labelStep fields when enabled', () => {
      const { getAllByLabelText } = render(<GridSetup {...defaultProps} />);
      const intervalFields = getAllByLabelText('Interval');
      const labelIntervalFields = getAllByLabelText('Label Interval');
      expect(intervalFields.length).toBe(2); // domain and range
      expect(labelIntervalFields.length).toBe(2); // domain and range
    });

    it('does not render step fields when disabled', () => {
      const props = {
        ...defaultProps,
        displayedFields: {
          ...defaultProps.displayedFields,
          step: { enabled: false },
        },
      };
      const { queryByLabelText } = render(<GridSetup {...props} />);
      expect(queryByLabelText('Interval')).toBeFalsy();
    });

    it('does not render labelStep fields when disabled', () => {
      const props = {
        ...defaultProps,
        displayedFields: {
          ...defaultProps.displayedFields,
          labelStep: { enabled: false },
        },
      };
      const { queryByLabelText } = render(<GridSetup {...props} />);
      expect(queryByLabelText('Label Interval')).toBeFalsy();
    });

    it('displays axis visibility hint when min/max enabled', () => {
      const { getByText } = render(<GridSetup {...defaultProps} />);
      expect(
        getByText('If you want the axis to be visible, use a zero or negative Min Value, and a positive Max Value'),
      ).toBeTruthy();
    });

    it('displays unnumbered gridlines hint when labelStep enabled', () => {
      const { getByText } = render(<GridSetup {...defaultProps} />);
      expect(getByText('For unnumbered gridlines, enter a label interval of 0')).toBeTruthy();
    });
  });

  describe('gridlines configuration', () => {
    it('renders gridlines config when includeAxes is false', () => {
      const props = {
        ...defaultProps,
        includeAxes: false,
      };
      const { getByLabelText } = render(<GridSetup {...props} />);
      expect(getByLabelText('Number of Vertical Gridlines')).toBeTruthy();
      expect(getByLabelText('Number of Horizontal Gridlines')).toBeTruthy();
    });

    it('does not render axes config when includeAxes is false', () => {
      const props = {
        ...defaultProps,
        includeAxes: false,
      };
      const { queryByText } = render(<GridSetup {...props} />);
      expect(queryByText('Axis Label')).toBeFalsy();
    });

    it('does not render gridlines config when max is disabled', () => {
      const props = {
        ...defaultProps,
        includeAxes: false,
        displayedFields: {
          ...defaultProps.displayedFields,
          max: { enabled: false },
        },
      };
      const { queryByLabelText } = render(<GridSetup {...props} />);
      expect(queryByLabelText('Number of Vertical Gridlines')).toBeFalsy();
      expect(queryByLabelText('Number of Horizontal Gridlines')).toBeFalsy();
    });
  });

  describe('user interactions', () => {
    it('calls onChange when includeAxes toggle is clicked', () => {
      const { container } = render(<GridSetup {...defaultProps} />);
      const toggleInput = container.querySelector('input[type="checkbox"]');

      fireEvent.click(toggleInput);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          includeAxes: false,
        }),
      );
    });

    it('calls onChange with proper config when includeAxes is disabled', () => {
      const { container } = render(<GridSetup {...defaultProps} />);
      const toggleInput = container.querySelector('input[type="checkbox"]');

      fireEvent.click(toggleInput);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          includeAxes: false,
          domain: expect.objectContaining({
            min: 1,
            max: 5,
            step: 1,
            labelStep: 0,
          }),
          range: expect.objectContaining({
            min: 1,
            max: 5,
            step: 1,
            labelStep: 0,
          }),
        }),
      );
    });

    it('calls onChange with proper config when includeAxes is enabled', () => {
      const props = {
        ...defaultProps,
        includeAxes: false,
      };
      const { container } = render(<GridSetup {...props} />);
      const toggleInputs = container.querySelectorAll('input[type="checkbox"]');
      const includeAxesToggle = toggleInputs[0]; // First toggle is includeAxes

      fireEvent.click(includeAxesToggle);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          includeAxes: true,
          domain: expect.objectContaining({
            labelStep: 1,
          }),
          range: expect.objectContaining({
            labelStep: 1,
          }),
        }),
      );
    });

    it('calls onChange when standardGrid toggle is clicked', () => {
      const { container } = render(<GridSetup {...defaultProps} />);
      const toggleInputs = container.querySelectorAll('input[type="checkbox"]');
      const standardGridToggle = toggleInputs[1]; // Second toggle is standardGrid

      fireEvent.click(standardGridToggle);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          standardGrid: true,
          graph: expect.objectContaining({
            width: 480,
            height: 480,
          }),
        }),
      );
    });

    it('calls onChange when width is changed', async () => {
      const { getAllByLabelText } = render(<GridSetup {...defaultProps} />);
      const widthInput = getAllByLabelText('Width')[0];

      fireEvent.change(widthInput, { target: { value: '500' } });
      fireEvent.blur(widthInput);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            graph: expect.objectContaining({
              width: 500,
            }),
          }),
        );
      });
    });

    it('calls onChange when height is changed', async () => {
      const { getAllByLabelText } = render(<GridSetup {...defaultProps} />);
      const heightInput = getAllByLabelText('Height')[0];

      fireEvent.change(heightInput, { target: { value: '520' } });
      fireEvent.blur(heightInput);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            graph: expect.objectContaining({
              height: 520,
            }),
          }),
        );
      });
    });

    it('updates both width and height when standardGrid is true', async () => {
      const props = {
        ...defaultProps,
        standardGrid: true,
      };
      const { getAllByLabelText } = render(<GridSetup {...props} />);
      const widthInput = getAllByLabelText('Width')[0];

      fireEvent.change(widthInput, { target: { value: '600' } });
      fireEvent.blur(widthInput);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            graph: expect.objectContaining({
              width: 600,
              height: 600,
            }),
          }),
        );
      });
    });

    it('calls onChange when domain min is changed', async () => {
      const { getAllByLabelText } = render(<GridSetup {...defaultProps} />);
      const minInputs = getAllByLabelText('Min');
      const domainMinInput = minInputs[0];

      fireEvent.change(domainMinInput, { target: { value: '-10' } });
      fireEvent.blur(domainMinInput);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            domain: expect.objectContaining({
              min: -10,
            }),
          }),
        );
      });
    });

    it('calls onChange when domain max is changed', async () => {
      const { getAllByLabelText } = render(<GridSetup {...defaultProps} />);
      const maxInputs = getAllByLabelText('Max');
      const domainMaxInput = maxInputs[0];

      fireEvent.change(domainMaxInput, { target: { value: '10' } });
      fireEvent.blur(domainMaxInput);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            domain: expect.objectContaining({
              max: 10,
            }),
          }),
        );
      });
    });

    it('calls onChange when range min is changed', async () => {
      const { getAllByLabelText } = render(<GridSetup {...defaultProps} />);
      const minInputs = getAllByLabelText('Min');
      const rangeMinInput = minInputs[1];

      fireEvent.change(rangeMinInput, { target: { value: '-8' } });
      fireEvent.blur(rangeMinInput);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            range: expect.objectContaining({
              min: -8,
            }),
          }),
        );
      });
    });

    it('calls onChange when range max is changed', async () => {
      const { getAllByLabelText } = render(<GridSetup {...defaultProps} />);
      const maxInputs = getAllByLabelText('Max');
      const rangeMaxInput = maxInputs[1];

      fireEvent.change(rangeMaxInput, { target: { value: '12' } });
      fireEvent.blur(rangeMaxInput);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            range: expect.objectContaining({
              max: 12,
            }),
          }),
        );
      });
    });

    it('updates both domain and range when standardGrid is true and domain changes', async () => {
      const props = {
        ...defaultProps,
        standardGrid: true,
      };
      const { getAllByLabelText } = render(<GridSetup {...props} />);
      const minInputs = getAllByLabelText('Min');
      const domainMinInput = minInputs[0];

      fireEvent.change(domainMinInput, { target: { value: '-15' } });
      fireEvent.blur(domainMinInput);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            domain: expect.objectContaining({
              min: -15,
            }),
            range: expect.objectContaining({
              min: -15,
            }),
          }),
        );
      });
    });

    it('does not update range when domain axisLabel changes with standardGrid', async () => {
      const props = {
        ...defaultProps,
        standardGrid: true,
      };
      const { container } = render(<GridSetup {...props} />);

      // EditableHTML change is harder to trigger, but we can test the handler directly
      // by verifying the range doesn't get the axisLabel value from domain
      const axisLabelInputs = container.querySelectorAll('[contenteditable="true"]');

      if (axisLabelInputs.length > 0) {
        fireEvent.input(axisLabelInputs[0], { target: { innerHTML: 'X-Axis' } });

        await waitFor(() => {
          if (mockOnChange.mock.calls.length > 0) {
            const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
            // range.axisLabel should not be 'X-Axis', it should keep its original value
            expect(lastCall.range?.axisLabel).not.toBe('X-Axis');
          }
        });
      }
    });

    it('calls onChangeView when accordion is toggled', () => {
      const { container } = render(<GridSetup {...defaultProps} />);
      const accordionSummary = container.querySelector('[aria-expanded]');

      fireEvent.click(accordionSummary);

      expect(mockOnChangeView).toHaveBeenCalled();
    });
  });

  describe('disabled states', () => {
    it('disables range fields when standardGrid is true', () => {
      const props = {
        ...defaultProps,
        standardGrid: true,
      };
      const { getAllByLabelText } = render(<GridSetup {...props} />);
      const minInputs = getAllByLabelText('Min');
      const rangeMinInput = minInputs[1];

      expect(rangeMinInput).toBeDisabled();
    });

    it('disables height field when standardGrid is true', () => {
      const props = {
        ...defaultProps,
        standardGrid: true,
      };
      const { getAllByLabelText } = render(<GridSetup {...props} />);
      const heightInput = getAllByLabelText('Height')[0];

      expect(heightInput).toBeDisabled();
    });

    it('disables horizontal gridlines field when standardGrid is true and includeAxes is false', () => {
      const props = {
        ...defaultProps,
        includeAxes: false,
        standardGrid: true,
      };
      const { getByLabelText } = render(<GridSetup {...props} />);
      const horizontalGridlinesInput = getByLabelText('Number of Horizontal Gridlines');

      expect(horizontalGridlinesInput).toBeDisabled();
    });
  });

  describe('GridConfig component', () => {
    it('renders step field when enabled', () => {
      const { getAllByLabelText } = render(<GridSetup {...defaultProps} />);
      const intervalFields = getAllByLabelText('Interval');
      expect(intervalFields.length).toBeGreaterThan(0);
    });

    it('renders labelStep field when enabled', () => {
      const { getAllByLabelText } = render(<GridSetup {...defaultProps} />);
      const labelIntervalFields = getAllByLabelText('Label Interval');
      expect(labelIntervalFields.length).toBeGreaterThan(0);
    });

    it('does not render when both step and labelStep are disabled', () => {
      const props = {
        ...defaultProps,
        displayedFields: {
          ...defaultProps.displayedFields,
          step: { enabled: false },
          labelStep: { enabled: false },
        },
      };
      const { queryByLabelText } = render(<GridSetup {...props} />);
      expect(queryByLabelText('Interval')).toBeFalsy();
      expect(queryByLabelText('Label Interval')).toBeFalsy();
    });
  });

  describe('AxisConfig component', () => {
    it('renders x-axis header', () => {
      const { container } = render(<GridSetup {...defaultProps} />);
      const headers = container.querySelectorAll('i');
      const xAxisHeader = Array.from(headers).find((h) => h.textContent === 'x');
      expect(xAxisHeader).toBeTruthy();
    });

    it('renders y-axis header', () => {
      const { container } = render(<GridSetup {...defaultProps} />);
      const headers = container.querySelectorAll('i');
      const yAxisHeader = Array.from(headers).find((h) => h.textContent === 'y');
      expect(yAxisHeader).toBeTruthy();
    });

    it('does not render headers when all fields are disabled', () => {
      const props = {
        ...defaultProps,
        displayedFields: {
          ...defaultProps.displayedFields,
          min: { enabled: false },
          max: { enabled: false },
          axisLabel: { enabled: false },
          step: { enabled: false },
          labelStep: { enabled: false },
        },
      };
      const { container } = render(<GridSetup {...props} />);
      const headers = container.querySelectorAll('i');
      const axisHeaders = Array.from(headers).filter((h) => h.textContent === 'x' || h.textContent === 'y');
      expect(axisHeaders.length).toBe(0);
    });
  });

  describe('Accordion behavior', () => {
    it('renders with correct transition props', () => {
      const { container } = render(<GridSetup {...defaultProps} />);
      const accordion = container.querySelector('.MuiAccordion-root');
      expect(accordion).toBeTruthy();
    });

    it('expands and collapses accordion', () => {
      const { container } = render(<GridSetup {...defaultProps} />);
      const accordionSummary = container.querySelector('[aria-expanded]');

      expect(accordionSummary.getAttribute('aria-expanded')).toBe('false');

      fireEvent.click(accordionSummary);

      expect(mockOnChangeView).toHaveBeenCalled();
    });
  });
});
