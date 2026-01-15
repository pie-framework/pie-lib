import React from 'react';
import { renderWithTheme, screen } from '@pie-lib/test-utils';
import { DroppablePlaceholder } from '../droppable-placeholder';

jest.mock('../placeholder', () => {
  return function PlaceHolder({ children, disabled, isOver, choiceBoard, className, isVerticalPool, minHeight }) {
    return (
      <div
        data-testid="placeholder"
        data-disabled={disabled}
        data-is-over={isOver}
        data-choice-board={choiceBoard}
        data-is-vertical-pool={isVerticalPool}
        data-min-height={minHeight}
        className={className?.root}
      >
        {children}
      </div>
    );
  };
});

// Mock @dnd-kit/core
jest.mock('@dnd-kit/core', () => ({
  useDroppable: jest.fn(() => ({
    setNodeRef: jest.fn(),
    isOver: false,
  })),
}));

const { useDroppable } = require('@dnd-kit/core');

describe('DroppablePlaceholder', () => {
  const defaultProps = {
    id: 'droppable-1',
    children: <div data-testid="child-content">Child Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render children correctly', () => {
      renderWithTheme(<DroppablePlaceholder {...defaultProps} />);
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('should render PlaceHolder component', () => {
      renderWithTheme(<DroppablePlaceholder {...defaultProps} />);
      expect(screen.getByTestId('placeholder')).toBeInTheDocument();
    });

    it('should render with string children', () => {
      renderWithTheme(
        <DroppablePlaceholder id="drop-1">
          Simple text content
        </DroppablePlaceholder>
      );
      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });

    it('should render with multiple children', () => {
      renderWithTheme(
        <DroppablePlaceholder id="drop-1">
          <span data-testid="child-1">First</span>
          <span data-testid="child-2">Second</span>
        </DroppablePlaceholder>
      );
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should wrap content in a div with flex style', () => {
      const { container } = renderWithTheme(<DroppablePlaceholder {...defaultProps} />);
      const wrapper = container.querySelector('[style*="flex"]');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('useDroppable integration', () => {
    it('should call useDroppable with correct id', () => {
      renderWithTheme(<DroppablePlaceholder {...defaultProps} />);
      expect(useDroppable).toHaveBeenCalledWith({
        id: 'droppable-1',
        disabled: undefined,
      });
    });

    it('should call useDroppable with numeric id', () => {
      renderWithTheme(<DroppablePlaceholder id={123}>Content</DroppablePlaceholder>);
      expect(useDroppable).toHaveBeenCalledWith({
        id: 123,
        disabled: undefined,
      });
    });

    it('should pass disabled prop to useDroppable', () => {
      renderWithTheme(<DroppablePlaceholder {...defaultProps} disabled={true} />);
      expect(useDroppable).toHaveBeenCalledWith({
        id: 'droppable-1',
        disabled: true,
      });
    });

    it('should pass disabled false to useDroppable', () => {
      renderWithTheme(<DroppablePlaceholder {...defaultProps} disabled={false} />);
      expect(useDroppable).toHaveBeenCalledWith({
        id: 'droppable-1',
        disabled: false,
      });
    });
  });

  describe('PlaceHolder props', () => {
    it('should pass disabled prop to PlaceHolder', () => {
      renderWithTheme(<DroppablePlaceholder {...defaultProps} disabled={true} />);
      const placeholder = screen.getByTestId('placeholder');
      expect(placeholder).toHaveAttribute('data-disabled', 'true');
    });

    it('should always set choiceBoard to true', () => {
      renderWithTheme(<DroppablePlaceholder {...defaultProps} />);
      const placeholder = screen.getByTestId('placeholder');
      expect(placeholder).toHaveAttribute('data-choice-board', 'true');
    });

    it('should pass classes prop to PlaceHolder', () => {
      const classes = { root: 'custom-class' };
      renderWithTheme(<DroppablePlaceholder {...defaultProps} classes={classes} />);
      const placeholder = screen.getByTestId('placeholder');
      expect(placeholder).toHaveClass('custom-class');
    });

    it('should pass isVerticalPool prop to PlaceHolder', () => {
      renderWithTheme(<DroppablePlaceholder {...defaultProps} isVerticalPool={true} />);
      const placeholder = screen.getByTestId('placeholder');
      expect(placeholder).toHaveAttribute('data-is-vertical-pool', 'true');
    });

    it('should pass minHeight prop to PlaceHolder', () => {
      renderWithTheme(<DroppablePlaceholder {...defaultProps} minHeight={200} />);
      const placeholder = screen.getByTestId('placeholder');
      expect(placeholder).toHaveAttribute('data-min-height', '200');
    });

    it('should pass all props together to PlaceHolder', () => {
      const classes = { root: 'test-class' };
      renderWithTheme(
        <DroppablePlaceholder
          id="drop-1"
          disabled={true}
          classes={classes}
          isVerticalPool={true}
          minHeight={150}
        >
          Content
        </DroppablePlaceholder>
      );
      
      const placeholder = screen.getByTestId('placeholder');
      expect(placeholder).toHaveAttribute('data-disabled', 'true');
      expect(placeholder).toHaveAttribute('data-is-vertical-pool', 'true');
      expect(placeholder).toHaveAttribute('data-min-height', '150');
      expect(placeholder).toHaveClass('test-class');
    });
  });

  describe('isOver state', () => {
    it('should pass isOver to PlaceHolder when hovering', () => {
      useDroppable.mockReturnValue({
        setNodeRef: jest.fn(),
        isOver: true,
      });

      renderWithTheme(<DroppablePlaceholder {...defaultProps} />);
      const placeholder = screen.getByTestId('placeholder');
      expect(placeholder).toHaveAttribute('data-is-over', 'true');
    });

    it('should pass isOver false when not hovering', () => {
      useDroppable.mockReturnValue({
        setNodeRef: jest.fn(),
        isOver: false,
      });

      renderWithTheme(<DroppablePlaceholder {...defaultProps} />);
      const placeholder = screen.getByTestId('placeholder');
      expect(placeholder).toHaveAttribute('data-is-over', 'false');
    });
  });

  describe('edge cases', () => {
    it('should handle null children', () => {
      renderWithTheme(<DroppablePlaceholder id="drop-1">{null}</DroppablePlaceholder>);
      expect(screen.getByTestId('placeholder')).toBeInTheDocument();
    });

    it('should handle undefined disabled prop', () => {
      renderWithTheme(<DroppablePlaceholder {...defaultProps} disabled={undefined} />);
      expect(useDroppable).toHaveBeenCalledWith({
        id: 'droppable-1',
        disabled: undefined,
      });
    });

    it('should handle undefined classes prop', () => {
      renderWithTheme(<DroppablePlaceholder {...defaultProps} classes={undefined} />);
      const placeholder = screen.getByTestId('placeholder');
      expect(placeholder).toBeInTheDocument();
    });

    it('should handle all optional props as undefined', () => {
      renderWithTheme(
        <DroppablePlaceholder id="drop-1">
          Content
        </DroppablePlaceholder>
      );
      
      const placeholder = screen.getByTestId('placeholder');
      expect(placeholder).toBeInTheDocument();
      expect(placeholder).toHaveAttribute('data-choice-board', 'true');
    });

    it('should handle minHeight of 0', () => {
      renderWithTheme(<DroppablePlaceholder {...defaultProps} minHeight={0} />);
      const placeholder = screen.getByTestId('placeholder');
      expect(placeholder).toHaveAttribute('data-min-height', '0');
    });

    it('should handle very large minHeight', () => {
      renderWithTheme(<DroppablePlaceholder {...defaultProps} minHeight={9999} />);
      const placeholder = screen.getByTestId('placeholder');
      expect(placeholder).toHaveAttribute('data-min-height', '9999');
    });
  });

  describe('different id types', () => {
    it('should work with string id', () => {
      renderWithTheme(<DroppablePlaceholder id="string-id">Content</DroppablePlaceholder>);
      expect(useDroppable).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'string-id' })
      );
    });

    it('should work with numeric id', () => {
      renderWithTheme(<DroppablePlaceholder id={456}>Content</DroppablePlaceholder>);
      expect(useDroppable).toHaveBeenCalledWith(
        expect.objectContaining({ id: 456 })
      );
    });

    it('should work with complex string id', () => {
      renderWithTheme(<DroppablePlaceholder id="category-1-item-5">Content</DroppablePlaceholder>);
      expect(useDroppable).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'category-1-item-5' })
      );
    });
  });
});
