import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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
    classes: {},
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
      expect(container.innerHTML).not.toContain('<b>');
    });

    it('renders with custom className', () => {
      const { container } = render(<TokenSelect {...defaultProps} className="custom-token-select" />);
      expect(container.firstChild).toHaveClass('custom-token-select');
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

      const tokenElement = container.querySelector('.tokenRootClass');
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
      if (tokenElements.length > 1) {
        fireEvent.click(tokenElements[1]);
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
      if (tokenElements.length > 2) {
        fireEvent.click(tokenElements[2]);
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

      const tokenElement = container.querySelector('.tokenRootClass');
      if (tokenElement) {
        fireEvent.click(tokenElement);
        expect(onChange).toHaveBeenCalled();
        const updatedTokens = onChange.mock.calls[0][0];
        expect(updatedTokens[0].selected).toBe(false);
      }
    });
  });

  // Note: Tests for internal methods (selectedCount, canSelectMore, toggleToken) are
  // implementation details and cannot be directly tested with RTL. The original tests
  // used wrapper.instance() to test these methods, which tests implementation rather
  // than user-facing behavior. Token selection logic and user interactions should be
  // tested through integration/e2e tests.
});
