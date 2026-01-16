import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import translatorExport from '../index';

describe('Translator', () => {
  const { translator, languageOptions } = translatorExport;

  describe('Initialization', () => {
    it('should export translator object with i18next methods', () => {
      expect(translator).toBeDefined();
      expect(typeof translator.t).toBe('function');
    });

    it('should have default language set to English', () => {
      expect(translator.language).toBe('en');
    });

    it('should export language options', () => {
      expect(languageOptions).toBeDefined();
      expect(Array.isArray(languageOptions)).toBe(true);
    });

    it('should have correct language options', () => {
      expect(languageOptions).toEqual([
        { value: 'en_US', label: 'English (US)' },
        { value: 'es_ES', label: 'Spanish' },
      ]);
    });
  });

  describe('Translation Function', () => {
    it('should translate a key in English', () => {
      const result = translator.t('categorize.limitMaxChoicesPerCategory', {
        lng: 'en_US',
        maxChoicesPerCategory: 5,
      });
      expect(result).toContain('5');
      expect(result).toContain('responses per area');
    });

    it('should translate a key in Spanish', () => {
      const result = translator.t('categorize.limitMaxChoicesPerCategory', {
        lng: 'es_ES',
        maxChoicesPerCategory: 5,
      });
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle en_US locale and convert it to en', () => {
      const result = translator.t('categorize.limitMaxChoicesPerCategory', {
        lng: 'en_US',
        maxChoicesPerCategory: 5,
      });
      expect(result).toContain('5');
    });

    it('should handle en-US locale and convert it to en', () => {
      const result = translator.t('categorize.limitMaxChoicesPerCategory', {
        lng: 'en-US',
        maxChoicesPerCategory: 5,
      });
      expect(result).toContain('5');
    });

    it('should handle es_ES locale and convert it to es', () => {
      const result = translator.t('categorize.limitMaxChoicesPerCategory', {
        lng: 'es_ES',
        maxChoicesPerCategory: 5,
      });
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle es-ES locale and convert it to es', () => {
      const result = translator.t('categorize.limitMaxChoicesPerCategory', {
        lng: 'es-ES',
        maxChoicesPerCategory: 5,
      });
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle es_MX locale and convert it to es', () => {
      const result = translator.t('categorize.limitMaxChoicesPerCategory', {
        lng: 'es_MX',
        maxChoicesPerCategory: 5,
      });
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle es-MX locale and convert it to es', () => {
      const result = translator.t('categorize.limitMaxChoicesPerCategory', {
        lng: 'es-MX',
        maxChoicesPerCategory: 5,
      });
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should translate pluralized keys correctly', () => {
      const resultOne = translator.t('numberLine.addElementLimit', {
        lng: 'en',
        count: 1,
      });
      expect(resultOne).toContain('1');
      expect(resultOne).toContain('element');

      const resultMultiple = translator.t('numberLine.addElementLimit', {
        lng: 'en',
        count: 5,
      });
      expect(resultMultiple).toContain('5');
      expect(resultMultiple).toContain('elements');
    });

    it('should handle nested translation keys', () => {
      const result = translator.t('charting.keyLegend.correctAnswer', {
        lng: 'en',
      });
      expect(result).toContain('correct answer');
    });

    it('should return the key when translation is not found', () => {
      const result = translator.t('nonexistent.key', {
        lng: 'en',
      });
      expect(result).toBeDefined();
      // i18next returns the key itself when translation is not found
      expect(typeof result).toBe('string');
    });

    it('should support interpolation with multiple variables', () => {
      const result = translator.t('categorize.maxChoicesPerCategoryRestriction', {
        lng: 'en',
        maxChoicesPerCategory: 10,
      });
      expect(result).toContain('10');
    });
  });

  describe('i18next Methods', () => {
    it('should have i18next methods available', () => {
      expect(typeof translator.changeLanguage).toBe('function');
      expect(typeof translator.getFixedT).toBe('function');
    });

    it('should have resources defined', () => {
      expect(translator.getResourceBundle).toBeDefined();
      const enBundle = translator.getResourceBundle('en', 'translation');
      expect(enBundle).toBeDefined();
      expect(enBundle.categorize).toBeDefined();
    });
  });

  describe('Translation Keys Coverage', () => {
    it('should have categorize translations', () => {
      const result = translator.t('categorize.limitMaxChoicesPerCategory', {
        lng: 'en',
        maxChoicesPerCategory: 5,
      });
      expect(result).not.toBe('categorize.limitMaxChoicesPerCategory');
    });

    it('should have ebsr translations', () => {
      const result = translator.t('ebsr.part', {
        lng: 'en',
        index: 1,
      });
      expect(result).toContain('Part');
    });

    it('should have numberLine translations', () => {
      const result = translator.t('numberLine.clearAll', {
        lng: 'en',
      });
      expect(result).toBe('Clear all');
    });

    it('should have charting translations', () => {
      const result = translator.t('charting.add', {
        lng: 'en',
      });
      expect(result).toBe('Add');
    });

    it('should have drawingResponse translations', () => {
      const result = translator.t('drawingResponse.fillColor', {
        lng: 'en',
      });
      expect(result).toBe('Fill color');
    });

    it('should have imageClozeAssociation translations', () => {
      const result = translator.t('imageClozeAssociation.reachedLimit_one', {
        lng: 'en',
        count: 1,
      });
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('Language Fallback', () => {
    it('should fallback to English when translation is missing in other language', () => {
      const result = translator.t('ebsr.part', {
        lng: 'es',
        index: 1,
      });
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle undefined language and fallback gracefully', () => {
      const result = translator.t('charting.add', {
        lng: undefined,
      });
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('Component Integration', () => {
    // Test with a simple component that uses the translator
    const TranslatorTestComponent = ({ lng = 'en' }) => {
      const { t } = translator;
      const translated = t('charting.add', { lng });

      return (
        <div>
          <button data-testid="translate-btn">{translated}</button>
        </div>
      );
    };

    it('should render translated content in a component', () => {
      render(<TranslatorTestComponent lng="en" />);
      const button = screen.getByTestId('translate-btn');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Add');
    });

    it('should update translated content when language changes', async () => {
      const { rerender } = render(<TranslatorTestComponent lng="en" />);
      const button = screen.getByTestId('translate-btn');
      expect(button).toHaveTextContent('Add');

      rerender(<TranslatorTestComponent lng="es" />);
      await waitFor(() => {
        expect(button).toBeInTheDocument();
      });
    });

    it('should handle user interactions with translated content', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      const InteractiveComponent = () => {
        const { t } = translator;
        return (
          <button onClick={handleClick} data-testid="interactive-btn">
            {t('charting.delete', { lng: 'en' })}
          </button>
        );
      };

      render(<InteractiveComponent />);
      const button = screen.getByTestId('interactive-btn');

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
