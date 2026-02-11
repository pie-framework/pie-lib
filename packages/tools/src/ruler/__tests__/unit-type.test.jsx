import { render } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { UnitType } from '../unit-type';
import React from 'react';

describe('unit-type', () => {
  const theme = createTheme();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      label: 'cm',
      ...props,
    };

    return render(
      <ThemeProvider theme={theme}>
        <svg>
          <UnitType {...defaultProps} />
        </svg>
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('renders text element with label', () => {
      const { container } = renderComponent({ label: 'cm' });
      const text = container.querySelector('text');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent('cm');
    });

    it('renders with default position', () => {
      const { container } = renderComponent();
      const text = container.querySelector('text');
      expect(text).toHaveAttribute('x', '8');
      expect(text).toHaveAttribute('y', '14');
    });

    it('renders with custom position', () => {
      const { container } = renderComponent({ x: 20, y: 30 });
      const text = container.querySelector('text');
      expect(text).toHaveAttribute('x', '20');
      expect(text).toHaveAttribute('y', '30');
    });

    it('renders with custom fontSize', () => {
      const { container } = renderComponent({ fontSize: 16 });
      const text = container.querySelector('text');
      expect(text).toBeInTheDocument();
    });

    it('renders with different labels', () => {
      const { container, rerender } = renderComponent({ label: 'in' });
      expect(container.querySelector('text')).toHaveTextContent('in');

      rerender(
        <ThemeProvider theme={theme}>
          <svg>
            <UnitType label="mm" />
          </svg>
        </ThemeProvider>,
      );
      expect(container.querySelector('text')).toHaveTextContent('mm');
    });
  });
});
