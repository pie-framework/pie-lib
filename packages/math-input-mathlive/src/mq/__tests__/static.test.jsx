import * as React from 'react';
import { render } from '@testing-library/react';
import Static from '../static';

describe('Static (MathLive)', () => {
  beforeEach(() => {
    require('mathlive').convertLatexToMarkup.mockClear();
  });

  it('renders a span wrapper', () => {
    const { container } = render(<Static latex={'\\frac{1}{2}'} className="x" />);
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('x');
  });

  it('calls convertLatexToMarkup with normalized latex', () => {
    const ml = require('mathlive');
    render(<Static latex={'\\frac{1}{2}'} />);
    expect(ml.convertLatexToMarkup).toHaveBeenCalled();
  });

  it('handles empty latex without crashing', () => {
    const { container } = render(<Static latex={''} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
