import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { PartialScoringConfig } from '../index';

describe('PartialScoringConfig', () => {
  const theme = createTheme();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      classes: {},
      partialScoring: false,
      onChange: jest.fn(),
      ...props,
    };

    return {
      ...render(
        <ThemeProvider theme={theme}>
          <PartialScoringConfig {...defaultProps} />
        </ThemeProvider>
      ),
      onChange: defaultProps.onChange,
    };
  };

  describe('rendering', () => {
    it('renders title and default description', () => {
      renderComponent();

      expect(screen.getByText('Partial Scoring Rules')).toBeInTheDocument();
      expect(screen.getByText('Each correct response is worth 1/X where X is the number of correct answer selections.')).toBeInTheDocument();
    });

    it('renders checkbox', () => {
      renderComponent();

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it('renders with custom label', () => {
      const customLabel = 'Custom scoring label';
      renderComponent({ label: customLabel });

      expect(screen.getByText(customLabel)).toBeInTheDocument();
      expect(screen.queryByText('Each correct response is worth 1/X where X is the number of correct answer selections.')).not.toBeInTheDocument();
    });

    it('renders checkbox as checked when partialScoring is true', () => {
      renderComponent({ partialScoring: true });

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('renders checkbox as unchecked when partialScoring is false', () => {
      renderComponent({ partialScoring: false });

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('interactions', () => {
    it('calls onChange with true when checkbox is clicked (initially unchecked)', async () => {
      const user = userEvent.setup();
      const { onChange } = renderComponent({ partialScoring: false });

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(onChange).toHaveBeenCalledWith(true);
      expect(checkbox).toBeChecked();
    });

    it('calls onChange with false when checkbox is clicked (initially checked)', async () => {
      const user = userEvent.setup();
      const { onChange } = renderComponent({ partialScoring: true });

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(onChange).toHaveBeenCalledWith(false);
      expect(checkbox).not.toBeChecked();
    });

    it('toggles checkbox state on multiple clicks', async () => {
      const user = userEvent.setup();
      const { onChange } = renderComponent({ partialScoring: false });

      const checkbox = screen.getByRole('checkbox');

      // First click: unchecked -> checked
      await user.click(checkbox);
      expect(onChange).toHaveBeenCalledWith(true);
      expect(checkbox).toBeChecked();

      // Second click: checked -> unchecked
      await user.click(checkbox);
      expect(onChange).toHaveBeenCalledWith(false);
      expect(checkbox).not.toBeChecked();
    });
  });
});
