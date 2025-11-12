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
  });

  describe('validation on blur', () => {
    it('accepts valid values within range', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<NumberTextField {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '5');
      await user.tab(); // Trigger blur

      expect(input).toHaveValue(5);
    });

    it('clamps value to min when below minimum', async () => {
      const user = userEvent.setup();
      render(<NumberTextField {...defaultProps} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '0');
      fireEvent.blur(input); // Trigger blur directly

      await waitFor(() => {
        expect(input).toHaveValue(1); // Should clamp to min
      });
    });

    it('clamps value to max when above maximum', async () => {
      const user = userEvent.setup();
      render(<NumberTextField {...defaultProps} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '15');
      fireEvent.blur(input); // Trigger blur directly

      await waitFor(() => {
        expect(input).toHaveValue(10); // Should clamp to max
      });
    });

    it('resets to min value when input is invalid text', async () => {
      const user = userEvent.setup();
      render(<NumberTextField {...defaultProps} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, 'abc');
      fireEvent.blur(input); // Trigger blur directly

      await waitFor(() => {
        expect(input).toHaveValue(1); // Should reset to min
      });
    });

    it('resets to min value when input is empty', async () => {
      const user = userEvent.setup();
      render(<NumberTextField {...defaultProps} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      fireEvent.blur(input); // Trigger blur directly

      await waitFor(() => {
        expect(input).toHaveValue(1); // Should reset to min
      });
    });

    it('accepts negative values if min is negative', async () => {
      const user = userEvent.setup();
      render(<NumberTextField {...defaultProps} min={-5} value={-2} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '-3');
      await user.tab();

      expect(input).toHaveValue(-3);
    });

    it('clamps negative value below min', async () => {
      const user = userEvent.setup();
      render(<NumberTextField {...defaultProps} min={-5} max={5} value={0} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '-10');
      fireEvent.blur(input); // Trigger blur directly

      await waitFor(() => {
        expect(input).toHaveValue(-5); // Should clamp to min
      });
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
      fireEvent.blur(input); // Trigger blur directly

      // Should be called with event and clamped value
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(expect.anything(), 10);
      });
    });
  });

});
