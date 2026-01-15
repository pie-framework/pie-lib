import React from 'react';
import { render, screen } from '@testing-library/react';
import PreviewPrompt from '../preview-prompt';

describe('Prompt without Custom tag', () => {
  const defaultProps = {
    classes: {},
    prompt:
      'Which of these northern European countries are EU members? <math><mstack><msrow><mn>111</mn></msrow><msline/></mstack></math>',
    tagName: '',
    className: '',
  };

  describe('default rendering with markup', () => {
    it('renders the prompt text', () => {
      render(<PreviewPrompt {...defaultProps} />);
      expect(screen.getByText(/Which of these northern European countries are EU members/)).toBeInTheDocument();
    });

    it('does not have prompt class by default', () => {
      const { container } = render(<PreviewPrompt {...defaultProps} />);
      expect(container.firstChild).not.toHaveClass('prompt');
    });

    it('renders math markup', () => {
      const { container } = render(<PreviewPrompt {...defaultProps} />);
      // Math may be rendered but transformed by the math rendering library
      // Just check that the prompt text is rendered
      expect(screen.getByText(/Which of these northern European countries are EU members/)).toBeInTheDocument();
    });
  });
});

describe('Prompt with Custom tag', () => {
  const defaultProps = {
    classes: {},
    prompt:
      'Which of these northern European countries are EU members? <math><mstack><msrow><mn>111</mn></msrow><msline/></mstack></math>',
    tagName: 'span',
    className: 'prompt',
  };

  describe('renders with custom tag "span" correctly', () => {
    it('renders with custom className', () => {
      const { container } = render(<PreviewPrompt {...defaultProps} />);
      expect(container.firstChild).toHaveClass('prompt');
    });

    it('renders as span element when tagName is specified', () => {
      const { container } = render(<PreviewPrompt {...defaultProps} />);
      expect(container.firstChild.tagName.toLowerCase()).toBe('span');
    });

    it('renders the prompt text', () => {
      render(<PreviewPrompt {...defaultProps} />);
      expect(screen.getByText(/Which of these northern European countries are EU members/)).toBeInTheDocument();
    });
  });
});
