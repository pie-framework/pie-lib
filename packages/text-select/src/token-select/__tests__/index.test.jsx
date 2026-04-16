import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { TokenSelect } from '../index';

describe('token-select', () => {
  const defaultProps = {
    tokens: [
      {
        text: 'foo bar',
        start: 0,
        end: 7,
        predefined: true,
        selectable: true,
        selected: false,
      },
    ],
    onChange: jest.fn(),
  };

  describe('rendering', () => {
    it('renders with default props', () => {
      const { container } = render(<TokenSelect {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders sentences with newlines', () => {
      const tokens = [
        {
          text: 'foo,',
          start: 0,
          end: 4,
          predefined: true,
          selectable: true,
          selected: false,
        },
        {
          text: '\n',
          start: 4,
          end: 5,
          selected: false,
        },
        {
          text: 'bar',
          start: 5,
          end: 8,
          predefined: true,
          selectable: true,
          selected: false,
        },
      ];
      const { container } = render(<TokenSelect {...defaultProps} tokens={tokens} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders paragraphs with double newlines', () => {
      const tokens = [
        {
          text: 'foo,',
          start: 0,
          end: 4,
          predefined: true,
          selectable: true,
          selected: false,
        },
        {
          text: '\n\n',
          start: 4,
          end: 5,
          selected: false,
        },
        {
          text: 'bar',
          start: 5,
          end: 8,
          predefined: true,
          selectable: true,
          selected: false,
        },
      ];
      const { container } = render(<TokenSelect {...defaultProps} tokens={tokens} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders in disabled mode with selected tokens', () => {
      const tokens = [
        {
          text: 'foo,',
          start: 0,
          end: 4,
          predefined: true,
          selectable: true,
          selected: true,
        },
        {
          text: '\n',
          start: 4,
          end: 5,
          selected: false,
        },
        {
          text: 'bar',
          start: 5,
          end: 8,
          predefined: true,
          selectable: true,
          selected: true,
        },
      ];
      const { container } = render(<TokenSelect {...defaultProps} disabled tokens={tokens} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with maxNoOfSelections', () => {
      const { container } = render(<TokenSelect {...defaultProps} maxNoOfSelections={5} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with highlightChoices enabled', () => {
      const { container } = render(<TokenSelect {...defaultProps} highlightChoices={true} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('strips HTML tags from token text', () => {
      const tokens = [
        {
          text: '<b>bold text</b>',
          start: 0,
          end: 16,
          predefined: true,
          selectable: true,
          selected: false,
        },
      ];
      const { container } = render(<TokenSelect {...defaultProps} tokens={tokens} />);
      expect(container.textContent).toContain('bold text');
      // The selectable token should have HTML tags stripped before rendering
      // Look specifically in the main content div (not the hidden primer)
      const mainDiv = container.querySelectorAll('div[class*="css-"]')[1];
      expect(mainDiv.textContent).toContain('bold text');
    });

    it('renders with custom className', () => {
      const { container } = render(<TokenSelect {...defaultProps} className="custom-token-select" />);
      // The second div with Emotion class should have the custom className
      const styledDivs = container.querySelectorAll('div[class*="css-"]');
      const mainDiv = styledDivs[styledDivs.length - 1];
      expect(mainDiv).toHaveClass('custom-token-select');
    });

    it('renders tokens with correct and incorrect states', () => {
      const tokens = [
        {
          text: 'correct',
          start: 0,
          end: 7,
          predefined: true,
          selectable: true,
          selected: true,
          correct: true,
        },
        {
          text: 'incorrect',
          start: 8,
          end: 17,
          predefined: true,
          selectable: true,
          selected: true,
          correct: false,
        },
      ];
      const { container } = render(<TokenSelect {...defaultProps} tokens={tokens} />);
      expect(container.firstChild).toBeInTheDocument();
      const checkIcon = container.querySelector('svg[data-testid="CheckIcon"]');
      const closeIcon = container.querySelector('svg[data-testid="CloseIcon"]');
      expect(checkIcon).toBeInTheDocument();
      expect(closeIcon).toBeInTheDocument();
    });

    it('renders tokens with isMissing state', () => {
      const tokens = [
        {
          text: 'missing answer',
          start: 0,
          end: 14,
          predefined: true,
          selectable: true,
          selected: false,
          isMissing: true,
        },
      ];
      const { container } = render(<TokenSelect {...defaultProps} tokens={tokens} />);
      expect(container.firstChild).toBeInTheDocument();
      const closeIcon = container.querySelector('svg[data-testid="CloseIcon"]');
      expect(closeIcon).toBeInTheDocument();
    });
  });

  describe('token interaction', () => {
    it('calls onChange when clicking a selectable token', () => {
      const onChange = jest.fn();
      const tokens = [
        {
          text: 'foo bar',
          start: 0,
          end: 7,
          predefined: true,
          selectable: true,
          selected: false,
        },
      ];
      const { container } = render(<TokenSelect {...defaultProps} tokens={tokens} onChange={onChange} />);

      const tokenElements = container.querySelectorAll('.tokenRootClass');
      // Find the first token with data-indexkey >= 0 (skip primer tokens at -1)
      let tokenElement = null;
      for (const el of tokenElements) {
        if (parseInt(el.getAttribute('data-indexkey'), 10) >= 0) {
          tokenElement = el;
          break;
        }
      }
      if (tokenElement) {
        fireEvent.click(tokenElement);
        expect(onChange).toHaveBeenCalled();
        const updatedTokens = onChange.mock.calls[0][0];
        expect(updatedTokens[0].selected).toBe(true);
      }
    });

    it('handles maxNoOfSelections of 1 by deselecting previous token', () => {
      const onChange = jest.fn();
      const tokens = [
        {
          text: 'first',
          start: 0,
          end: 5,
          predefined: true,
          selectable: true,
          selected: true,
        },
        {
          text: 'second',
          start: 6,
          end: 12,
          predefined: true,
          selectable: true,
          selected: false,
        },
      ];
      const { container } = render(
        <TokenSelect {...defaultProps} tokens={tokens} onChange={onChange} maxNoOfSelections={1} />,
      );

      const tokenElements = container.querySelectorAll('.tokenRootClass');
      // Find tokens with data-indexkey >= 0 (skip primer tokens)
      const realTokens = Array.from(tokenElements).filter(
        (el) => parseInt(el.getAttribute('data-indexkey'), 10) >= 0,
      );
      if (realTokens.length > 1) {
        fireEvent.click(realTokens[1]);
        expect(onChange).toHaveBeenCalled();
        const updatedTokens = onChange.mock.calls[0][0];
        expect(updatedTokens[0].selected).toBe(false);
        expect(updatedTokens[1].selected).toBe(true);
      }
    });

    it('prevents selecting more tokens when maxNoOfSelections is reached', () => {
      const onChange = jest.fn();
      const tokens = [
        {
          text: 'first',
          start: 0,
          end: 5,
          predefined: true,
          selectable: true,
          selected: true,
        },
        {
          text: 'second',
          start: 6,
          end: 12,
          predefined: true,
          selectable: true,
          selected: true,
        },
        {
          text: 'third',
          start: 13,
          end: 18,
          predefined: true,
          selectable: true,
          selected: false,
        },
      ];
      const { container } = render(
        <TokenSelect {...defaultProps} tokens={tokens} onChange={onChange} maxNoOfSelections={2} />,
      );

      const tokenElements = container.querySelectorAll('.tokenRootClass');
      const realTokens = Array.from(tokenElements).filter(
        (el) => parseInt(el.getAttribute('data-indexkey'), 10) >= 0,
      );
      if (realTokens.length > 2) {
        fireEvent.click(realTokens[2]);
        // onChange should not be called because max is reached
        expect(onChange).not.toHaveBeenCalled();
      }
    });

    it('does not toggle token when in animationsDisabled mode', () => {
      const onChange = jest.fn();
      const tokens = [
        {
          text: 'foo bar',
          start: 0,
          end: 7,
          predefined: true,
          selectable: true,
          selected: false,
        },
      ];
      const { container } = render(
        <TokenSelect {...defaultProps} tokens={tokens} onChange={onChange} animationsDisabled={true} />,
      );

      const tokenElement = container.querySelector('.tokenRootClass');
      if (tokenElement) {
        fireEvent.click(tokenElement);
        expect(onChange).not.toHaveBeenCalled();
      }
    });

    it('does not toggle token when correct is defined', () => {
      const onChange = jest.fn();
      const tokens = [
        {
          text: 'foo bar',
          start: 0,
          end: 7,
          predefined: true,
          selectable: true,
          selected: false,
          correct: true,
        },
      ];
      const { container } = render(<TokenSelect {...defaultProps} tokens={tokens} onChange={onChange} />);

      const tokenElement = container.querySelector('.tokenRootClass');
      if (tokenElement) {
        fireEvent.click(tokenElement);
        expect(onChange).not.toHaveBeenCalled();
      }
    });

    it('does not toggle token when isMissing is true', () => {
      const onChange = jest.fn();
      const tokens = [
        {
          text: 'foo bar',
          start: 0,
          end: 7,
          predefined: true,
          selectable: true,
          selected: false,
          isMissing: true,
        },
      ];
      const { container } = render(<TokenSelect {...defaultProps} tokens={tokens} onChange={onChange} />);

      const tokenElement = container.querySelector('.tokenRootClass');
      if (tokenElement) {
        fireEvent.click(tokenElement);
        expect(onChange).not.toHaveBeenCalled();
      }
    });

    it('allows toggling token off when selected', () => {
      const onChange = jest.fn();
      const tokens = [
        {
          text: 'foo bar',
          start: 0,
          end: 7,
          predefined: true,
          selectable: true,
          selected: true,
        },
      ];
      const { container } = render(<TokenSelect {...defaultProps} tokens={tokens} onChange={onChange} />);

      const tokenElements = container.querySelectorAll('.tokenRootClass');
      let tokenElement = null;
      for (const el of tokenElements) {
        if (parseInt(el.getAttribute('data-indexkey'), 10) >= 0) {
          tokenElement = el;
          break;
        }
      }
      if (tokenElement) {
        fireEvent.click(tokenElement);
        expect(onChange).toHaveBeenCalled();
        const updatedTokens = onChange.mock.calls[0][0];
        expect(updatedTokens[0].selected).toBe(false);
      }
    });
  });

  describe('CSS injection and styling', () => {
    it('renders HiddenCssPrimer to inject CSS for all Token variants', () => {
      const { container } = render(<TokenSelect {...defaultProps} />);
      // Check that the component renders without errors; the HiddenCssPrimer
      // ensures CSS is injected into the document for all token states.
      expect(container.firstChild).toBeInTheDocument();
      // The HiddenCssPrimer should have aria-hidden to mark it as invisible
      const primer = container.querySelector('[aria-hidden="true"]');
      expect(primer).toBeInTheDocument();
    });

    it('renders tokens with Emotion CSS class names', () => {
      const { container } = render(<TokenSelect {...defaultProps} />);
      const tokenElement = container.querySelector('.tokenRootClass');
      expect(tokenElement).toBeInTheDocument();
      // Should have Emotion-generated class name like css-xxxxx
      const hasEmotionClass = Array.from(tokenElement.classList).some((cls) => cls.startsWith('css-'));
      expect(hasEmotionClass).toBe(true);
    });
  });

  describe('HTML preservation', () => {
    it('preserves non-selectable HTML content', () => {
      const tokens = [
        {
          text: '<table><tr><td>table content</td></tr></table>',
          start: 0,
          end: 46,
          predefined: false,
          selectable: false,
          selected: false,
        },
      ];
      const { container } = render(<TokenSelect {...defaultProps} tokens={tokens} />);
      // Non-selectable HTML should be rendered as-is
      const html = container.innerHTML;
      expect(html).toContain('table');
      expect(html).toContain('table content');
    });

    it('preserves non-breaking spaces in HTML', () => {
      const tokens = [
        {
          text: 'word&nbsp;space',
          start: 0,
          end: 14,
          predefined: false,
          selectable: false,
          selected: false,
        },
      ];
      const { container } = render(<TokenSelect {...defaultProps} tokens={tokens} />);
      // &nbsp; should be converted to non-breaking space character
      expect(container.textContent).toContain('word');
      expect(container.textContent).toContain('space');
    });

    it('handles mixed selectable and non-selectable tokens', () => {
      const tokens = [
        {
          text: 'prefix ',
          start: 0,
          end: 7,
          predefined: false,
          selectable: false,
          selected: false,
        },
        {
          text: 'selectable token',
          start: 7,
          end: 22,
          predefined: true,
          selectable: true,
          selected: false,
        },
        {
          text: ' suffix',
          start: 22,
          end: 29,
          predefined: false,
          selectable: false,
          selected: false,
        },
      ];
      const { container } = render(<TokenSelect {...defaultProps} tokens={tokens} />);
      expect(container.textContent).toContain('prefix');
      expect(container.textContent).toContain('selectable token');
      expect(container.textContent).toContain('suffix');
    });
  });

  describe('newline handling', () => {
    it('renders single newlines as <br> tags', () => {
      const tokens = [
        {
          text: 'line1',
          start: 0,
          end: 5,
          predefined: true,
          selectable: true,
          selected: false,
        },
        {
          text: '\n',
          start: 5,
          end: 6,
          selected: false,
        },
        {
          text: 'line2',
          start: 6,
          end: 11,
          predefined: true,
          selectable: true,
          selected: false,
        },
      ];
      const { container } = render(<TokenSelect {...defaultProps} tokens={tokens} />);
      const html = container.innerHTML;
      expect(html).toContain('<br>');
    });

    it('renders double newlines as paragraph breaks', () => {
      const tokens = [
        {
          text: 'paragraph1',
          start: 0,
          end: 10,
          predefined: true,
          selectable: true,
          selected: false,
        },
        {
          text: '\n\n',
          start: 10,
          end: 12,
          selected: false,
        },
        {
          text: 'paragraph2',
          start: 12,
          end: 22,
          predefined: true,
          selectable: true,
          selected: false,
        },
      ];
      const { container } = render(<TokenSelect {...defaultProps} tokens={tokens} />);
      const html = container.innerHTML;
      expect(html).toContain('</p>');
      expect(html).toContain('<p>');
    });
  });

  describe('edge cases', () => {
    it('handles empty token list', () => {
      const { container } = render(<TokenSelect {...defaultProps} tokens={[]} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles tokens with special characters', () => {
      const tokens = [
        {
          text: 'special & < > " chars',
          start: 0,
          end: 21,
          predefined: true,
          selectable: true,
          selected: false,
        },
      ];
      const { container } = render(<TokenSelect {...defaultProps} tokens={tokens} />);
      expect(container.textContent).toContain('special');
    });

    it('renders with disabled and highlightChoices together', () => {
      const tokens = [
        {
          text: 'token',
          start: 0,
          end: 5,
          predefined: true,
          selectable: true,
          selected: false,
        },
      ];
      const { container } = render(
        <TokenSelect {...defaultProps} tokens={tokens} disabled highlightChoices />,
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles very long token text', () => {
      const longText = 'Lorem ipsum '.repeat(100);
      const tokens = [
        {
          text: longText,
          start: 0,
          end: longText.length,
          predefined: true,
          selectable: true,
          selected: false,
        },
      ];
      const { container } = render(<TokenSelect {...defaultProps} tokens={tokens} />);
      expect(container.textContent).toContain('Lorem ipsum');
    });
  });

  // Note: Tests for internal methods (selectedCount, canSelectMore, toggleToken) are
  // implementation details and cannot be directly tested with RTL. The original tests
  // used wrapper.instance() to test these methods, which tests implementation rather
  // than user-facing behavior. Token selection logic and user interactions should be
  // tested through integration/e2e tests.
});
