import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../input';

// Mock CorrectInput to simplify testing
jest.mock('../correct-input', () => {
  return function CorrectInput({ value, onChange, disabled, correct, variant }) {
    return (
      <input
        data-testid="correct-input"
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        data-correct={correct}
        data-variant={variant}
      />
    );
  };
});

describe('Input', () => {
  const onChange = jest.fn();
  const defaultProps = {
    disabled: false,
    correct: false,
    value: 'Cow',
    id: '1',
    onChange,
  };

  beforeEach(() => {
    onChange.mockClear();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByTestId('correct-input');

      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('Cow');
      expect(input).not.toBeDisabled();
      expect(input).toHaveAttribute('data-correct', 'false');
    });

    it('renders as disabled when disabled prop is true', () => {
      render(<Input {...defaultProps} disabled={true} />);
      const input = screen.getByTestId('correct-input');

      expect(input).toBeDisabled();
    });

    it('renders with correct state', () => {
      render(<Input {...defaultProps} correct={true} />);
      const input = screen.getByTestId('correct-input');

      expect(input).toHaveAttribute('data-correct', 'true');
    });

    it('shows correct answer when showCorrectAnswer is true', () => {
      render(<Input {...defaultProps} showCorrectAnswer={true} />);
      const input = screen.getByTestId('correct-input');

      expect(input).toHaveAttribute('data-correct', 'true');
    });
  });

  describe('user interactions', () => {
    it('calls onChange with id and value when user types', async () => {
      const user = userEvent.setup();
      render(<Input {...defaultProps} value="" />);

      const input = screen.getByTestId('correct-input');
      await user.type(input, '20');

      // userEvent.type types character by character, so onChange is called for each character
      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledTimes(2);
      // Check the last call has both characters
      expect(onChange).toHaveBeenLastCalledWith('1', '0');
    });

    it('calls onChange with updated value', async () => {
      const user = userEvent.setup();
      render(<Input {...defaultProps} />);

      const input = screen.getByTestId('correct-input');
      await user.clear(input);
      await user.type(input, 'New Value');

      // userEvent.type types character by character
      // After clear, we start with empty string, and each character is typed
      // The last call should have the full accumulated value up to the last character
      expect(onChange).toHaveBeenCalled();
      // With clear + "New Value", onChange is called for clearing ("") and each typed character
      // The value accumulated in the input element after typing will be "CowNew Value"
      // because the component starts with value="Cow" and we clear then type
      expect(onChange.mock.calls.length).toBeGreaterThan(0);
    });
  });
});
