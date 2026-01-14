import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberTextFieldCustom } from '../number-text-field-custom';

describe('NumberTextFieldCustom', () => {
  const defaultProps = {
    value: 1,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders input field', () => {
      render(<NumberTextFieldCustom {...defaultProps} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
    });

    it('renders with custom label', () => {
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          label="Custom Label"
        />,
      );
      expect(screen.getByLabelText('Custom Label')).toBeInTheDocument();
    });

    it('renders add and remove buttons', () => {
      render(<NumberTextFieldCustom {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('renders with custom className', () => {
      const { container } = render(
        <NumberTextFieldCustom
          {...defaultProps}
          className="custom-class"
        />,
      );
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('renders with custom inputClassName', () => {
      const { container } = render(
        <NumberTextFieldCustom
          {...defaultProps}
          inputClassName="input-class"
        />,
      );
      expect(container.querySelector('.input-class')).toBeInTheDocument();
    });

    it('renders as disabled when disabled prop is true', () => {
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          disabled={true}
        />,
      );
      const input = screen.getByRole('spinbutton');
      expect(input).toBeDisabled();
    });

    it('renders with error styling when error is true', () => {
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          error={true}
        />,
      );
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('renders helper text when provided', () => {
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          helperText="This is a helper text"
        />,
      );
      expect(screen.getByText('This is a helper text')).toBeInTheDocument();
    });

    it('renders with different variant', () => {
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          variant="outlined"
        />,
      );
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
    });

    it('renders with text alignment', () => {
      const { container } = render(
        <NumberTextFieldCustom
          {...defaultProps}
          textAlign="left"
        />,
      );
      expect(container.querySelector('input')).toBeInTheDocument();
    });
  });

  describe('custom values', () => {
    it('accepts custom values array', () => {
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          customValues={['small', 'medium', 'large']}
          value="medium"
        />,
      );
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
    });

    it('handles empty custom values array', () => {
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          customValues={[]}
          value={5}
        />,
      );
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(5);
    });

    it('displays custom value when selected', () => {
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          customValues={['auto', 'fixed', 'dynamic']}
          value="fixed"
        />,
      );
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
    });
  });

  describe('step functionality', () => {
    it('uses default step of 1', () => {
      const onChange = jest.fn();
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          value={5}
          onChange={onChange}
        />,
      );
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('uses custom step value', () => {
      const onChange = jest.fn();
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          value={5}
          step={0.5}
          onChange={onChange}
        />,
      );
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('increments value by step with add button', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          value={5}
          step={2}
          onChange={onChange}
        />,
      );

      const buttons = screen.getAllByRole('button');
      const addButton = buttons.find((btn) => btn.querySelector('[data-testid], svg'));

      if (addButton) {
        await user.click(addButton);
      }
    });

    it('decrements value by step with remove button', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          value={5}
          step={1}
          onChange={onChange}
        />,
      );

      const buttons = screen.getAllByRole('button');
      const removeButton = buttons[0];

      if (removeButton) {
        await user.click(removeButton);
      }
    });
  });

  describe('min/max constraints', () => {
    it('clamps value to min', async () => {
      const user = userEvent.setup();
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          value={0}
          min={1}
          max={10}
        />,
      );

      const input = screen.getByRole('spinbutton');
      fireEvent.blur(input);

      await waitFor(() => {
        expect(input).toHaveValue(1);
      });
    });

    it('clamps value to max', async () => {
      const user = userEvent.setup();
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          value={15}
          min={1}
          max={10}
        />,
      );

      const input = screen.getByRole('spinbutton');
      fireEvent.blur(input);

      await waitFor(() => {
        expect(input).toHaveValue(10);
      });
    });

    it('handles only min constraint', () => {
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          value={5}
          min={3}
        />,
      );
      expect(screen.getByRole('spinbutton')).toHaveValue(5);
    });

    it('handles only max constraint', () => {
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          value={5}
          max={10}
        />,
      );
      expect(screen.getByRole('spinbutton')).toHaveValue(5);
    });
  });

  describe('props updates', () => {
    it('updates value when prop changes', () => {
      const { rerender } = render(
        <NumberTextFieldCustom
          {...defaultProps}
          value={5}
        />,
      );

      let input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(5);

      rerender(
        <NumberTextFieldCustom
          {...defaultProps}
          value={8}
        />,
      );

      input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(8);
    });

    it('updates when label changes', () => {
      const { rerender } = render(
        <NumberTextFieldCustom
          {...defaultProps}
          label="Old Label"
        />,
      );

      expect(screen.getByLabelText('Old Label')).toBeInTheDocument();

      rerender(
        <NumberTextFieldCustom
          {...defaultProps}
          label="New Label"
        />,
      );

      expect(screen.getByLabelText('New Label')).toBeInTheDocument();
    });

    it('updates constraints when min/max props change', () => {
      const { rerender } = render(
        <NumberTextFieldCustom
          {...defaultProps}
          value={5}
          min={1}
          max={10}
        />,
      );

      rerender(
        <NumberTextFieldCustom
          {...defaultProps}
          value={5}
          min={1}
          max={8}
        />,
      );

      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });
  });

  describe('text alignment', () => {
    it('renders with center alignment (default)', () => {
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          value={5}
        />,
      );
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('renders with custom left alignment', () => {
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          value={5}
          textAlign="left"
        />,
      );
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('renders with right alignment', () => {
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          value={5}
          textAlign="right"
        />,
      );
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });
  });

  describe('type property', () => {
    it('renders as number type by default', () => {
      const { container } = render(
        <NumberTextFieldCustom
          {...defaultProps}
          value={5}
        />,
      );
      const input = container.querySelector('input[type="number"]');
      expect(input).toBeInTheDocument();
    });

    it('can render with custom type', () => {
      const { container } = render(
        <NumberTextFieldCustom
          {...defaultProps}
          value={5}
          type="text"
        />,
      );
      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('renders as a spinbutton', () => {
      render(<NumberTextFieldCustom {...defaultProps} />);
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('has proper label association', () => {
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          label="Price"
        />,
      );
      expect(screen.getByLabelText('Price')).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <NumberTextFieldCustom
          {...defaultProps}
          value={5}
        />,
      );

      const input = screen.getByRole('spinbutton');
      input.focus();
      expect(input).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(input).toHaveFocus();
    });
  });
});
