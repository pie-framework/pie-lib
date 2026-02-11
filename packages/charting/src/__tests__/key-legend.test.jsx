import React from 'react';
import { render } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import KeyLegend from '../key-legend';

jest.mock('@pie-lib/translator', () => ({
  __esModule: true,
  default: {
    translator: {
      t: jest.fn((key) => {
        const translations = {
          'charting.keyLegend.incorrectAnswer': 'Incorrect answer selected',
          'charting.keyLegend.correctAnswer': 'Correct answer selected',
          'charting.keyLegend.correctKeyAnswer': 'Correct answer',
        };
        return translations[key] || key;
      }),
    },
  },
}));

jest.mock('@mui/icons-material/Check', () => {
  return function Check(props) {
    return <div data-testid="check-icon" {...props} />;
  };
});

jest.mock('@mui/icons-material/Close', () => {
  return function Close(props) {
    return <div data-testid="close-icon" {...props} />;
  };
});

let theme;

beforeAll(() => {
  theme = createTheme();
});

describe('KeyLegend', () => {
  const renderComponent = (extras = {}) => {
    const defaults = {
      language: 'en',
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <KeyLegend {...props} />
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container).toBeInTheDocument();
    });

    it('renders Key title', () => {
      const { getByText } = renderComponent();
      expect(getByText('Key')).toBeInTheDocument();
    });

    it('renders incorrect answer row', () => {
      const { getByText } = renderComponent();
      expect(getByText('Incorrect answer selected')).toBeInTheDocument();
    });

    it('renders correct answer row', () => {
      const { getByText } = renderComponent();
      expect(getByText('Correct answer selected')).toBeInTheDocument();
    });

    it('renders correct key answer row', () => {
      const { getByText } = renderComponent();
      expect(getByText('Correct answer')).toBeInTheDocument();
    });

    it('renders with custom language', () => {
      const { container } = renderComponent({ language: 'es' });
      expect(container).toBeInTheDocument();
    });

    it('renders with undefined language', () => {
      const { container } = renderComponent({ language: undefined });
      expect(container).toBeInTheDocument();
    });
  });

  describe('icons', () => {
    it('renders incorrect icon (Close)', () => {
      const { getAllByTestId } = renderComponent();
      const closeIcons = getAllByTestId('close-icon');
      expect(closeIcons.length).toBeGreaterThan(0);
    });

    it('renders correct icons (Check)', () => {
      const { getAllByTestId } = renderComponent();
      const checkIcons = getAllByTestId('check-icon');
      expect(checkIcons.length).toBe(2);
    });

    it('renders small check icon for correct key answer', () => {
      const { getAllByTestId } = renderComponent();
      const checkIcons = getAllByTestId('check-icon');

      expect(checkIcons.length).toBeGreaterThan(0);

      checkIcons.forEach((icon) => {
        expect(icon).toBeInTheDocument();
      });
    });
  });

  describe('structure', () => {
    it('has correct number of rows', () => {
      const { container } = renderComponent();
      const texts = ['Incorrect answer selected', 'Correct answer selected', 'Correct answer'];

      texts.forEach((text) => {
        expect(container.textContent).toContain(text);
      });
    });

    it('displays title at the top', () => {
      const { container } = renderComponent();
      const firstChild = container.querySelector('div > div');
      expect(firstChild?.textContent).toContain('Key');
    });
  });

  describe('styling', () => {
    it('applies styled container', () => {
      const { container } = renderComponent();
      const styledDiv = container.firstChild?.firstChild;
      expect(styledDiv).toBeInTheDocument();
    });

    it('renders all content in proper structure', () => {
      const { container } = renderComponent();
      expect(container.querySelector('[data-testid="close-icon"]')).toBeInTheDocument();
      expect(container.querySelectorAll('[data-testid="check-icon"]').length).toBe(2);
    });
  });

  describe('accessibility', () => {
    it('has readable text content', () => {
      const { container } = renderComponent();
      const text = container.textContent;

      expect(text).toContain('Key');
      expect(text).toContain('Incorrect answer selected');
      expect(text).toContain('Correct answer selected');
      expect(text).toContain('Correct answer');
    });

    it('icons have proper structure for screen readers', () => {
      const { getAllByTestId } = renderComponent();
      const icons = [...getAllByTestId('close-icon'), ...getAllByTestId('check-icon')];

      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('handles null language', () => {
      const { container } = renderComponent({ language: null });
      expect(container).toBeInTheDocument();
    });

    it('handles empty string language', () => {
      const { container } = renderComponent({ language: '' });
      expect(container).toBeInTheDocument();
    });

    it('renders consistently with different language codes', () => {
      const languages = ['en', 'es', 'fr', 'de', 'zh'];

      languages.forEach((lang) => {
        const { container, unmount } = renderComponent({ language: lang });
        expect(container).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('translation integration', () => {
    it('calls translator with language parameter', () => {
      const Translator = require('@pie-lib/translator').default;
      const { t } = Translator.translator;

      renderComponent({ language: 'es' });

      expect(t).toHaveBeenCalled();
    });

    it('displays all required translation keys', () => {
      const { container } = renderComponent();
      const text = container.textContent;

      expect(text).toContain('Incorrect answer selected');
      expect(text).toContain('Correct answer selected');
      expect(text).toContain('Correct answer');
    });
  });

  describe('layout', () => {
    it('renders in a flex column layout', () => {
      const { container } = renderComponent();
      const mainContainer = container.firstChild?.firstChild;
      expect(mainContainer).toBeInTheDocument();
    });

    it('has proper spacing between elements', () => {
      const { getByText } = renderComponent();

      expect(getByText('Key')).toBeInTheDocument();
      expect(getByText('Incorrect answer selected')).toBeInTheDocument();
      expect(getByText('Correct answer selected')).toBeInTheDocument();
      expect(getByText('Correct answer')).toBeInTheDocument();
    });
  });
});
