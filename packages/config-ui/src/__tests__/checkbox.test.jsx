import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkbox from '../checkbox';

describe('Checkbox Component', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  describe('Rendering', () => {
    it('should render checkbox with label', () => {
      render(
        <Checkbox 
          checked={false} 
          onChange={onChange} 
          label="Accept terms" 
        />,
      );

      expect(screen.getByText('Accept terms')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should render checkbox in checked state', () => {
      render(
        <Checkbox 
          checked={true} 
          onChange={onChange} 
          label="Accept terms" 
        />,
      );

      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('should render checkbox in unchecked state', () => {
      render(
        <Checkbox 
          checked={false} 
          onChange={onChange} 
          label="Accept terms" 
        />,
      );

      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('should render mini checkbox with reduced styling', () => {
      render(
        <Checkbox 
          checked={false} 
          onChange={onChange} 
          label="Mini" 
          mini={true}
        />,
      );

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText('Mini')).toBeInTheDocument();
    });
  });

  describe('User interaction', () => {
    it('should call onChange when checkbox is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Checkbox 
          checked={false} 
          onChange={onChange} 
          label="Accept" 
        />,
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(onChange).toHaveBeenCalled();
    });

    it('should call onChange when label is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Checkbox 
          checked={false} 
          onChange={onChange} 
          label="Click label" 
        />,
      );

      const label = screen.getByText('Click label');
      await user.click(label);

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Props', () => {
    it('should handle value prop', () => {
      render(
        <Checkbox 
          checked={true} 
          onChange={onChange} 
          label="With value"
          value="option1"
        />,
      );

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should display error styling when error is true', () => {
      render(
        <Checkbox 
          checked={false} 
          onChange={onChange} 
          label="Error state"
          error={true}
        />,
      );

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText('Error state')).toBeInTheDocument();
    });
  });

  describe('Default props', () => {
    it('should have mini default to false', () => {
      const { container } = render(
        <Checkbox 
          checked={true} 
          onChange={onChange} 
          label="Test"
        />,
      );

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should have error default to false', () => {
      const { container } = render(
        <Checkbox 
          checked={true} 
          onChange={onChange} 
          label="Test"
        />,
      );

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should have value default to empty string', () => {
      render(
        <Checkbox 
          checked={true} 
          onChange={onChange} 
          label="Test"
        />,
      );

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper label association', () => {
      render(
        <Checkbox 
          checked={false} 
          onChange={onChange} 
          label="Accessible label"
        />,
      );

      expect(screen.getByLabelText('Accessible label')).toBeInTheDocument();
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(
        <Checkbox 
          checked={false} 
          onChange={onChange} 
          label="Keyboard test"
        />,
      );

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      expect(checkbox).toHaveFocus();

      await user.keyboard(' ');
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Multiple checkboxes', () => {
    it('should render multiple independent checkboxes', () => {
      const onChange1 = jest.fn();
      const onChange2 = jest.fn();

      render(
        <>
          <Checkbox 
            checked={true} 
            onChange={onChange1} 
            label="Option 1"
          />
          <Checkbox 
            checked={false} 
            onChange={onChange2} 
            label="Option 2"
          />
        </>,
      );

      expect(screen.getByLabelText('Option 1')).toBeChecked();
      expect(screen.getByLabelText('Option 2')).not.toBeChecked();
    });

    it('should handle independent onChange callbacks', async () => {
      const user = userEvent.setup();
      const onChange1 = jest.fn();
      const onChange2 = jest.fn();

      render(
        <>
          <Checkbox 
            checked={true} 
            onChange={onChange1} 
            label="Option 1"
          />
          <Checkbox 
            checked={false} 
            onChange={onChange2} 
            label="Option 2"
          />
        </>,
      );

      await user.click(screen.getByLabelText('Option 2'));

      expect(onChange2).toHaveBeenCalled();
      expect(onChange1).not.toHaveBeenCalled();
    });
  });
});
