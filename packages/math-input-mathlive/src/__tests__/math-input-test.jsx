import React from 'react';
import { render } from '@testing-library/react';
import MathInput from '../math-input';

describe('MathInput', () => {
  it('renders without crashing', () => {
    const { container } = render(<MathInput />);
    expect(container.firstChild).toBeDefined();
  });
});
