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

      // Should be called for each character typed
      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenLastCalledWith('1', '20');
    });

    it('calls onChange with updated value', async () => {
      const user = userEvent.setup();
      render(<Input {...defaultProps} />);

      const input = screen.getByTestId('correct-input');
      await user.clear(input);
      await user.type(input, 'New Value');

      expect(onChange).toHaveBeenLastCalledWith('1', 'New Value');
    });
  });
});
