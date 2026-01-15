import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Graphic } from '../graphic';
import React from 'react';

describe('graphic', () => {
  const theme = createTheme();

  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <Graphic {...props} />
      </ThemeProvider>
    );
  };

  describe('rendering', () => {
    it('renders svg with correct viewBox', () => {
      const { container } = renderComponent();
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 102 61');
    });

    it('renders path element', () => {
      const { container } = renderComponent();
      const path = container.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('d', 'M 1,50 A 1,1 0 0 1 100,50 L 100,60 L 1,60 Z');
    });

    it('renders circle element', () => {
      const { container } = renderComponent();
      const circle = container.querySelector('circle');
      expect(circle).toBeInTheDocument();
      expect(circle).toHaveAttribute('r', '4');
      expect(circle).toHaveAttribute('cx', '50.5');
      expect(circle).toHaveAttribute('cy', '50');
    });

    it('renders multiple line elements', () => {
      const { container } = renderComponent();
      const lines = container.querySelectorAll('line');
      // Should render 181 angle lines + 2 crosshair lines = 183+ lines
      expect(lines.length).toBeGreaterThan(180);
    });

    it('renders text elements for angles', () => {
      const { container } = renderComponent();
      const texts = container.querySelectorAll('text');
      // Should render text for angles 0, 10, 20, ..., 180 (19 texts)
      expect(texts.length).toBeGreaterThan(15);
    });

    it('renders correct angle labels', () => {
      const { container } = renderComponent();
      const texts = container.querySelectorAll('text');
      const textContents = Array.from(texts).map(t => t.textContent);
      expect(textContents).toContain('0');
      expect(textContents).toContain('90');
      expect(textContents).toContain('180');
    });
  });
});
