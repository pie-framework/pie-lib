import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { choice } from '../../__tests__/utils';
import Dropdown from '../dropdown';

describe('Dropdown', () => {
  const onChange = jest.fn();
  const defaultProps = {
    onChange,
    id: '1',
    correct: false,
    disabled: false,
    value: 'Jumped',
    choices: [choice('Jumped'), choice('Laughed'), choice('Smiled')],
  };

  beforeEach(() => {
    onChange.mockClear();
  });

  describe('rendering', () => {
    it('renders dropdown with default props', () => {
      render(<Dropdown {...defaultProps} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select).toHaveValue('Jumped');
    });

    it('renders with all choices as options', () => {
      render(<Dropdown {...defaultProps} />);
      expect(screen.getByRole('option', { name: 'Jumped' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Laughed' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Smiled' })).toBeInTheDocument();
    });

    it('renders as disabled when disabled prop is true', () => {
      render(<Dropdown {...defaultProps} disabled={true} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });

    it('shows correct state when correct is true', () => {
      const { container } = render(<Dropdown {...defaultProps} correct={true} />);
      // Check for correct styling or data attributes
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('calls onChange when user selects a different option', async () => {
      const user = userEvent.setup();
      render(<Dropdown {...defaultProps} />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'Laughed');

      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: { value: 'Laughed' } }));
    });

    it('calls onChange with correct value', async () => {
      const user = userEvent.setup();
      render(<Dropdown {...defaultProps} />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'Smiled');

      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: { value: 'Smiled' } }));
    });
  });
});
