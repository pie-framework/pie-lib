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
      const button = screen.getByRole('combobox');
      expect(button).toBeInTheDocument();
      // Button displays the selected value
      expect(button).toHaveTextContent('Jumped');
    });

    it('renders with all choices as options when opened', async () => {
      const user = userEvent.setup();
      render(<Dropdown {...defaultProps} />);

      const button = screen.getByRole('combobox');
      await user.click(button);

      // Options should now be visible - find them by role
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
      // Verify the text content of options using specific elements
      expect(options[0]).toHaveTextContent('Jumped');
      expect(options[1]).toHaveTextContent('Laughed');
      expect(options[2]).toHaveTextContent('Smiled');
    });

    it('renders as disabled when disabled prop is true', () => {
      render(<Dropdown {...defaultProps} disabled={true} />);
      const button = screen.getByRole('combobox');
      expect(button).toBeDisabled();
    });

    it('shows correct state when correct is true', () => {
      const { container } = render(<Dropdown {...defaultProps} correct={true} />);
      const button = screen.getByRole('combobox');
      expect(button).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('calls onChange when user selects a different option', async () => {
      const user = userEvent.setup();
      render(<Dropdown {...defaultProps} />);

      // Click button to open menu
      const button = screen.getByRole('combobox');
      await user.click(button);

      // Find the option by getting all options and selecting the one with "Laughed" text
      const options = screen.getAllByRole('option');
      const laughedOption = options.find(opt => opt.textContent.includes('Laughed'));
      await user.click(laughedOption);

      expect(onChange).toHaveBeenCalledWith('1', 'Laughed');
    });

    it('calls onChange with correct value', async () => {
      const user = userEvent.setup();
      render(<Dropdown {...defaultProps} />);

      // Click button to open menu
      const button = screen.getByRole('combobox');
      await user.click(button);

      // Find the option by getting all options and selecting the one with "Smiled" text
      const options = screen.getAllByRole('option');
      const smiledOption = options.find(opt => opt.textContent.includes('Smiled'));
      await user.click(smiledOption);

      expect(onChange).toHaveBeenCalledWith('1', 'Smiled');
    });
  });
});
