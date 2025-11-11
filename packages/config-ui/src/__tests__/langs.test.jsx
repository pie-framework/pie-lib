import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Langs } from '../langs';

describe('langs', () => {
  let onChange;
  const renderComponent = (extras = {}) => {
    const defaults = {
      uid: '1',
      onChange,
      langs: ['en-US', 'es-ES'],
      selected: 'en-US',
    };
    const props = { ...defaults, ...extras };
    return render(<Langs {...props} />);
  };

  beforeEach(() => {
    onChange = jest.fn();
  });

  describe('rendering', () => {
    it('renders language selector with options', () => {
      renderComponent();

      // Select should be present
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();

      // Should show selected value - MUI Select displays value as text content
      expect(select).toHaveTextContent('en-US');
    });

    it('renders with custom label', () => {
      renderComponent({ label: 'Choose Language' });
      expect(screen.getByText('Choose Language')).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('calls onChange when user selects a language', async () => {
      const user = userEvent.setup();
      renderComponent();

      const select = screen.getByRole('combobox');

      // Open the select and choose es-ES
      await user.click(select);
      await user.click(screen.getByRole('option', { name: 'es-ES' }));

      expect(onChange).toHaveBeenCalledWith('es-ES');
    });

    it('calls onChange with correct value', async () => {
      const user = userEvent.setup();
      renderComponent({ selected: 'es-ES' });

      const select = screen.getByRole('combobox');

      await user.click(select);
      await user.click(screen.getByRole('option', { name: 'en-US' }));

      expect(onChange).toHaveBeenCalledWith('en-US');
    });
  });
});
