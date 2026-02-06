import { render, screen } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Ruler } from '../index';
import React from 'react';

// Mock the Rotatable component to avoid complex DOM interactions
jest.mock('../../rotatable', () => {
  return function MockRotatable({ children }) {
    return <div data-testid="rotatable">{children}</div>;
  };
});

// Mock the RulerGraphic component to verify props
jest.mock('../graphic', () => {
  return function MockRulerGraphic(props) {
    return <div data-testid="ruler-graphic" data-unit={JSON.stringify(props.unit)} />;
  };
});

describe('ruler', () => {
  const theme = createTheme();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      units: 12,
      measure: 'imperial',
      ...props,
    };

    return render(
      <ThemeProvider theme={theme}>
        <Ruler {...defaultProps} />
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('renders ruler component', () => {
      renderComponent();
      expect(screen.getByTestId('rotatable')).toBeInTheDocument();
      expect(screen.getByTestId('ruler-graphic')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      renderComponent();
      const graphic = screen.getByTestId('ruler-graphic');
      expect(graphic).toBeInTheDocument();
    });

    it('renders with custom startPosition', () => {
      renderComponent({ startPosition: { left: 100, top: 200 } });
      expect(screen.getByTestId('ruler-graphic')).toBeInTheDocument();
    });
  });

  describe('logic', () => {
    it('sets unit for imperial', () => {
      renderComponent({ measure: 'imperial', label: 'in' });
      const graphic = screen.getByTestId('ruler-graphic');
      const unit = JSON.parse(graphic.getAttribute('data-unit'));
      expect(unit).toEqual({ ticks: 16, type: 'in' });
    });

    it('sets unit for metric', () => {
      renderComponent({ measure: 'metric', label: 'cm' });
      const graphic = screen.getByTestId('ruler-graphic');
      const unit = JSON.parse(graphic.getAttribute('data-unit'));
      expect(unit).toEqual({ ticks: 10, type: 'cm' });
    });

    it('sets custom tick count for imperial when divisible by 4', () => {
      renderComponent({ measure: 'imperial', label: 'in', tickCount: 8 });
      const graphic = screen.getByTestId('ruler-graphic');
      const unit = JSON.parse(graphic.getAttribute('data-unit'));
      expect(unit).toEqual({ ticks: 8, type: 'in' });
    });

    it('defaults to 16 ticks for imperial when tickCount not divisible by 4', () => {
      renderComponent({ measure: 'imperial', label: 'in', tickCount: 7 });
      const graphic = screen.getByTestId('ruler-graphic');
      const unit = JSON.parse(graphic.getAttribute('data-unit'));
      expect(unit).toEqual({ ticks: 16, type: 'in' });
    });
  });
});
