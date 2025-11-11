import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HtmlAndMath from '../html-and-math';

describe('html-and-math', () => {
  describe('rendering', () => {
    it('renders with html content', () => {
      const { container } = render(<HtmlAndMath html="<p>hi</p>" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders paragraph with text', () => {
      render(<HtmlAndMath html="<p>hi</p>" />);
      expect(screen.getByText('hi')).toBeInTheDocument();
    });

    it('renders with math markup', () => {
      const { container } = render(<HtmlAndMath html="<p>2 + 2 = <math><mn>4</mn></math></p>" />);
      // Math may be rendered but transformed by the math rendering library
      // Just check that the text content is present
      expect(screen.getByText(/2 \+ 2 =/)).toBeInTheDocument();
    });

    it('renders with empty html', () => {
      const { container } = render(<HtmlAndMath html="" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with complex html structure', () => {
      const html = '<div><h1>Title</h1><p>Content</p></div>';
      render(<HtmlAndMath html={html} />);
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});
