import { RawPureToolbar } from '../index';
import { render } from '@testing-library/react';
import React from 'react';

describe('RawPureToolbar', () => {
  const defaultProps = {
    classes: {},
    controlledKeypad: true,
    showKeypad: true,
  };

  it('renders with DONE button if hideDoneButton is not defined', () => {
    const { container } = render(<RawPureToolbar {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders without DONE button if hideDoneButton value is true', () => {
    const { container } = render(<RawPureToolbar {...defaultProps} hideDoneButton={true} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
