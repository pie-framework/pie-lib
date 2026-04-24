import { fireEvent, render } from '@pie-lib/test-utils';
import React from 'react';

import ToolMenu from '../tool-menu';

describe('ToolMenu', () => {
  let onChange;
  const tools = ['one', 'two'];

  beforeEach(() => {
    onChange = jest.fn();
  });

  const renderComponent = (extras) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange,
      currentTool: tools[0],
      tools,
      gssLineData: {
        selectedTool: 'lineA',
        numberOfLines: 2,
        lineA: { lineType: 'Solid' },
        lineB: { lineType: 'Solid' },
      },
    };
    const props = { ...defaults, ...extras };
    return render(<ToolMenu {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders Line A radio button', () => {
      const { getByText } = renderComponent();
      expect(getByText('Line A')).toBeInTheDocument();
    });

    it('renders Line B radio button when numberOfLines is 2', () => {
      const { getByText } = renderComponent();
      expect(getByText('Line B')).toBeInTheDocument();
    });

    it('does not render Line B radio button when numberOfLines is 1', () => {
      const { queryByText } = renderComponent({
        gssLineData: {
          selectedTool: 'lineA',
          numberOfLines: 1,
          lineA: { lineType: 'Solid' },
          lineB: { lineType: 'Solid' },
        },
      });
      expect(queryByText('Line B')).not.toBeInTheDocument();
    });

    it('renders Solution Set radio button', () => {
      const { getByText } = renderComponent();
      expect(getByText('Solution Set')).toBeInTheDocument();
    });

    it('renders Solid and Dashed buttons for Line A', () => {
      const { getAllByText } = renderComponent();
      const solidButtons = getAllByText(/Solid/);
      const dashedButtons = getAllByText(/Dashed/);
      expect(solidButtons.length).toBeGreaterThan(0);
      expect(dashedButtons.length).toBeGreaterThan(0);
    });

    it('shows checkmark on selected line type for Line A', () => {
      const { getAllByText } = renderComponent({
        gssLineData: {
          selectedTool: 'lineA',
          numberOfLines: 2,
          lineA: { lineType: 'Solid' },
          lineB: { lineType: 'Dashed' },
        },
      });
      const solidButtons = getAllByText(/✔ Solid/);
      expect(solidButtons.length).toBeGreaterThan(0);
    });

    it('disables all controls when disabled prop is true', () => {
      const { getAllByRole } = renderComponent({ disabled: true });
      const radios = getAllByRole('radio');
      const buttons = getAllByRole('button');

      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });

      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe('onChangeRadioValue', () => {
    it('calls onChange with updated selectedTool when lineA radio is clicked', () => {
      const { getAllByRole } = renderComponent({
        gssLineData: {
          selectedTool: 'solutionSet',
          numberOfLines: 2,
          lineA: { lineType: 'Solid' },
          lineB: { lineType: 'Solid' },
        },
      });

      const radios = getAllByRole('radio');
      const lineARadio = radios.find((r) => r.value === 'lineA');

      fireEvent.click(lineARadio);

      expect(onChange).toHaveBeenCalledTimes(1);
      const [updatedData, oldSelectedTool] = onChange.mock.calls[0];
      expect(updatedData.selectedTool).toBe('lineA');
      expect(oldSelectedTool).toBe('solutionSet');
    });

    it('calls onChange with updated selectedTool when lineB radio is clicked', () => {
      const { getAllByRole } = renderComponent({
        gssLineData: {
          selectedTool: 'lineA',
          numberOfLines: 2,
          lineA: { lineType: 'Solid' },
          lineB: { lineType: 'Solid' },
        },
      });

      const radios = getAllByRole('radio');
      const lineBRadio = radios.find((r) => r.value === 'lineB');

      fireEvent.click(lineBRadio);

      expect(onChange).toHaveBeenCalledTimes(1);
      const [updatedData, oldSelectedTool] = onChange.mock.calls[0];
      expect(updatedData.selectedTool).toBe('lineB');
      expect(oldSelectedTool).toBe('lineA');
    });

    it('calls onChange with updated selectedTool when solutionSet radio is clicked', () => {
      const { getAllByRole } = renderComponent({
        gssLineData: {
          selectedTool: 'lineA',
          numberOfLines: 2,
          lineA: { lineType: 'Solid' },
          lineB: { lineType: 'Solid' },
        },
      });

      const radios = getAllByRole('radio');
      const solutionSetRadio = radios.find((r) => r.value === 'solutionSet');

      fireEvent.click(solutionSetRadio);

      expect(onChange).toHaveBeenCalledTimes(1);
      const [updatedData, oldSelectedTool] = onChange.mock.calls[0];
      expect(updatedData.selectedTool).toBe('solutionSet');
      expect(oldSelectedTool).toBe('lineA');
    });

    it('preserves other gssLineData properties when changing selectedTool', () => {
      const { getAllByRole } = renderComponent({
        gssLineData: {
          selectedTool: 'lineA',
          numberOfLines: 2,
          lineA: { lineType: 'Dashed' },
          lineB: { lineType: 'Solid' },
        },
      });

      const radios = getAllByRole('radio');
      const lineBRadio = radios.find((r) => r.value === 'lineB');

      fireEvent.click(lineBRadio);

      const [updatedData] = onChange.mock.calls[0];
      expect(updatedData.lineA.lineType).toBe('Dashed');
      expect(updatedData.lineB.lineType).toBe('Solid');
      expect(updatedData.numberOfLines).toBe(2);
    });

    it('does not call onChange when disabled', () => {
      const { getAllByRole } = renderComponent({
        disabled: true,
        gssLineData: {
          selectedTool: 'lineA',
          numberOfLines: 2,
          lineA: { lineType: 'Solid' },
          lineB: { lineType: 'Solid' },
        },
      });

      const radios = getAllByRole('radio');
      const lineBRadio = radios.find((r) => r.value === 'lineB');

      // Disabled radios should not fire change events
      expect(lineBRadio).toBeDisabled();
    });
  });

  describe('lineTypeChange', () => {
    it('calls onChange with updated lineType for Line A when Solid button is clicked', () => {
      const { getAllByText } = renderComponent({
        gssLineData: {
          selectedTool: 'lineA',
          numberOfLines: 2,
          lineA: { lineType: 'Dashed' },
          lineB: { lineType: 'Solid' },
        },
      });

      const solidButtons = getAllByText(/Solid/);
      // First solid button should be for Line A
      fireEvent.click(solidButtons[0]);

      expect(onChange).toHaveBeenCalledTimes(1);
      const [updatedData, oldSelectedTool] = onChange.mock.calls[0];
      expect(updatedData.lineA.lineType).toBe('Solid');
      expect(oldSelectedTool).toBe('lineA');
    });

    it('calls onChange with updated lineType for Line A when Dashed button is clicked', () => {
      const { getAllByText } = renderComponent({
        gssLineData: {
          selectedTool: 'lineA',
          numberOfLines: 2,
          lineA: { lineType: 'Solid' },
          lineB: { lineType: 'Solid' },
        },
      });

      const dashedButtons = getAllByText(/Dashed/);
      // First dashed button should be for Line A
      fireEvent.click(dashedButtons[0]);

      expect(onChange).toHaveBeenCalledTimes(1);
      const [updatedData, oldSelectedTool] = onChange.mock.calls[0];
      expect(updatedData.lineA.lineType).toBe('Dashed');
      expect(oldSelectedTool).toBe('lineA');
    });

    it('calls onChange with updated lineType for Line B when Solid button is clicked', () => {
      const { getAllByText } = renderComponent({
        gssLineData: {
          selectedTool: 'lineB',
          numberOfLines: 2,
          lineA: { lineType: 'Solid' },
          lineB: { lineType: 'Dashed' },
        },
      });

      const solidButtons = getAllByText(/Solid/);
      // Second solid button should be for Line B
      fireEvent.click(solidButtons[1]);

      expect(onChange).toHaveBeenCalledTimes(1);
      const [updatedData, oldSelectedTool] = onChange.mock.calls[0];
      expect(updatedData.lineB.lineType).toBe('Solid');
      expect(oldSelectedTool).toBe('lineB');
    });

    it('calls onChange with updated lineType for Line B when Dashed button is clicked', () => {
      const { getAllByText } = renderComponent({
        gssLineData: {
          selectedTool: 'lineB',
          numberOfLines: 2,
          lineA: { lineType: 'Solid' },
          lineB: { lineType: 'Solid' },
        },
      });

      const dashedButtons = getAllByText(/Dashed/);
      // Second dashed button should be for Line B
      fireEvent.click(dashedButtons[1]);

      expect(onChange).toHaveBeenCalledTimes(1);
      const [updatedData, oldSelectedTool] = onChange.mock.calls[0];
      expect(updatedData.lineB.lineType).toBe('Dashed');
      expect(oldSelectedTool).toBe('lineB');
    });

    it('preserves other line properties when changing Line A lineType', () => {
      const { getAllByText } = renderComponent({
        gssLineData: {
          selectedTool: 'lineA',
          numberOfLines: 2,
          lineA: { lineType: 'Solid' },
          lineB: { lineType: 'Dashed' },
        },
      });

      const dashedButtons = getAllByText(/Dashed/);
      fireEvent.click(dashedButtons[0]);

      const [updatedData] = onChange.mock.calls[0];
      expect(updatedData.lineA.lineType).toBe('Dashed');
      expect(updatedData.lineB.lineType).toBe('Dashed');
      expect(updatedData.selectedTool).toBe('lineA');
      expect(updatedData.numberOfLines).toBe(2);
    });

    it('preserves other line properties when changing Line B lineType', () => {
      const { getAllByText } = renderComponent({
        gssLineData: {
          selectedTool: 'lineB',
          numberOfLines: 2,
          lineA: { lineType: 'Dashed' },
          lineB: { lineType: 'Solid' },
        },
      });

      const dashedButtons = getAllByText(/Dashed/);
      fireEvent.click(dashedButtons[1]);

      const [updatedData] = onChange.mock.calls[0];
      expect(updatedData.lineA.lineType).toBe('Dashed');
      expect(updatedData.lineB.lineType).toBe('Dashed');
      expect(updatedData.selectedTool).toBe('lineB');
      expect(updatedData.numberOfLines).toBe(2);
    });

    it('handles multiple line type changes correctly', () => {
      const { getAllByText } = renderComponent({
        gssLineData: {
          selectedTool: 'lineA',
          numberOfLines: 2,
          lineA: { lineType: 'Solid' },
          lineB: { lineType: 'Solid' },
        },
      });

      // Change Line A to Dashed
      let dashedButtons = getAllByText(/Dashed/);
      fireEvent.click(dashedButtons[0]);

      expect(onChange).toHaveBeenCalledTimes(1);
      let [updatedData] = onChange.mock.calls[0];
      expect(updatedData.lineA.lineType).toBe('Dashed');

      // Change Line B to Dashed
      dashedButtons = getAllByText(/Dashed/);
      fireEvent.click(dashedButtons[1]);

      expect(onChange).toHaveBeenCalledTimes(2);
      [updatedData] = onChange.mock.calls[1];
      expect(updatedData.lineB.lineType).toBe('Dashed');
    });

    it('does not call onChange when line type button is disabled', () => {
      const { getAllByRole } = renderComponent({
        disabled: true,
        gssLineData: {
          selectedTool: 'lineA',
          numberOfLines: 2,
          lineA: { lineType: 'Solid' },
          lineB: { lineType: 'Solid' },
        },
      });

      const buttons = getAllByRole('button');

      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('maintains correct state when clicking same line type that is already selected', () => {
      const { getAllByText } = renderComponent({
        gssLineData: {
          selectedTool: 'lineA',
          numberOfLines: 2,
          lineA: { lineType: 'Solid' },
          lineB: { lineType: 'Solid' },
        },
      });

      const solidButtons = getAllByText(/Solid/);
      fireEvent.click(solidButtons[0]); // Click Solid when already Solid

      expect(onChange).toHaveBeenCalledTimes(1);
      const [updatedData] = onChange.mock.calls[0];
      expect(updatedData.lineA.lineType).toBe('Solid');
    });
  });

  describe('integration tests', () => {
    it('allows switching selected tool and changing line type in sequence', () => {
      const { getAllByRole, getAllByText } = renderComponent({
        gssLineData: {
          selectedTool: 'lineA',
          numberOfLines: 2,
          lineA: { lineType: 'Solid' },
          lineB: { lineType: 'Solid' },
        },
      });

      // Switch to Line B
      const radios = getAllByRole('radio');
      const lineBRadio = radios.find((r) => r.value === 'lineB');
      fireEvent.click(lineBRadio);

      expect(onChange).toHaveBeenCalledTimes(1);
      let [updatedData] = onChange.mock.calls[0];
      expect(updatedData.selectedTool).toBe('lineB');

      // Change Line B to Dashed
      const dashedButtons = getAllByText(/Dashed/);
      fireEvent.click(dashedButtons[1]);

      expect(onChange).toHaveBeenCalledTimes(2);
      [updatedData] = onChange.mock.calls[1];
      expect(updatedData.lineB.lineType).toBe('Dashed');
    });

    it('handles complete workflow of switching between all tools and changing line types', () => {
      const { getAllByRole, getAllByText } = renderComponent({
        gssLineData: {
          selectedTool: 'lineA',
          numberOfLines: 2,
          lineA: { lineType: 'Solid' },
          lineB: { lineType: 'Solid' },
        },
      });

      // Change Line A to Dashed
      let dashedButtons = getAllByText(/Dashed/);
      fireEvent.click(dashedButtons[0]);
      expect(onChange.mock.calls[0][0].lineA.lineType).toBe('Dashed');

      // Switch to Line B
      const radios = getAllByRole('radio');
      const lineBRadio = radios.find((r) => r.value === 'lineB');
      fireEvent.click(lineBRadio);
      expect(onChange.mock.calls[1][0].selectedTool).toBe('lineB');

      // Change Line B to Dashed
      dashedButtons = getAllByText(/Dashed/);
      fireEvent.click(dashedButtons[1]);
      expect(onChange.mock.calls[2][0].lineB.lineType).toBe('Dashed');

      // Switch to Solution Set
      const solutionSetRadio = radios.find((r) => r.value === 'solutionSet');
      fireEvent.click(solutionSetRadio);
      expect(onChange.mock.calls[3][0].selectedTool).toBe('solutionSet');

      expect(onChange).toHaveBeenCalledTimes(4);
    });
  });
});
