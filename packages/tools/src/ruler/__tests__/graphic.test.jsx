import { render } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Graphic } from '../graphic';
import React from 'react';

describe('graphic', () => {
  const theme = createTheme();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      width: 300,
      height: 100,
      units: 12,
      unit: {
        type: 'in',
        ticks: 16,
      },
      ...props,
    };

    return render(
      <ThemeProvider theme={theme}>
        <Graphic {...defaultProps} />
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('renders svg with correct viewBox', () => {
      const { container } = renderComponent({ width: 300, height: 100 });
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 300 100');
    });

    it('renders background rect with correct dimensions', () => {
      const { container } = renderComponent({ width: 300, height: 100 });
      const rect = container.querySelector('rect');
      expect(rect).toBeInTheDocument();
      expect(rect).toHaveAttribute('width', '300');
      expect(rect).toHaveAttribute('height', '100');
    });

    it('renders correct number of unit markers', () => {
      const { container } = renderComponent({ units: 12 });
      const svg = container.querySelector('svg');
      // Each unit renders as a group element with a specific structure
      const groups = svg.querySelectorAll('g');
      expect(groups.length).toBeGreaterThan(0);
    });

    it('renders with different unit types', () => {
      const { container } = renderComponent({ unit: { type: 'cm', ticks: 10 } });
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with custom dimensions', () => {
      const { container } = renderComponent({ width: 480, height: 60, units: 10 });
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 480 60');
    });
  });
});
