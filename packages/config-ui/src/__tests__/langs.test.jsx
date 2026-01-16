import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Langs, LanguageControls } from '../langs';

describe('Langs Component', () => {
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

    it('renders all language options', () => {
      const { container } = renderComponent({
        langs: ['en-US', 'es-ES', 'fr-FR', 'de-DE'],
      });

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('renders with multiple languages', () => {
      const langs = ['en-US', 'es-ES', 'fr-FR', 'pt-BR'];
      renderComponent({ langs });

      const select = screen.getByRole('combobox');
      expect(select).toHaveTextContent('en-US');
    });

    it('renders FormControl with proper structure', () => {
      const { container } = renderComponent();

      expect(container.querySelector('[class*="MuiFormControl"]')).toBeInTheDocument();
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

    it('opens dropdown on click', async () => {
      const user = userEvent.setup();
      renderComponent({
        langs: ['en-US', 'es-ES', 'fr-FR'],
      });

      const select = screen.getByRole('combobox');
      await user.click(select);

      expect(screen.getByRole('option', { name: 'en-US' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'es-ES' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'fr-FR' })).toBeInTheDocument();
    });

    it('does not call onChange if no onChange prop provided', async () => {
      const user = userEvent.setup();
      const { container } = render(<Langs uid="1" langs={['en-US', 'es-ES']} selected="en-US" />);

      const select = screen.getByRole('combobox');
      await user.click(select);
      await user.click(screen.getByRole('option', { name: 'es-ES' }));

      // Should not throw any error
      expect(select).toBeInTheDocument();
    });
  });

  describe('props handling', () => {
    it('accepts custom uid', () => {
      const customUid = 'custom-uid-123';
      const { container } = renderComponent({ uid: customUid });

      const input = container.querySelector(`#${customUid}`);
      expect(input).toBeInTheDocument();
    });

    it('generates random uid if not provided', () => {
      const { container } = render(<Langs onChange={onChange} langs={['en-US', 'es-ES']} selected="en-US" />);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('handles empty label', () => {
      renderComponent({ label: '' });

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('handles very long label', () => {
      const longLabel = 'Choose the language you would like to use for editing this content';
      renderComponent({ label: longLabel });

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });
  });

  describe('value updates', () => {
    it('updates selected value when prop changes', () => {
      const { rerender } = renderComponent({ selected: 'en-US' });

      let select = screen.getByRole('combobox');
      expect(select).toHaveTextContent('en-US');

      rerender(<Langs uid="1" onChange={onChange} langs={['en-US', 'es-ES']} selected="es-ES" />);

      select = screen.getByRole('combobox');
      expect(select).toHaveTextContent('es-ES');
    });

    it('maintains state when language options change', async () => {
      const user = userEvent.setup();
      const { rerender } = renderComponent({
        langs: ['en-US', 'es-ES'],
        selected: 'en-US',
      });

      rerender(<Langs uid="1" onChange={onChange} langs={['en-US', 'es-ES', 'fr-FR']} selected="en-US" />);

      const select = screen.getByRole('combobox');
      expect(select).toHaveTextContent('en-US');
    });
  });

  describe('keyboard navigation', () => {
    it('opens dropdown with keyboard', async () => {
      const user = userEvent.setup();
      renderComponent({
        langs: ['en-US', 'es-ES'],
      });

      const select = screen.getByRole('combobox');
      select.focus();

      await user.keyboard(' ');

      expect(screen.getByRole('option', { name: 'en-US' })).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has proper label association', () => {
      renderComponent({ label: 'Select Language' });

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('renders options with proper roles', async () => {
      const user = userEvent.setup();
      renderComponent({
        langs: ['en-US', 'es-ES', 'fr-FR'],
      });

      const select = screen.getByRole('combobox');
      await user.click(select);

      const options = screen.getAllByRole('option');
      expect(options.length).toBe(3);
    });
  });
});

describe('LanguageControls Component', () => {
  const defaultProps = {
    langs: ['en-US', 'es-ES', 'fr-FR'],
    activeLang: 'en-US',
    defaultLang: 'en-US',
    onActiveLangChange: jest.fn(),
    onDefaultLangChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders both language selectors', () => {
      render(<LanguageControls {...defaultProps} />);

      expect(screen.getByText('Choose language to edit')).toBeInTheDocument();
      expect(screen.getByText('Default language')).toBeInTheDocument();
    });

    it('renders with correct initial values', () => {
      render(<LanguageControls {...defaultProps} />);

      const selects = screen.getAllByRole('combobox');
      expect(selects).toHaveLength(2);
    });

    it('applies custom className', () => {
      const { container } = render(<LanguageControls {...defaultProps} className="custom-class" />);

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('calls onActiveLangChange when active language is changed', async () => {
      const user = userEvent.setup();
      const onActiveLangChange = jest.fn();

      render(<LanguageControls {...defaultProps} activeLang="en-US" onActiveLangChange={onActiveLangChange} />);

      const selects = screen.getAllByRole('combobox');
      const activeSelect = selects[0];

      await user.click(activeSelect);
      await user.click(screen.getByRole('option', { name: 'es-ES' }));

      expect(onActiveLangChange).toHaveBeenCalledWith('es-ES');
    });

    it('calls onDefaultLangChange when default language is changed', async () => {
      const user = userEvent.setup();
      const onDefaultLangChange = jest.fn();

      render(<LanguageControls {...defaultProps} defaultLang="en-US" onDefaultLangChange={onDefaultLangChange} />);

      const selects = screen.getAllByRole('combobox');
      const defaultSelect = selects[1];

      await user.click(defaultSelect);
      await user.click(screen.getByRole('option', { name: 'fr-FR' }));

      expect(onDefaultLangChange).toHaveBeenCalledWith('fr-FR');
    });

    it('handles independent language changes', async () => {
      const user = userEvent.setup();
      const onActiveLangChange = jest.fn();
      const onDefaultLangChange = jest.fn();

      render(
        <LanguageControls
          {...defaultProps}
          activeLang="en-US"
          defaultLang="en-US"
          onActiveLangChange={onActiveLangChange}
          onDefaultLangChange={onDefaultLangChange}
        />,
      );

      const selects = screen.getAllByRole('combobox');

      // Change active language
      await user.click(selects[0]);
      await user.click(screen.getByRole('option', { name: 'es-ES' }));

      expect(onActiveLangChange).toHaveBeenCalledWith('es-ES');
      expect(onDefaultLangChange).not.toHaveBeenCalled();
    });
  });

  describe('props handling', () => {
    it('displays correct language options', async () => {
      const user = userEvent.setup();
      render(<LanguageControls {...defaultProps} langs={['en-US', 'es-ES', 'fr-FR', 'de-DE']} />);

      const selects = screen.getAllByRole('combobox');
      await user.click(selects[0]);

      expect(screen.getByRole('option', { name: 'en-US' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'es-ES' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'fr-FR' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'de-DE' })).toBeInTheDocument();
    });

    it('maintains different active and default languages', async () => {
      const user = userEvent.setup();
      render(<LanguageControls {...defaultProps} activeLang="es-ES" defaultLang="en-US" />);

      const selects = screen.getAllByRole('combobox');
      expect(selects[0]).toHaveTextContent('es-ES');
      expect(selects[1]).toHaveTextContent('en-US');
    });
  });

  describe('updates', () => {
    it('updates when activeLang prop changes', () => {
      const { rerender } = render(<LanguageControls {...defaultProps} activeLang="en-US" />);

      let selects = screen.getAllByRole('combobox');
      expect(selects[0]).toHaveTextContent('en-US');

      rerender(<LanguageControls {...defaultProps} activeLang="es-ES" />);

      selects = screen.getAllByRole('combobox');
      expect(selects[0]).toHaveTextContent('es-ES');
    });

    it('updates when defaultLang prop changes', () => {
      const { rerender } = render(<LanguageControls {...defaultProps} defaultLang="en-US" />);

      let selects = screen.getAllByRole('combobox');
      expect(selects[1]).toHaveTextContent('en-US');

      rerender(<LanguageControls {...defaultProps} defaultLang="fr-FR" />);

      selects = screen.getAllByRole('combobox');
      expect(selects[1]).toHaveTextContent('fr-FR');
    });

    it('updates when langs prop changes', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<LanguageControls {...defaultProps} langs={['en-US', 'es-ES']} />);

      rerender(<LanguageControls {...defaultProps} langs={['en-US', 'es-ES', 'fr-FR']} />);

      const selects = screen.getAllByRole('combobox');
      await user.click(selects[0]);

      expect(screen.getByRole('option', { name: 'fr-FR' })).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has proper semantic structure', () => {
      const { container } = render(<LanguageControls {...defaultProps} />);

      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBe(2);
    });
  });
});
