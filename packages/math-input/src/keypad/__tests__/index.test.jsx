import * as React from 'react';
import { render } from '@testing-library/react';
import { KeyPad } from '../index';

describe('Keypad', () => {
  const onChange = jest.fn();
  const defaultProps = {
    classes: {},
    className: 'className',
    onChange,
    onPress: jest.fn(),
  };

  beforeEach(() => {
    onChange.mockClear();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const { container } = render(<KeyPad {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('className');
    });
  });
});
