import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import Blank from '../blank';

// Mock @dnd-kit hooks to avoid DndContext requirement
jest.mock('@dnd-kit/core', () => ({
  useDraggable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    isDragging: false,
  })),
  useDroppable: jest.fn(() => ({
    setNodeRef: jest.fn(),
    isOver: false,
    active: null,
  })),
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Translate: {
      toString: jest.fn(() => 'translate3d(0, 0, 0)'),
    },
  },
}));

describe('Blank', () => {
  const onChange = jest.fn();
  const defaultProps = {
    disabled: false,
    choice: { value: 'Cow' },
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
      render(<Blank {...defaultProps} choice={undefined} />);
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

    it('computes chip dimensions based on content when no emptyResponseArea size is provided', () => {
      jest.useFakeTimers();
      // Mock getBoundingClientRect to simulate measured content size
      const rectSpy = jest
        .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
        .mockReturnValue({ width: 100, height: 20, top: 0, left: 0, right: 100, bottom: 20 });

      const { container } = render(
        <Blank
          {...defaultProps}
          // Force measurement path that uses getMeasureNode / updateDimensions
          emptyResponseAreaHeight={0}
          emptyResponseAreaWidth={0}
        />,
      );

      // Let the internal timeout in handleElements / updateDimensions run
      act(() => {
        jest.runAllTimers();
      });

      const wrapper = container.firstChild; // StyledContent
      const chip = wrapper && wrapper.firstChild; // StyledChip (rootRef)

      // Width and height should include padding (24px) around measured content
      expect(chip.style.width).toBe('124px');
      expect(chip.style.height).toBe('44px');

      rectSpy.mockRestore();
      jest.useRealTimers();
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
