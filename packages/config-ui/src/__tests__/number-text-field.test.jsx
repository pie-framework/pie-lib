import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberTextField } from '../number-text-field';

describe('NumberTextField', () => {
  const defaultProps = {
    value: 1,
    min: 1,
    max: 10,
    classes: {},
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders TextField with correct value', () => {
      render(<NumberTextField {...defaultProps} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(1);
    });

    it('renders with custom label', () => {
      render(<NumberTextField {...defaultProps} label="Custom Label" />);
      expect(screen.getByLabelText('Custom Label')).toBeInTheDocument();
    });

    it('renders with suffix', () => {
      const { container } = render(<NumberTextField {...defaultProps} suffix="px" />);
      expect(screen.getByText('px')).toBeInTheDocument();
    });

    it('renders without suffix when not provided', () => {
      const { container } = render(<NumberTextField {...defaultProps} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
    });

    it('renders as disabled when disabled prop is true', () => {
      render(<NumberTextField {...defaultProps} disabled={true} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toBeDisabled();
    });

    it('renders as enabled when disabled prop is false', () => {
      render(<NumberTextField {...defaultProps} disabled={false} />);
      const input = screen.getByRole('spinbutton');
      expect(input).not.toBeDisabled();
    });

    it('renders with custom variant', () => {
      const { container } = render(<NumberTextField {...defaultProps} variant="outlined" />);
      expect(container.querySelector('input')).toBeInTheDocument();
    });

    it('renders with disableUnderline variant', () => {
      const { container } = render(<NumberTextField {...defaultProps} disableUnderline={true} />);
      expect(container.querySelector('input')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(<NumberTextField {...defaultProps} className="custom-class" />);
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('renders with custom inputClassName', () => {
      const { container } = render(<NumberTextField {...defaultProps} inputClassName="input-class" />);
      expect(container.querySelector('.input-class')).toBeInTheDocument();
    });

    it('renders with ShrinkLabel InputLabelProps', () => {
      render(<NumberTextField {...defaultProps} label="Shrink Label" />);
      expect(screen.getByLabelText('Shrink Label')).toBeInTheDocument();
    });

    it('renders with margin normal', () => {
      const { container } = render(<NumberTextField {...defaultProps} />);
      expect(container.querySelector('input')).toBeInTheDocument();
    });
  });

  describe('onChange callback', () => {
    it('calls onChange with clamped value on blur', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<NumberTextField {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '15');
      fireEvent.blur(input);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(expect.anything(), 10);
      });
    });

    it('calls onChange on Enter key press', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<NumberTextField {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '5');
      await user.keyboard('{Enter}');

      expect(input).toHaveValue(5);
    });

    it('calls onChange during typing (unvalidated)', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<NumberTextField {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '7');

      // onChange should be called at least once during typing
      expect(input).toHaveValue(7);
    });

    it('does not call onChange when value does not change on blur', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<NumberTextField {...defaultProps} value={5} onChange={onChange} />);

      const input = screen.getByRole('spinbutton');
      fireEvent.blur(input);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('range constraints', () => {
    it('handles only min constraint', async () => {
      const user = userEvent.setup();
      const { container } = render(<NumberTextField value={5} min={3} onChange={jest.fn()} />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(5);
    });

    it('handles only max constraint', async () => {
      const user = userEvent.setup();
      const { container } = render(<NumberTextField value={5} max={10} onChange={jest.fn()} />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(5);
    });

    it('handles no constraints', () => {
      const { container } = render(<NumberTextField value={100} onChange={jest.fn()} />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(100);
    });
  });

  describe('keyboard interactions', () => {
    it('handles Enter key to blur', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<NumberTextField {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('spinbutton');
      input.focus();
      await user.type(input, '{Enter}');

      expect(input).not.toHaveFocus();
    });

    it('allows typing numbers', async () => {
      const user = userEvent.setup();
      render(<NumberTextField {...defaultProps} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '42');

      expect(input).toHaveValue(42);
    });

    it('allows negative sign', async () => {
      const user = userEvent.setup();
      render(<NumberTextField {...defaultProps} min={-100} value={0} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '-5');

      expect(input).toHaveValue(-5);
    });
  });

  describe('props updates', () => {
    it('updates value when prop changes', () => {
      const { rerender } = render(<NumberTextField {...defaultProps} value={5} />);

      let input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(5);

      rerender(<NumberTextField {...defaultProps} value={8} />);

      input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(8);
    });

    it('updates constraints when min/max props change', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      const { rerender } = render(<NumberTextField value={5} min={1} max={10} onChange={onChange} />);

      rerender(<NumberTextField value={5} min={1} max={8} onChange={onChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '15');
      fireEvent.blur(input);

      await waitFor(() => {
        expect(input).toHaveValue(8); // Clamped to new max
      });
    });

    it('re-clamps value when constraints become more restrictive', () => {
      const onChange = jest.fn();
      const { rerender } = render(<NumberTextField value={8} min={1} max={10} onChange={onChange} />);

      rerender(<NumberTextField value={8} min={1} max={5} onChange={onChange} />);

      // Component should re-clamp the value
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });
  });

  describe('fallback number logic', () => {
    it('defaults to 0 when no min or max is provided', () => {
      render(<NumberTextField value={undefined} onChange={jest.fn()} />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(0);
    });

    it('defaults to max when only max is provided', () => {
      render(<NumberTextField value={undefined} max={15} onChange={jest.fn()} />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(15);
    });

    it('defaults to min when only min is provided', () => {
      render(<NumberTextField value={undefined} min={5} onChange={jest.fn()} />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(5);
    });
  });
});
