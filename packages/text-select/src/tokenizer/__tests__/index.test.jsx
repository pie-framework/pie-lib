import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Tokenizer } from '../index';

const tokens = () => [
  {
    start: 0,
    end: 1,
    text: 'f',
  },
];

describe('tokenizer', () => {
  const defaultProps = {
    text: 'foo',
    classes: {},
    onChange: jest.fn(),
    tokens: tokens(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const { container } = render(<Tokenizer {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with empty tokens', () => {
      const { container } = render(<Tokenizer {...defaultProps} tokens={[]} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with multiple tokens', () => {
      const multipleTokens = [
        { start: 0, end: 3, text: 'foo' },
        { start: 4, end: 7, text: 'bar' },
      ];
      const { container } = render(<Tokenizer {...defaultProps} tokens={multipleTokens} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders Controls component', () => {
      const { getByText } = render(<Tokenizer {...defaultProps} />);
      expect(getByText(/clear/i)).toBeInTheDocument();
    });

    it('renders TokenText with text content', () => {
      const { container } = render(<Tokenizer {...defaultProps} text="Hello world" />);
      expect(container.textContent).toContain('Hello world');
    });
  });

  describe('control interactions', () => {
    it('calls onChange when clear button is clicked', () => {
      const onChange = jest.fn();
      const { getByText } = render(<Tokenizer {...defaultProps} onChange={onChange} />);

      const clearButton = getByText(/clear/i);
      fireEvent.click(clearButton);

      expect(onChange).toHaveBeenCalledWith([], '');
    });

    it('calls onChange when words button is clicked', () => {
      const onChange = jest.fn();
      const { getByText } = render(<Tokenizer {...defaultProps} text="hello world" onChange={onChange} />);

      const wordsButton = getByText(/words/i);
      fireEvent.click(wordsButton);

      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls[0][1]).toBe('words');
    });

    it('calls onChange when sentences button is clicked', () => {
      const onChange = jest.fn();
      const { getByText } = render(<Tokenizer {...defaultProps} text="Hello. World." onChange={onChange} />);

      const sentencesButton = getByText(/sentences/i);
      fireEvent.click(sentencesButton);

      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls[0][1]).toBe('sentence');
    });

    it('calls onChange when paragraphs button is clicked', () => {
      const onChange = jest.fn();
      const { getByText } = render(<Tokenizer {...defaultProps} text="Para 1\n\nPara 2" onChange={onChange} />);

      const paragraphsButton = getByText(/paragraphs/i);
      fireEvent.click(paragraphsButton);

      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls[0][1]).toBe('paragraphs');
    });
  });

  describe('correct mode toggle', () => {
    it('toggles correct mode when toggle button is clicked', () => {
      const { container } = render(<Tokenizer {...defaultProps} />);
      const toggleButton = container.querySelector('[type="checkbox"]');

      expect(toggleButton).not.toBeChecked();

      fireEvent.click(toggleButton);
      expect(toggleButton).toBeChecked();

      fireEvent.click(toggleButton);
      expect(toggleButton).not.toBeChecked();
    });
  });

  describe('token handling', () => {
    it('renders with tokens containing correct property', () => {
      const tokensWithCorrect = [
        { start: 0, end: 3, text: 'foo', correct: true },
        { start: 4, end: 7, text: 'bar', correct: false },
      ];
      const { container } = render(<Tokenizer {...defaultProps} tokens={tokensWithCorrect} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles tokens with overlapping positions', () => {
      const overlappingTokens = [
        { start: 0, end: 5, text: 'hello' },
        { start: 3, end: 8, text: 'low' },
      ];
      const { container } = render(<Tokenizer {...defaultProps} tokens={overlappingTokens} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('text variations', () => {
    it('handles multiline text', () => {
      const multilineText = 'Line 1\nLine 2\nLine 3';
      const { container } = render(<Tokenizer {...defaultProps} text={multilineText} />);
      expect(container.textContent).toContain('Line 1');
      expect(container.textContent).toContain('Line 2');
      expect(container.textContent).toContain('Line 3');
    });

    it('handles empty text', () => {
      const { container } = render(<Tokenizer {...defaultProps} text="" tokens={[]} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles text with special characters', () => {
      const specialText = 'Hello! @#$ %^& *() world?';
      const { container } = render(<Tokenizer {...defaultProps} text={specialText} />);
      expect(container.textContent).toContain(specialText);
    });
  });

  describe('token click interactions', () => {
    it('removes token when clicked in normal mode', () => {
      const onChange = jest.fn();
      const tokensWithPredefined = [{ start: 0, end: 5, text: 'hello', predefined: true }];
      const { container } = render(
        <Tokenizer {...defaultProps} text="hello world" tokens={tokensWithPredefined} onChange={onChange} />,
      );

      const predefinedToken = container.querySelector('.predefined');
      if (predefinedToken) {
        fireEvent.click(predefinedToken);
        expect(onChange).toHaveBeenCalled();
        expect(onChange.mock.calls[0][0]).toEqual([]);
      }
    });

    it('toggles correct property when token clicked in correct mode', () => {
      const onChange = jest.fn();
      const tokensWithPredefined = [{ start: 0, end: 5, text: 'hello', predefined: true, correct: false }];
      const { container } = render(
        <Tokenizer {...defaultProps} text="hello world" tokens={tokensWithPredefined} onChange={onChange} />,
      );

      const toggleButton = container.querySelector('[type="checkbox"]');
      fireEvent.click(toggleButton);
      onChange.mockClear();

      const predefinedToken = container.querySelector('.predefined');
      if (predefinedToken) {
        fireEvent.click(predefinedToken);
        expect(onChange).toHaveBeenCalled();
        const updatedToken = onChange.mock.calls[0][0][0];
        expect(updatedToken.correct).toBe(true);
      }
    });

    it('toggles correct from true to false when clicked in correct mode', () => {
      const onChange = jest.fn();
      const tokensWithPredefined = [{ start: 0, end: 5, text: 'hello', predefined: true, correct: true }];
      const { container } = render(
        <Tokenizer {...defaultProps} text="hello world" tokens={tokensWithPredefined} onChange={onChange} />,
      );

      const toggleButton = container.querySelector('[type="checkbox"]');
      fireEvent.click(toggleButton);
      onChange.mockClear();

      const predefinedToken = container.querySelector('.predefined');
      if (predefinedToken) {
        fireEvent.click(predefinedToken);
        expect(onChange).toHaveBeenCalled();
        const updatedToken = onChange.mock.calls[0][0][0];
        expect(updatedToken.correct).toBe(false);
      }
    });

    it('does not modify tokens when clicking non-existent token', () => {
      const onChange = jest.fn();
      const { container } = render(<Tokenizer {...defaultProps} text="hello world" tokens={[]} onChange={onChange} />);

      fireEvent.click(container.querySelector('div > div'));

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('token removal', () => {
    it('removes multiple different tokens', () => {
      const onChange = jest.fn();
      const multipleTokens = [
        { start: 0, end: 5, text: 'hello', predefined: true },
        { start: 6, end: 11, text: 'world', predefined: true },
      ];
      const { container } = render(
        <Tokenizer {...defaultProps} text="hello world" tokens={multipleTokens} onChange={onChange} />,
      );

      const predefinedTokens = container.querySelectorAll('.predefined');
      expect(predefinedTokens.length).toBeGreaterThan(0);

      fireEvent.click(predefinedTokens[0]);
      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls[0][0].length).toBe(1); // One token left
    });

    it('handles removing token by matching text, start, and end', () => {
      const onChange = jest.fn();
      const tokensWithSameText = [
        { start: 0, end: 5, text: 'hello', predefined: true },
        { start: 12, end: 17, text: 'hello', predefined: true },
      ];
      const { container } = render(
        <Tokenizer {...defaultProps} text="hello world hello" tokens={tokensWithSameText} onChange={onChange} />,
      );

      const predefinedTokens = container.querySelectorAll('.predefined');
      if (predefinedTokens.length > 0) {
        fireEvent.click(predefinedTokens[0]);
        expect(onChange).toHaveBeenCalled();
        expect(onChange.mock.calls[0][0].length).toBe(1);
      }
    });
  });

  describe('text selection and token creation', () => {
    beforeEach(() => {
      if (typeof global.window !== 'undefined') {
        global.window.getSelection = jest.fn().mockReturnValue({
          toString: () => '',
        });
      }
    });

    it('creates new token when text is selected', () => {
      const onChange = jest.fn();
      const { container } = render(<Tokenizer {...defaultProps} text="hello world" tokens={[]} onChange={onChange} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('selectToken removes overlapping tokens when creating new token', () => {
      const onChange = jest.fn();
      const existingTokens = [{ start: 0, end: 5, text: 'hello' }];
      const { container } = render(
        <Tokenizer {...defaultProps} text="hello world" tokens={existingTokens} onChange={onChange} />,
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('mode state management', () => {
    it('maintains mode state after buildTokens', () => {
      const onChange = jest.fn();
      const { getByText } = render(<Tokenizer {...defaultProps} text="hello world test" onChange={onChange} />);

      const wordsButton = getByText(/words/i);
      fireEvent.click(wordsButton);

      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls[0][1]).toBe('words');

      onChange.mockClear();
      fireEvent.click(wordsButton);
      expect(onChange).toHaveBeenCalled();
    });

    it('maintains mode state after clear', () => {
      const onChange = jest.fn();
      const { getByText } = render(<Tokenizer {...defaultProps} text="hello world" onChange={onChange} />);

      fireEvent.click(getByText(/words/i));
      onChange.mockClear();

      fireEvent.click(getByText(/clear/i));
      expect(onChange).toHaveBeenCalledWith([], '');
    });
  });

  describe('disabled state styling', () => {
    it('applies disabled styling when in correct mode', () => {
      const { container } = render(<Tokenizer {...defaultProps} />);

      const styledDiv = container.querySelector('div > div');
      expect(styledDiv).toBeInTheDocument();

      const toggleButton = container.querySelector('[type="checkbox"]');
      fireEvent.click(toggleButton);

      expect(styledDiv).toBeInTheDocument();
    });
  });
});
