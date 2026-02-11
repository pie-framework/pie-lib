import { render, screen } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Protractor } from '../index';
import React from 'react';

// Mock the Rotatable component to avoid complex DOM interactions
jest.mock('../../rotatable', () => {
  return function MockRotatable({ children }) {
    return <div data-testid="rotatable">{children}</div>;
  };
});

// Mock the Graphic component
jest.mock('../graphic', () => {
  return function MockGraphic() {
    return <div data-testid="protractor-graphic" />;
  };
});

describe('protractor', () => {
  const theme = createTheme();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      width: 450,
      ...props,
    };

    return render(
      <ThemeProvider theme={theme}>
        <Protractor {...defaultProps} />
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('renders protractor component', () => {
      renderComponent();
      expect(screen.getByTestId('rotatable')).toBeInTheDocument();
      expect(screen.getByTestId('protractor-graphic')).toBeInTheDocument();
    });

    it('renders with default width', () => {
      const { container } = renderComponent();
      const protractorDiv = container.querySelector('div[style*="width"]');
      expect(protractorDiv).toHaveStyle({ width: '450px' });
    });

    it('renders with custom width', () => {
      const { container } = renderComponent({ width: 600 });
      const protractorDiv = container.querySelector('div[style*="width"]');
      expect(protractorDiv).toHaveStyle({ width: '600px' });
    });

    it('renders with custom startPosition', () => {
      renderComponent({ startPosition: { left: 100, top: 200 } });
      expect(screen.getByTestId('protractor-graphic')).toBeInTheDocument();
    });

    it('renders with className', () => {
      const { container } = renderComponent({ className: 'custom-class' });
      expect(screen.getByTestId('rotatable')).toBeInTheDocument();
    });
  });
});
