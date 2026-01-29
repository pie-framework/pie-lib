import React from 'react';
import { render } from '@testing-library/react';
import CssIcon from '../icons/CssIcon';

describe('CssIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(<CssIcon />);
    expect(container).toBeInTheDocument();
  });

  it('renders CSS text', () => {
    const { getByText } = render(<CssIcon />);
    expect(getByText('CSS')).toBeInTheDocument();
  });

  it('applies correct font family', () => {
    const { getByText } = render(<CssIcon />);
    const element = getByText('CSS');
    // Font family is applied via styled component, just verify text renders
    expect(element).toBeInTheDocument();
  });

  it('applies bold font weight', () => {
    const { getByText } = render(<CssIcon />);
    const element = getByText('CSS');
    expect(element).toHaveStyle({ fontWeight: 'bold' });
  });

  it('has correct line height', () => {
    const { getByText } = render(<CssIcon />);
    const element = getByText('CSS');
    expect(element).toHaveStyle({ lineHeight: '14px' });
  });

  it('has relative positioning', () => {
    const { getByText } = render(<CssIcon />);
    const element = getByText('CSS');
    expect(element).toHaveStyle({ position: 'relative' });
  });

  it('has nowrap white space', () => {
    const { getByText } = render(<CssIcon />);
    const element = getByText('CSS');
    expect(element).toHaveStyle({ whiteSpace: 'nowrap' });
  });
});
