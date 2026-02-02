import React from 'react';
import { render } from '@testing-library/react';
import MathPreview from '../math-preview';

describe('MathPreview', () => {
  const defaultProps = {
    latex: 'sqrt(5)',
    classes: {},
    isSelected: false,
    onFocus: jest.fn(),
    onBlur: jest.fn(),
  };

  it('renders with default props', () => {
    const { container } = render(<MathPreview {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
