import { Token } from '../token';
import React from 'react';
import { render } from '@testing-library/react';

describe('token', () => {
  const defaultProps = {
    classes: {
      token: 'token',
      selectable: 'selectable',
    },
    text: 'foo bar',
  };

  describe('rendering', () => {
    it('renders with text', () => {
      const { container } = render(<Token {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with newlines', () => {
      const { container } = render(<Token {...defaultProps} text="foo \nbar" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with multiple newlines', () => {
      const { container } = render(<Token {...defaultProps} text="line1\nline2\nline3" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
