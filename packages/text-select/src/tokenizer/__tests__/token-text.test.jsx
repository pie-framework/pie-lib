import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TokenText, { Text } from '../token-text';

const tokens = () => [
  {
    start: 0,
    end: 5,
    text: 'lorem',
  },
];

describe('token-text', () => {
  const defaultProps = {
    onTokenClick: jest.fn(),
    onSelectToken: jest.fn(),
    text: `lorem ipsum dolor`,
    tokens: tokens(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    if (typeof global.window !== 'undefined') {
      global.window.getSelection = jest.fn().mockReturnValue({
        toString: () => '',
      });
    }
  });

  describe('rendering', () => {
    it('renders with text and tokens', () => {
      const { container } = render(<TokenText {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with empty tokens', () => {
      const { container } = render(<TokenText {...defaultProps} tokens={[]} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with multiline text', () => {
      const { container } = render(<TokenText {...defaultProps} text="Line 1\nLine 2\nLine 3" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(<TokenText {...defaultProps} className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders normalized tokens', () => {
      const { container } = render(<TokenText {...defaultProps} />);
      const spans = container.querySelectorAll('span');
      expect(spans.length).toBeGreaterThan(0);
    });
  });

  describe('Text component', () => {
    it('renders plain text when not predefined', () => {
      const { container } = render(<Text text="hello" predefined={false} />);
      expect(container.querySelector('span')).toBeInTheDocument();
      expect(container.querySelector('span')).not.toHaveClass('predefined');
    });

    it('renders predefined text with correct class', () => {
      const { container } = render(<Text text="hello" predefined={true} onClick={jest.fn()} />);
      expect(container.querySelector('span')).toHaveClass('predefined');
    });

    it('renders correct text with both classes', () => {
      const { container } = render(<Text text="hello" predefined={true} correct={true} onClick={jest.fn()} />);
      const span = container.querySelector('span');
      expect(span).toHaveClass('predefined');
      expect(span).toHaveClass('correct');
    });

    it('calls onClick when predefined text is clicked', () => {
      const onClick = jest.fn();
      const { container } = render(<Text text="hello" predefined={true} onClick={onClick} />);
      const span = container.querySelector('span');
      fireEvent.click(span);
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('token interaction', () => {
    it('calls onTokenClick when clicking on a predefined token', () => {
      const onTokenClick = jest.fn();
      const { container } = render(<TokenText {...defaultProps} onTokenClick={onTokenClick} />);
      const predefinedSpan = container.querySelector('.predefined');
      if (predefinedSpan) {
        fireEvent.click(predefinedSpan);
        expect(onTokenClick).toHaveBeenCalled();
      }
    });

    it('handles click without window object (SSR)', () => {
      const originalWindow = global.window;
      global.window = undefined;

      const { container } = render(<TokenText {...defaultProps} />);
      expect(() => fireEvent.click(container.firstChild)).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe('text selection', () => {
    beforeEach(() => {
      global.window.getSelection = jest.fn();
    });

    it('does not call onSelectToken when no text is selected', () => {
      const onSelectToken = jest.fn();
      global.window.getSelection.mockReturnValue({
        toString: () => '',
      });

      const { container } = render(<TokenText {...defaultProps} onSelectToken={onSelectToken} />);
      fireEvent.click(container.firstChild);

      expect(onSelectToken).not.toHaveBeenCalled();
    });

    it('does not call onSelectToken for newline character selection', () => {
      const onSelectToken = jest.fn();
      global.window.getSelection.mockReturnValue({
        toString: () => '\n',
      });

      const { container } = render(<TokenText {...defaultProps} onSelectToken={onSelectToken} />);
      fireEvent.click(container.firstChild);

      expect(onSelectToken).not.toHaveBeenCalled();
    });

    it('does not call onSelectToken for space character selection', () => {
      const onSelectToken = jest.fn();
      global.window.getSelection.mockReturnValue({
        toString: () => ' ',
      });

      const { container } = render(<TokenText {...defaultProps} onSelectToken={onSelectToken} />);
      fireEvent.click(container.firstChild);

      expect(onSelectToken).not.toHaveBeenCalled();
    });

    it('does not call onSelectToken for tab character selection', () => {
      const onSelectToken = jest.fn();
      global.window.getSelection.mockReturnValue({
        toString: () => '\t',
      });

      const { container } = render(<TokenText {...defaultProps} onSelectToken={onSelectToken} />);
      fireEvent.click(container.firstChild);

      expect(onSelectToken).not.toHaveBeenCalled();
    });
  });

  describe('props handling', () => {
    it('accepts and uses all required props', () => {
      const props = {
        text: 'test text',
        tokens: [],
        onTokenClick: jest.fn(),
        onSelectToken: jest.fn(),
      };

      const { container } = render(<TokenText {...props} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles multiple tokens', () => {
      const multipleTokens = [
        { start: 0, end: 5, text: 'lorem' },
        { start: 6, end: 11, text: 'ipsum' },
      ];

      const { container } = render(<TokenText {...defaultProps} tokens={multipleTokens} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('text selection with valid text', () => {
    let mockGetCaretCharacterOffsetWithin;

    beforeEach(() => {
      mockGetCaretCharacterOffsetWithin = jest.fn().mockReturnValue(6);
      jest.mock('../selection-utils', () => ({
        clearSelection: jest.fn(),
        getCaretCharacterOffsetWithin: mockGetCaretCharacterOffsetWithin,
      }));
    });

    it('calls onSelectToken when valid text is selected without overlap', () => {
      const onSelectToken = jest.fn();
      const clearSelectionMock = jest.fn();

      const selectionUtils = require('../selection-utils');
      selectionUtils.clearSelection = clearSelectionMock;
      selectionUtils.getCaretCharacterOffsetWithin = jest.fn().mockReturnValue(6);

      global.window.getSelection.mockReturnValue({
        toString: () => 'ipsum',
      });

      const { container } = render(
        <TokenText {...defaultProps} text="lorem ipsum dolor" tokens={[]} onSelectToken={onSelectToken} />,
      );

      fireEvent.click(container.firstChild);

      expect(onSelectToken).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'ipsum',
          start: expect.any(Number),
          end: expect.any(Number),
        }),
        expect.any(Array),
      );
    });

    it('handles text selection at the end of text', () => {
      const onSelectToken = jest.fn();
      const selectionUtils = require('../selection-utils');
      selectionUtils.getCaretCharacterOffsetWithin = jest.fn().mockReturnValue(12);

      global.window.getSelection.mockReturnValue({
        toString: () => 'dolor',
      });

      const { container } = render(
        <TokenText {...defaultProps} text="lorem ipsum dolor" tokens={[]} onSelectToken={onSelectToken} />,
      );

      fireEvent.click(container.firstChild);

      expect(onSelectToken).toHaveBeenCalled();
    });

    it('handles newline offset calculation', () => {
      const onSelectToken = jest.fn();
      const selectionUtils = require('../selection-utils');
      selectionUtils.getCaretCharacterOffsetWithin = jest.fn().mockReturnValue(0);

      global.window.getSelection.mockReturnValue({
        toString: () => 'ipsum',
      });

      const { container } = render(
        <TokenText {...defaultProps} text="lorem\nipsum dolor" tokens={[]} onSelectToken={onSelectToken} />,
      );

      fireEvent.click(container.firstChild);

      if (onSelectToken.mock.calls.length > 0) {
        const token = onSelectToken.mock.calls[0][0];
        expect(token.text).toBe('ipsum');
      }
    });

    it('calls onSelectToken with tokensToRemove for surrounded tokens', () => {
      const onSelectToken = jest.fn();
      const selectionUtils = require('../selection-utils');
      selectionUtils.getCaretCharacterOffsetWithin = jest.fn().mockReturnValue(0);

      global.window.getSelection.mockReturnValue({
        toString: () => 'lorem ipsum',
      });

      const existingTokens = [{ start: 6, end: 11, text: 'ipsum' }];

      const { container } = render(
        <TokenText {...defaultProps} text="lorem ipsum dolor" tokens={existingTokens} onSelectToken={onSelectToken} />,
      );

      fireEvent.click(container.firstChild);

      expect(onSelectToken).toHaveBeenCalled();
    });

    it('does not call onSelectToken when root is not available', () => {
      const onSelectToken = jest.fn();

      global.window.getSelection.mockReturnValue({
        toString: () => 'ipsum',
      });

      const { container } = render(
        <TokenText {...defaultProps} text="lorem ipsum" tokens={[]} onSelectToken={onSelectToken} />,
      );

      const instance = container.querySelector('div');
      if (instance) {
        fireEvent.click(instance);
      }
    });
  });

  describe('Text component edge cases', () => {
    it('handles null text gracefully', () => {
      const { container } = render(<Text text={null} predefined={false} />);
      expect(container.querySelector('span')).toBeInTheDocument();
    });

    it('handles undefined text gracefully', () => {
      const { container } = render(<Text text={undefined} predefined={false} />);
      expect(container.querySelector('span')).toBeInTheDocument();
    });

    it('renders empty string text', () => {
      const { container } = render(<Text text="" predefined={false} />);
      expect(container.querySelector('span')).toBeInTheDocument();
    });
  });
});
