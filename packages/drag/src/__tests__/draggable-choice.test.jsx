import React from 'react';
import { renderWithTheme, screen } from '@pie-lib/test-utils';
import { DraggableChoice, DRAG_TYPE } from '../draggable-choice';

jest.mock('@dnd-kit/core', () => ({
  useDraggable: jest.fn(() => ({
    attributes: { 'data-testid': 'draggable-attributes' },
    listeners: { onPointerDown: jest.fn() },
    setNodeRef: jest.fn(),
    isDragging: false,
  })),
}));

const { useDraggable } = require('@dnd-kit/core');

describe('DraggableChoice', () => {
  const defaultChoice = {
    id: 'choice-1',
    value: 'Test Choice',
  };

  const defaultProps = {
    choice: defaultChoice,
    children: <div data-testid="child-content">Choice Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render children correctly', () => {
      renderWithTheme(<DraggableChoice {...defaultProps} />);
      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Choice Content')).toBeInTheDocument();
    });

    it('should render with string children', () => {
      renderWithTheme(
        <DraggableChoice choice={defaultChoice}>
          Simple text content
        </DraggableChoice>
      );
      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });

    it('should render with multiple children', () => {
      renderWithTheme(
        <DraggableChoice choice={defaultChoice}>
          <span data-testid="child-1">First</span>
          <span data-testid="child-2">Second</span>
        </DraggableChoice>
      );
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = renderWithTheme(
        <DraggableChoice {...defaultProps} className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });
  });

  describe('useDraggable integration', () => {
    it('should call useDraggable with correct id from choice', () => {
      renderWithTheme(<DraggableChoice {...defaultProps} />);
      expect(useDraggable).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'choice-1',
        })
      );
    });

    it('should use custom id prop over choice.id when provided', () => {
      renderWithTheme(<DraggableChoice {...defaultProps} id="custom-id" />);
      expect(useDraggable).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'custom-id',
        })
      );
    });

    it('should pass disabled prop to useDraggable', () => {
      renderWithTheme(<DraggableChoice {...defaultProps} disabled={true} />);
      expect(useDraggable).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: true,
        })
      );
    });

    it('should pass categoryId when category is provided', () => {
      const category = { id: 'category-1' };
      renderWithTheme(<DraggableChoice {...defaultProps} category={category} />);
      expect(useDraggable).toHaveBeenCalledWith(
        expect.objectContaining({
          categoryId: 'category-1',
        })
      );
    });

    it('should pass alternateResponseIndex to useDraggable', () => {
      renderWithTheme(<DraggableChoice {...defaultProps} alternateResponseIndex={2} />);
      expect(useDraggable).toHaveBeenCalledWith(
        expect.objectContaining({
          alternateResponseIndex: 2,
        })
      );
    });
  });

  describe('data prop in useDraggable', () => {
    it('should include choice data in useDraggable data prop', () => {
      renderWithTheme(<DraggableChoice {...defaultProps} />);
      expect(useDraggable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            id: 'choice-1',
            value: 'Test Choice',
            choiceId: 'choice-1',
          }),
        })
      );
    });

    it('should include category data when provided', () => {
      const category = { id: 'category-1' };
      renderWithTheme(<DraggableChoice {...defaultProps} category={category} />);
      expect(useDraggable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            from: 'category-1',
            categoryId: 'category-1',
          }),
        })
      );
    });

    it('should include alternateResponseIndex in data', () => {
      renderWithTheme(<DraggableChoice {...defaultProps} alternateResponseIndex={3} />);
      expect(useDraggable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            alternateResponseIndex: 3,
          }),
        })
      );
    });

    it('should include choiceIndex in data', () => {
      renderWithTheme(<DraggableChoice {...defaultProps} choiceIndex={5} />);
      expect(useDraggable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            choiceIndex: 5,
          }),
        })
      );
    });

    it('should include onRemoveChoice callback in data', () => {
      const onRemoveChoice = jest.fn();
      renderWithTheme(<DraggableChoice {...defaultProps} onRemoveChoice={onRemoveChoice} />);
      expect(useDraggable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            onRemoveChoice,
          }),
        })
      );
    });

    it('should include type in data', () => {
      renderWithTheme(<DraggableChoice {...defaultProps} type="custom-type" />);
      expect(useDraggable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: 'custom-type',
          }),
        })
      );
    });
  });

  describe('choice variations', () => {
    it('should handle numeric choice id', () => {
      const choice = { id: 123, value: 'Numeric ID' };
      renderWithTheme(<DraggableChoice choice={choice}>Content</DraggableChoice>);
      expect(useDraggable).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 123,
          data: expect.objectContaining({
            id: 123,
            choiceId: 123,
          }),
        })
      );
    });

    it('should handle choice with various value types', () => {
      const choice = { id: 'choice-1', value: { complex: 'object' } };
      renderWithTheme(<DraggableChoice choice={choice}>Content</DraggableChoice>);
      expect(useDraggable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            value: { complex: 'object' },
          }),
        })
      );
    });

    it('should handle choice without value', () => {
      const choice = { id: 'choice-1' };
      renderWithTheme(<DraggableChoice choice={choice}>Content</DraggableChoice>);
      expect(useDraggable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            id: 'choice-1',
          }),
        })
      );
    });
  });

  describe('edge cases', () => {
    it('should handle null children', () => {
      renderWithTheme(<DraggableChoice choice={defaultChoice}>{null}</DraggableChoice>);
      expect(useDraggable).toHaveBeenCalled();
    });

    it('should handle undefined category', () => {
      renderWithTheme(<DraggableChoice {...defaultProps} category={undefined} />);
      expect(useDraggable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            from: undefined,
            categoryId: undefined,
          }),
        })
      );
    });
  });

  describe('DRAG_TYPE constant', () => {
    it('should export DRAG_TYPE constant', () => {
      expect(DRAG_TYPE).toBe('CHOICE');
    });
  });

  describe('attributes and listeners', () => {
    it('should apply draggable attributes to the element', () => {
      useDraggable.mockReturnValue({
        attributes: { role: 'button', tabIndex: 0 },
        listeners: { onPointerDown: jest.fn() },
        setNodeRef: jest.fn(),
        isDragging: false,
      });

      const { container } = renderWithTheme(<DraggableChoice {...defaultProps} />);
      const element = container.querySelector('[role="button"]');
      expect(element).toBeInTheDocument();
    });

    it('should apply draggable listeners to the element', () => {
      const mockListener = jest.fn();
      useDraggable.mockReturnValue({
        attributes: {},
        listeners: { onPointerDown: mockListener },
        setNodeRef: jest.fn(),
        isDragging: false,
      });

      renderWithTheme(<DraggableChoice {...defaultProps} />);
      expect(useDraggable).toHaveBeenCalled();
    });
  });
});
