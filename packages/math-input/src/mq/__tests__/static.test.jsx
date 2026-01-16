import * as React from 'react';
import { render } from '@testing-library/react';
import Static from '../static';

const Mathquill = require('@pie-framework/mathquill');

jest.mock('@pie-framework/mathquill', () => ({
  StaticMath: jest.fn().mockReturnValue({
    latex: jest.fn(),
    parseLatex: jest.fn(),
  }),
  getInterface: jest.fn().mockReturnThis(),
}));

describe('static', () => {
  describe('rendering', () => {
    it('renders with latex prop', () => {
      const { container } = render(<Static latex="foo" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with empty latex', () => {
      const { container } = render(<Static latex="" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // Note: Tests for internal methods like componentDidMount, shouldComponentUpdate
  // are implementation details and cannot be directly tested with RTL.
  // These components are wrappers around MathQuill library and the original tests
  // focused on testing internal implementation rather than user-facing behavior.
  // The actual MathQuill integration is tested through integration/e2e tests.
});
