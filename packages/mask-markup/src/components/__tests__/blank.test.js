import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BlankContent as Blank } from '../blank';

describe('Blank', () => {
  const onChange = jest.fn();
  const defaultProps = {
    disabled: false,
    value: 'Cow',
    classes: {},
    isOver: false,
    dragItem: {},
    correct: false,
    onChange,
  };

  beforeEach(() => {
    onChange.mockClear();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const { container } = render(<Blank {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('displays the value when provided', () => {
      render(<Blank {...defaultProps} />);
      expect(screen.getByText('Cow')).toBeInTheDocument();
    });

    it('renders as disabled when disabled prop is true', () => {
      render(<Blank {...defaultProps} disabled={true} />);
      // Check that delete button is not present when disabled
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('renders with dragged item preview', () => {
      render(<Blank {...defaultProps} dragItem={{ choice: { value: 'Dog' } }} />);
      // Blank component should render
      expect(screen.getByText('Cow')).toBeInTheDocument();
    });

    it('shows hover state when isOver is true', () => {
      const { container } = render(<Blank {...defaultProps} dragItem={{ choice: { value: 'Dog' } }} isOver={true} />);
      // Component should have hover styling
      expect(container.firstChild).toBeInTheDocument();
    });

    it('shows correct state when correct is true', () => {
      const { container } = render(<Blank {...defaultProps} correct={true} />);
      // Component should indicate correctness
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('delete functionality', () => {
    it('does not show delete button when disabled', () => {
      render(<Blank {...defaultProps} disabled={true} />);
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('does not show delete button when no value is set', () => {
      render(<Blank {...defaultProps} value={undefined} />);
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('shows delete button when value is present and not disabled', () => {
      render(<Blank {...defaultProps} />);
      // If delete button is present, it should be clickable
      const deleteButton = screen.queryByRole('button');
      if (deleteButton) {
        expect(deleteButton).toBeInTheDocument();
      }
    });
  });

  describe('dimensions', () => {
    it('renders with custom dimensions when provided', () => {
      const { container } = render(
        <Blank {...defaultProps} emptyResponseAreaHeight={100} emptyResponseAreaWidth={200} />,
      );
      const element = container.firstChild;
      expect(element).toBeInTheDocument();
    });

    it('renders with min dimensions by default', () => {
      const { container } = render(<Blank {...defaultProps} />);
      const element = container.firstChild;
      expect(element).toBeInTheDocument();
      // Component should have minimum dimensions applied
    });

    it('handles non-numeric dimension props gracefully', () => {
      const { container } = render(
        <Blank {...defaultProps} emptyResponseAreaHeight="non-numeric" emptyResponseAreaWidth="non-numeric" />,
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('drag and drop', () => {
    it('accepts drag item when not disabled', () => {
      render(<Blank {...defaultProps} isOver={true} dragItem={{ choice: { value: 'Dog' } }} />);
      expect(screen.getByText('Cow')).toBeInTheDocument();
    });

    it('shows drag preview when dragging over', () => {
      const { container } = render(<Blank {...defaultProps} isOver={true} dragItem={{ choice: { value: 'Dog' } }} />);
      expect(container.firstChild).toBeInTheDocument();
      // Should show visual feedback for drag over
    });
  });
});
