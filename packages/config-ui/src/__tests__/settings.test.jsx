import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toggle from '../settings/toggle';
import DisplaySize from '../settings/display-size';
import SettingsRadioLabel from '../settings/settings-radio-label';
import { Panel } from '../settings/panel';

describe('Settings Components', () => {
  describe('Toggle', () => {
    it('renders toggle with label', () => {
      const toggle = jest.fn();
      render(<Toggle label="Enable Feature" checked={false} toggle={toggle} />);

      expect(screen.getByText('Enable Feature')).toBeInTheDocument();
    });
  });

  describe('DisplaySize', () => {
    const defaultProps = {
      size: { width: 500, height: 400 },
      label: 'Display Size',
      onChange: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders label and input fields', () => {
      render(<DisplaySize {...defaultProps} />);

      expect(screen.getByText('Display Size')).toBeInTheDocument();
      expect(screen.getByLabelText('Width')).toBeInTheDocument();
      expect(screen.getByLabelText('Height')).toBeInTheDocument();
    });

    it('displays width and height values', () => {
      render(<DisplaySize {...defaultProps} />);

      const widthInput = screen.getByLabelText('Width');
      const heightInput = screen.getByLabelText('Height');

      expect(widthInput).toHaveValue(500);
      expect(heightInput).toHaveValue(400);
    });

    it('calls onChange when width changes', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<DisplaySize {...defaultProps} onChange={onChange} />);

      const widthInput = screen.getByLabelText('Width');
      await user.clear(widthInput);
      await user.type(widthInput, '600');
      fireEvent.blur(widthInput);

      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ width: 600 }));
    });

    it('calls onChange when height changes', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<DisplaySize {...defaultProps} onChange={onChange} />);

      const heightInput = screen.getByLabelText('Height');
      await user.clear(heightInput);
      await user.type(heightInput, '500');
      fireEvent.blur(heightInput);

      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ height: 500 }));
    });

    it('maintains other dimension when one changes', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<DisplaySize {...defaultProps} onChange={onChange} />);

      const widthInput = screen.getByLabelText('Width');
      await user.clear(widthInput);
      await user.type(widthInput, '700');
      fireEvent.blur(widthInput);

      expect(onChange).toHaveBeenCalledWith({
        width: 700,
        height: 400,
      });
    });

    it('enforces min value constraint', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<DisplaySize {...defaultProps} onChange={onChange} />);

      const widthInput = screen.getByLabelText('Width');
      await user.clear(widthInput);
      await user.type(widthInput, '100');
      fireEvent.blur(widthInput);

      // Should clamp to minimum 150
      expect(widthInput).toHaveValue(150);
    });

    it('enforces max value constraint', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<DisplaySize {...defaultProps} onChange={onChange} />);

      const widthInput = screen.getByLabelText('Width');
      await user.clear(widthInput);
      await user.type(widthInput, '2000');
      fireEvent.blur(widthInput);

      // Should clamp to maximum 1000
      expect(widthInput).toHaveValue(1000);
    });

    it('updates when size prop changes', () => {
      const { rerender } = render(<DisplaySize {...defaultProps} />);

      let widthInput = screen.getByLabelText('Width');
      expect(widthInput).toHaveValue(500);

      rerender(<DisplaySize {...defaultProps} size={{ width: 800, height: 600 }} />);

      widthInput = screen.getByLabelText('Width');
      expect(widthInput).toHaveValue(800);
    });

    it('handles boundary values at minimum', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<DisplaySize {...defaultProps} onChange={onChange} />);

      const widthInput = screen.getByLabelText('Width');
      const heightInput = screen.getByLabelText('Height');

      await user.clear(widthInput);
      await user.type(widthInput, '150');
      fireEvent.blur(widthInput);

      await user.clear(heightInput);
      await user.type(heightInput, '150');
      fireEvent.blur(heightInput);

      expect(widthInput).toHaveValue(150);
      expect(heightInput).toHaveValue(150);
    });

    it('handles boundary values at maximum', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<DisplaySize {...defaultProps} onChange={onChange} />);

      const widthInput = screen.getByLabelText('Width');
      const heightInput = screen.getByLabelText('Height');

      await user.clear(widthInput);
      await user.type(widthInput, '1000');
      fireEvent.blur(widthInput);

      await user.clear(heightInput);
      await user.type(heightInput, '1000');
      fireEvent.blur(heightInput);

      expect(widthInput).toHaveValue(1000);
      expect(heightInput).toHaveValue(1000);
    });

    it('handles decimal input values', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<DisplaySize {...defaultProps} onChange={onChange} />);

      const widthInput = screen.getByLabelText('Width');
      await user.clear(widthInput);
      await user.type(widthInput, '500.5');
      fireEvent.blur(widthInput);

      expect(widthInput).toBeInTheDocument();
    });

    it('handles empty input and resets to min', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<DisplaySize {...defaultProps} onChange={onChange} />);

      const widthInput = screen.getByLabelText('Width');
      await user.clear(widthInput);
      fireEvent.blur(widthInput);

      // Should reset to minimum value
      expect(widthInput).toHaveValue(150);
    });

    it('handles rapid width and height changes', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<DisplaySize {...defaultProps} onChange={onChange} />);

      const widthInput = screen.getByLabelText('Width');

      await user.clear(widthInput);
      await user.type(widthInput, '6');
      await user.type(widthInput, '0');
      await user.type(widthInput, '0');
      fireEvent.blur(widthInput);

      expect(onChange).toHaveBeenCalled();
    });

    it('clamps height at both boundaries', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<DisplaySize {...defaultProps} onChange={onChange} />);

      const heightInput = screen.getByLabelText('Height');

      // Test below min
      await user.clear(heightInput);
      await user.type(heightInput, '50');
      fireEvent.blur(heightInput);
      expect(heightInput).toHaveValue(150);

      // Test above max
      await user.clear(heightInput);
      await user.type(heightInput, '2500');
      fireEvent.blur(heightInput);
      expect(heightInput).toHaveValue(1000);
    });

    it('displays custom label text', () => {
      render(<DisplaySize size={{ width: 500, height: 400 }} label="Custom Size Settings" onChange={jest.fn()} />);

      expect(screen.getByText('Custom Size Settings')).toBeInTheDocument();
    });

    it('renders with variant outlined', () => {
      const { container } = render(<DisplaySize {...defaultProps} />);

      const inputs = container.querySelectorAll('input');
      expect(inputs.length).toBe(2);
    });
  });

  describe('SettingsRadioLabel', () => {
    it('renders radio label', () => {
      const onChange = jest.fn();
      render(<SettingsRadioLabel label="Option 1" value="option1" checked={false} onChange={onChange} />);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('renders checked state', () => {
      const onChange = jest.fn();
      render(<SettingsRadioLabel label="Option 1" value="option1" checked={true} onChange={onChange} />);

      const radio = screen.getByRole('radio');
      expect(radio).toBeChecked();
    });

    it('renders unchecked state', () => {
      const onChange = jest.fn();
      render(<SettingsRadioLabel label="Option 1" value="option1" checked={false} onChange={onChange} />);

      const radio = screen.getByRole('radio');
      expect(radio).not.toBeChecked();
    });

    it('calls onChange when radio is clicked', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<SettingsRadioLabel label="Option 1" value="option1" checked={false} onChange={onChange} />);

      const radio = screen.getByRole('radio');
      await user.click(radio);

      expect(onChange).toHaveBeenCalled();
    });

    it('displays label text correctly', () => {
      const onChange = jest.fn();
      const labelText = 'Custom Option Label';
      render(<SettingsRadioLabel label={labelText} value="custom" checked={false} onChange={onChange} />);

      expect(screen.getByText(labelText)).toBeInTheDocument();
    });
  });

  describe('Panel', () => {
    const defaultProps = {
      model: { toggleSetting: true, numberValue: 5 },
      configuration: { configValue: 'test' },
      groups: {
        'General Settings': {
          toggleSetting: {
            type: 'toggle',
            label: 'Enable Feature',
          },
        },
      },
      onChangeModel: jest.fn(),
      onChangeConfiguration: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders panel with group label', () => {
      render(<Panel {...defaultProps} />);
      expect(screen.getByText('General Settings')).toBeInTheDocument();
    });

    it('renders empty when groups is undefined', () => {
      const { container } = render(<Panel {...defaultProps} groups={undefined} />);
      expect(container.firstChild.children.length).toBe(0);
    });

    it('renders empty when groups is empty', () => {
      const { container } = render(<Panel {...defaultProps} groups={{}} />);
      expect(container.firstChild.children.length).toBe(0);
    });

    it('calls onChangeModel when model changes', async () => {
      const user = userEvent.setup();
      const onChangeModel = jest.fn();
      const { container } = render(<Panel {...defaultProps} onChangeModel={onChangeModel} />);

      const switchElement = container.querySelector('input[type="checkbox"]');
      await user.click(switchElement);

      expect(onChangeModel).toHaveBeenCalled();
    });

    it('calls onChangeConfiguration when configuration changes', async () => {
      const user = userEvent.setup();
      const onChangeConfiguration = jest.fn();
      const { container } = render(
        <Panel
          {...defaultProps}
          groups={{
            'Config Group': {
              configValue: {
                type: 'toggle',
                label: 'Config Toggle',
                isConfigProperty: true,
              },
            },
          }}
          onChangeConfiguration={onChangeConfiguration}
        />,
      );

      const switchElement = container.querySelector('input[type="checkbox"]');
      await user.click(switchElement);

      expect(onChangeConfiguration).toHaveBeenCalled();
    });

    it('renders with modal when provided', () => {
      const modal = <div data-testid="test-modal">Modal Content</div>;
      render(<Panel {...defaultProps} modal={modal} />);

      expect(screen.getByTestId('test-modal')).toBeInTheDocument();
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('renders multiple groups', () => {
      render(
        <Panel
          {...defaultProps}
          groups={{
            'Group One': {
              setting1: {
                type: 'toggle',
                label: 'Setting One',
              },
            },
            'Group Two': {
              setting2: {
                type: 'toggle',
                label: 'Setting Two',
              },
            },
          }}
          model={{ setting1: true, setting2: false }}
        />,
      );

      expect(screen.getByText('Group One')).toBeInTheDocument();
      expect(screen.getByText('Group Two')).toBeInTheDocument();
    });

    it('uses default callbacks when not provided', () => {
      const { container } = render(
        <Panel
          model={{ test: true }}
          groups={{
            'Test Group': {
              test: { type: 'toggle', label: 'Test' },
            },
          }}
        />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('filters out empty groups', () => {
      const { container } = render(
        <Panel
          {...defaultProps}
          groups={{
            'Empty Group': {},
            'General Settings': {
              toggleSetting: {
                type: 'toggle',
                label: 'Enable Feature',
              },
            },
          }}
          model={{ toggleSetting: true }}
        />,
      );

      expect(screen.getByText('General Settings')).toBeInTheDocument();
      expect(screen.queryByText('Empty Group')).not.toBeInTheDocument();
    });

    it('renders with null model', () => {
      const { container } = render(
        <Panel
          model={null}
          configuration={{}}
          groups={{
            'General Settings': {
              toggleSetting: {
                type: 'toggle',
                label: 'Enable Feature',
              },
            },
          }}
          onChangeModel={jest.fn()}
        />,
      );

      expect(screen.getByText('General Settings')).toBeInTheDocument();
    });
  });
});
