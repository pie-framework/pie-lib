import { Controls } from '../controls';
import React from 'react';
import { render, screen } from '@testing-library/react';

describe('controls', () => {
  const defaultProps = {
    classes: { button: 'button' },
    onClear: jest.fn(),
    onWords: jest.fn(),
    onSentences: jest.fn(),
    onParagraphs: jest.fn(),
    setCorrectMode: false,
    onToggleCorrectMode: jest.fn(),
  };

  describe('rendering', () => {
    it('renders with all controls', () => {
      const { container } = render(<Controls {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders in setCorrectMode', () => {
      const { container } = render(<Controls {...defaultProps} setCorrectMode={true} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
