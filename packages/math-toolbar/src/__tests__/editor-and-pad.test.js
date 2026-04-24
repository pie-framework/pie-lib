import { EditorAndPad } from '../editor-and-pad';
import { render } from '@testing-library/react';
import React from 'react';

describe('EditorAndPad', () => {
  const defaultProps = {
    classes: {},
    classNames: {},
    onBlur: jest.fn(),
  };

  it('renders with default props', () => {
    const { container } = render(<EditorAndPad {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
