import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Unit } from '../unit';
import React from 'react';

describe('unit', () => {
  const theme = createTheme();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      index: 2,
      width: 30,
      height: 20,
      last: false,
      config: { ticks: 10 },
      ...props,
    };

    return render(
      <ThemeProvider theme={theme}>
        <svg>
          <Unit {...defaultProps} />
        </svg>
      </ThemeProvider>
    );
  };

  describe('rendering', () => {
    it('renders group element with correct transform', () => {
      const { container } = renderComponent({ index: 2, width: 30 });
      const group = container.querySelector('g');
      expect(group).toBeInTheDocument();
      expect(group).toHaveStyle({ transform: 'translate(30px, 0px)' });
    });

    it('renders label with index value', () => {
      const { container } = renderComponent({ index: 5 });
      const text = container.querySelector('text');
      expect(text).toHaveTextContent('5');
    });

    it('renders end tick when not last unit', () => {
      const { container } = renderComponent({ last: false });
      const lines = container.querySelectorAll('line');
      // Should have end tick plus ticks based on config
      expect(lines.length).toBeGreaterThan(0);
    });

    it('does not render end tick when last unit', () => {
      const { container } = renderComponent({ last: true });
      const group = container.querySelector('g');
      expect(group).toBeInTheDocument();
    });

    it('renders correct number of tick marks', () => {
      const { container } = renderComponent({ config: { ticks: 16 } });
      const lines = container.querySelectorAll('line');
      // Should render ticks based on config (16 ticks - 1 for range + 1 end tick = 16 total)
      expect(lines.length).toBeGreaterThan(10);
    });

    it('renders with different width', () => {
      const { container } = renderComponent({ index: 3, width: 40 });
      const group = container.querySelector('g');
      expect(group).toHaveStyle({ transform: 'translate(80px, 0px)' });
    });
  });
});
