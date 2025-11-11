import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CorrectInput from '../correct-input';

describe('CorrectInput', () => {
  const onChange = jest.fn();
  const defaultProps = {
    disabled: false,
    correct: false,
    variant: 'outlined',
    value: 'Cow',
    onChange,
  };

  beforeEach(() => {
    onChange.mockClear();
  });

  describe('rendering', () => {
    it('renders input with default props', () => {
      render(<CorrectInput {...defaultProps} />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('Cow');
    });

    it('renders as disabled when disabled prop is true', () => {
      render(<CorrectInput {...defaultProps} disabled={true} />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('renders with correct state as false', () => {
      const { container } = render(<CorrectInput {...defaultProps} correct={false} />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders with correct state as true', () => {
      const { container } = render(<CorrectInput {...defaultProps} correct={true} />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      // Should show visual indication of correctness
    });

    it('renders with outlined variant', () => {
      render(<CorrectInput {...defaultProps} variant="outlined" />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('calls onChange when user types', async () => {
      const user = userEvent.setup();
      render(<CorrectInput {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, '1');

      expect(onChange).toHaveBeenCalled();
    });

    it('calls onChange with event object', async () => {
      const user = userEvent.setup();
      render(<CorrectInput {...defaultProps} value="" />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(onChange).toHaveBeenCalled();
      // Check that onChange receives an event-like object
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall).toHaveProperty('target');
    });

    it('updates value when user changes input', async () => {
      const user = userEvent.setup();
      render(<CorrectInput {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Dog');

      expect(onChange).toHaveBeenCalled();
    });
  });
});
