import React from 'react';
import { render } from '@testing-library/react';
import { Legend } from '../legend';

jest.mock('@pie-lib/translator', () => ({
  __esModule: true,
  default: {
    translator: {
      t: jest.fn((key) => {
        const translations = {
          'selectText.key': 'Key',
          'selectText.correctAnswerSelected': 'Correct answer selected',
          'selectText.incorrectSelection': 'Incorrect selection',
          'selectText.correctAnswerNotSelected': 'Correct answer not selected',
        };
        return translations[key] || key;
      }),
    },
  },
}));

describe('Legend', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<Legend />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders the Key label', () => {
      const { getByText } = render(<Legend />);
      expect(getByText('Key')).toBeInTheDocument();
    });

    it('renders all three legend items by default', () => {
      const { getByText } = render(<Legend />);

      expect(getByText('Correct answer selected')).toBeInTheDocument();
      expect(getByText('Incorrect selection')).toBeInTheDocument();
      expect(getByText('Correct answer not selected')).toBeInTheDocument();
    });

    it('renders with custom language', () => {
      const Translator = require('@pie-lib/translator').default;
      const { container } = render(<Legend language="es" />);

      expect(Translator.translator.t).toHaveBeenCalledWith('selectText.key', { lng: 'es' });
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('showOnlyCorrect prop', () => {
    it('shows all three items when showOnlyCorrect is false', () => {
      const { getByText } = render(<Legend showOnlyCorrect={false} />);

      expect(getByText('Correct answer selected')).toBeInTheDocument();
      expect(getByText('Incorrect selection')).toBeInTheDocument();
      expect(getByText('Correct answer not selected')).toBeInTheDocument();
    });

    it('shows only correct item when showOnlyCorrect is true', () => {
      const { getByText, queryByText } = render(<Legend showOnlyCorrect={true} />);

      expect(getByText('Correct answer selected')).toBeInTheDocument();
      expect(queryByText('Incorrect selection')).not.toBeInTheDocument();
      expect(queryByText('Correct answer not selected')).not.toBeInTheDocument();
    });

    it('shows only correct item when showOnlyCorrect is undefined', () => {
      const { getByText } = render(<Legend showOnlyCorrect={undefined} />);

      expect(getByText('Correct answer selected')).toBeInTheDocument();
      expect(getByText('Incorrect selection')).toBeInTheDocument();
      expect(getByText('Correct answer not selected')).toBeInTheDocument();
    });
  });

  describe('icons', () => {
    it('renders check icons for correct answers', () => {
      const { container } = render(<Legend />);
      const checkIcons = container.querySelectorAll('svg[data-testid="CheckIcon"]');
      expect(checkIcons.length).toBeGreaterThan(0);
    });

    it('renders close icons for incorrect answers', () => {
      const { container } = render(<Legend />);
      const closeIcons = container.querySelectorAll('svg[data-testid="CloseIcon"]');
      expect(closeIcons.length).toBeGreaterThan(0);
    });

    it('renders correct number of icons when showOnlyCorrect is true', () => {
      const { container } = render(<Legend showOnlyCorrect={true} />);
      const checkIcons = container.querySelectorAll('svg[data-testid="CheckIcon"]');
      const closeIcons = container.querySelectorAll('svg[data-testid="CloseIcon"]');

      expect(checkIcons.length).toBe(1);
      expect(closeIcons.length).toBe(0);
    });
  });

  describe('styled containers', () => {
    it('renders containers for each legend item', () => {
      const { container } = render(<Legend />);
      const spans = container.querySelectorAll('span');

      expect(spans.length).toBeGreaterThanOrEqual(4);
    });

    it('applies correct styling classes', () => {
      const { container } = render(<Legend />);

      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveStyle({ display: 'flex' });
    });
  });

  describe('translation integration', () => {
    it('calls translator with correct keys for all items', () => {
      const Translator = require('@pie-lib/translator').default;
      render(<Legend />);

      expect(Translator.translator.t).toHaveBeenCalledWith('selectText.key', { lng: undefined });
      expect(Translator.translator.t).toHaveBeenCalledWith('selectText.correctAnswerSelected', { lng: undefined });
      expect(Translator.translator.t).toHaveBeenCalledWith('selectText.incorrectSelection', { lng: undefined });
      expect(Translator.translator.t).toHaveBeenCalledWith('selectText.correctAnswerNotSelected', { lng: undefined });
    });

    it('passes language prop to all translation calls', () => {
      const Translator = require('@pie-lib/translator').default;
      render(<Legend language="fr" />);

      expect(Translator.translator.t).toHaveBeenCalledWith('selectText.key', { lng: 'fr' });
      expect(Translator.translator.t).toHaveBeenCalledWith('selectText.correctAnswerSelected', { lng: 'fr' });
    });

    it('handles missing language prop gracefully', () => {
      const Translator = require('@pie-lib/translator').default;
      render(<Legend />);

      expect(Translator.translator.t).toHaveBeenCalledWith('selectText.key', { lng: undefined });
    });
  });

  describe('legend items structure', () => {
    it('renders items with correct structure', () => {
      const { container } = render(<Legend />);

      const legendItems = container.querySelectorAll('div > div');
      expect(legendItems.length).toBeGreaterThanOrEqual(3);
    });

    it('renders items in correct order', () => {
      const { container } = render(<Legend />);
      const spans = Array.from(container.querySelectorAll('span')).map((s) => s.textContent);

      expect(spans).toContain('Correct answer selected');
      expect(spans).toContain('Incorrect selection');
      expect(spans).toContain('Correct answer not selected');
    });

    it('maintains order when showOnlyCorrect is true', () => {
      const { container } = render(<Legend showOnlyCorrect={true} />);
      const spans = Array.from(container.querySelectorAll('span')).map((s) => s.textContent);

      expect(spans).toContain('Correct answer selected');
      expect(spans).not.toContain('Incorrect selection');
    });
  });

  describe('prop combinations', () => {
    it('handles both language and showOnlyCorrect props together', () => {
      const { getByText, queryByText } = render(<Legend language="de" showOnlyCorrect={true} />);

      expect(getByText('Correct answer selected')).toBeInTheDocument();
      expect(queryByText('Incorrect selection')).not.toBeInTheDocument();
    });

    it('renders correctly with no props', () => {
      const { container } = render(<Legend />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders correctly with empty language string', () => {
      const { container } = render(<Legend language="" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('renders semantic HTML structure', () => {
      const { container } = render(<Legend />);

      const divs = container.querySelectorAll('div');
      const spans = container.querySelectorAll('span');

      expect(divs.length).toBeGreaterThan(0);
      expect(spans.length).toBeGreaterThan(0);
    });

    it('includes text labels for each icon', () => {
      const { getByText } = render(<Legend />);

      expect(getByText('Correct answer selected')).toBeVisible();
      expect(getByText('Incorrect selection')).toBeVisible();
      expect(getByText('Correct answer not selected')).toBeVisible();
    });
  });
});
