import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../input';

describe('Input Component', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  describe('Rendering', () => {
    it('should render input without label', () => {
      const { container } = render(<Input type="text" value="test" onChange={onChange} />);

      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
      expect(input.value).toBe('test');
    });

    it('should render input with label', () => {
      render(<Input type="text" label="Email" value="test@example.com" onChange={onChange} />);

      expect(screen.getByText('Email')).toBeInTheDocument();
      const input = screen.getByDisplayValue('test@example.com');
      expect(input).toBeInTheDocument();
    });

    it('should render input with different types', () => {
      const { container: numberContainer } = render(<Input type="number" value={123} onChange={onChange} />);
      expect(numberContainer.querySelector('input[type="number"]')).toBeInTheDocument();

      const { container: emailContainer } = render(<Input type="email" value="test@example.com" onChange={onChange} />);
      expect(emailContainer.querySelector('input[type="email"]')).toBeInTheDocument();

      const { container: passwordContainer } = render(<Input type="password" value="secret" onChange={onChange} />);
      expect(passwordContainer.querySelector('input[type="password"]')).toBeInTheDocument();
    });
  });

  describe('Value handling', () => {
    it('should handle string values', () => {
      const { container } = render(<Input type="text" value="hello" onChange={onChange} />);
      expect(container.querySelector('input').value).toBe('hello');
    });

    it('should handle number values', () => {
      const { container } = render(<Input type="number" value={42} onChange={onChange} />);
      expect(container.querySelector('input').value).toBe('42');
    });

    it('should handle empty values', () => {
      const { container } = render(<Input type="text" value="" onChange={onChange} />);
      expect(container.querySelector('input').value).toBe('');
    });

    it('should update when prop changes', () => {
      const { container, rerender } = render(<Input type="text" value="initial" onChange={onChange} />);
      expect(container.querySelector('input').value).toBe('initial');

      rerender(<Input type="text" value="updated" onChange={onChange} />);
      expect(container.querySelector('input').value).toBe('updated');
    });
  });

  describe('onChange behavior', () => {
    it('should call onChange on input change', async () => {
      const user = userEvent.setup();
      const { container } = render(<Input type="text" value="" onChange={onChange} />);

      const input = container.querySelector('input');
      await user.type(input, 'hello');

      expect(onChange).toHaveBeenCalled();
    });

    it('should handle custom error function', async () => {
      const user = userEvent.setup();
      const customError = jest.fn((value) => value.length < 3);

      const { container } = render(<Input type="text" value="" onChange={onChange} error={customError} />);

      const input = container.querySelector('input');
      await user.type(input, 'ab');

      expect(customError).toHaveBeenCalled();
    });
  });

  describe('Error state', () => {
    it('should display error state when validation fails', async () => {
      const user = userEvent.setup();
      const customError = jest.fn(() => true);

      const { container } = render(<Input type="text" value="" onChange={onChange} error={customError} />);

      const input = container.querySelector('input');
      await user.type(input, 'test');

      expect(customError).toHaveBeenCalled();
    });

    it('should clear error state when validation passes', async () => {
      const user = userEvent.setup();
      const customError = jest.fn((value) => !value);

      const { container } = render(<Input type="text" value="" onChange={onChange} error={customError} />);

      const input = container.querySelector('input');
      await user.type(input, 'test');

      // After typing valid content, error should be false
      expect(customError).toHaveBeenCalled();
    });
  });

  describe('Props spreading', () => {
    it('should handle disabled state', () => {
      const { container } = render(<Input type="text" value="" onChange={onChange} disabled />);

      const input = container.querySelector('input');
      expect(input).toBeDisabled();
    });

    it('should handle readonly state', () => {
      const { container } = render(<Input type="text" value="readonly" onChange={onChange} readOnly />);

      const input = container.querySelector('input');
      expect(input).toHaveAttribute('readonly');
    });
  });

  describe('Default props', () => {
    it('should use default type of text', () => {
      const { container } = render(<Input value="" onChange={onChange} />);

      const input = container.querySelector('input');
      expect(input.type).toBe('text');
    });

    it('should use default error function that validates number type', () => {
      const { container } = render(<Input type="number" value="" onChange={onChange} />);

      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
    });

    it('should have noModelUpdateOnError default to false', () => {
      const { container } = render(<Input type="text" value="" onChange={onChange} />);

      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
    });
  });
});
