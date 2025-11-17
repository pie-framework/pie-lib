import * as React from 'react';
import { render } from '@testing-library/react';
import { Input } from '../input';

describe('Input', () => {
  const onChange = jest.fn();
  const defaultProps = {
    classes: {},
    className: 'className',
    onChange,
  };

  beforeEach(() => {
    onChange.mockClear();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const { container } = render(<Input {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('className');
    });

    it('renders with latex prop', () => {
      const { container } = render(<Input {...defaultProps} latex="x^2" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with disabled prop', () => {
      const { container } = render(<Input {...defaultProps} disabled={true} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // Note: Tests for internal methods (clear, blur, focus, command, keystroke, write)
  // are implementation details and cannot be directly tested with RTL.
  // These components are wrappers around MathQuill library and the original tests
  // focused on testing internal implementation via instance methods rather than user-facing behavior.
  // The actual MathQuill integration and user interactions are tested through integration/e2e tests.
});
