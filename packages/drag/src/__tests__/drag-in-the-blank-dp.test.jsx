import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '@pie-lib/test-utils';
import { DragInTheBlankDroppable } from '../drag-in-the-blank-dp';
import { DragProvider } from '../drag-provider';

jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }) => <div data-testid="dnd-context">{children}</div>,
  PointerSensor: jest.fn(),
  KeyboardSensor: jest.fn(),
  useSensor: jest.fn((sensor) => sensor),
  useSensors: jest.fn((...sensors) => sensors),
  useDroppable: jest.fn(() => ({
    setNodeRef: jest.fn(),
    isOver: false,
  })),
}));

describe('DragInTheBlankDroppable', () => {
  const defaultProps = {
    id: 'test-droppable-1',
    instanceId: 'instance-1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders without children', () => {
      const { container } = renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps} />
        </DragProvider>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with children', () => {
      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps}>
            <div data-testid="child-element">Droppable Content</div>
          </DragInTheBlankDroppable>
        </DragProvider>
      );
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
      expect(screen.getByText('Droppable Content')).toBeInTheDocument();
    });

    it('renders with multiple children', () => {
      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps}>
            <div data-testid="child-1">Child 1</div>
            <div data-testid="child-2">Child 2</div>
            <div data-testid="child-3">Child 3</div>
          </DragInTheBlankDroppable>
        </DragProvider>
      );
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('renders with custom classes', () => {
      const customClasses = 'custom-class another-class';
      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps} classes={customClasses}>
            <div>Content</div>
          </DragInTheBlankDroppable>
        </DragProvider>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders with disabled state', () => {
      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps} disabled={true}>
            <div data-testid="content">Content</div>
          </DragInTheBlankDroppable>
        </DragProvider>
      );
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  describe('droppable configuration', () => {
    it('renders with vertical pool layout', () => {
      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps} isVerticalPool={true}>
            <div>Content</div>
          </DragInTheBlankDroppable>
        </DragProvider>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders with horizontal pool layout', () => {
      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps} isVerticalPool={false}>
            <div>Content</div>
          </DragInTheBlankDroppable>
        </DragProvider>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders with custom minHeight', () => {
      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps} minHeight={200}>
            <div>Content</div>
          </DragInTheBlankDroppable>
        </DragProvider>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('uses default minHeight when not specified', () => {
      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps}>
            <div>Content</div>
          </DragInTheBlankDroppable>
        </DragProvider>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('droppable data', () => {
    it('configures useDroppable with correct id', () => {
      const { useDroppable } = require('@dnd-kit/core');
      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps} />
        </DragProvider>
      );
      
      expect(useDroppable).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'drag-in-the-blank-droppable',
        })
      );
    });

    it('configures useDroppable with MaskBlank type', () => {
      const { useDroppable } = require('@dnd-kit/core');
      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps} />
        </DragProvider>
      );
      
      expect(useDroppable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: 'MaskBlank',
            accepts: ['MaskBlank'],
          })
        })
      );
    });

    it('includes instanceId in droppable data', () => {
      const { useDroppable } = require('@dnd-kit/core');
      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps} instanceId="custom-instance" />
        </DragProvider>
      );
      
      expect(useDroppable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            instanceId: 'custom-instance',
          })
        })
      );
    });

    it('includes toChoiceBoard flag in droppable data', () => {
      const { useDroppable } = require('@dnd-kit/core');
      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps} />
        </DragProvider>
      );
      
      expect(useDroppable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            toChoiceBoard: true,
          })
        })
      );
    });
  });

  describe('isOver state', () => {
    it('handles isOver=false state', () => {
      const { useDroppable } = require('@dnd-kit/core');
      useDroppable.mockReturnValue({
        setNodeRef: jest.fn(),
        isOver: false,
      });

      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps}>
            <div>Content</div>
          </DragInTheBlankDroppable>
        </DragProvider>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('handles isOver=true state', () => {
      const { useDroppable } = require('@dnd-kit/core');
      useDroppable.mockReturnValue({
        setNodeRef: jest.fn(),
        isOver: true,
      });

      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps}>
            <div>Content</div>
          </DragInTheBlankDroppable>
        </DragProvider>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('id prop variations', () => {
    it('accepts string id', () => {
      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable id="string-id" instanceId="instance-1">
            <div>Content</div>
          </DragInTheBlankDroppable>
        </DragProvider>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('accepts number id', () => {
      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable id={123} instanceId="instance-1">
            <div>Content</div>
          </DragInTheBlankDroppable>
        </DragProvider>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('renders without instanceId', () => {
      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable id="test-1">
            <div>Content</div>
          </DragInTheBlankDroppable>
        </DragProvider>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('handles null children', () => {
      const { container } = renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps}>
            {null}
          </DragInTheBlankDroppable>
        </DragProvider>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles empty string id', () => {
      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable id="" instanceId="instance-1">
            <div>Content</div>
          </DragInTheBlankDroppable>
        </DragProvider>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies DroppablePlaceholderContainer with minHeight', () => {
      const { container } = renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps}>
            <div>Content</div>
          </DragInTheBlankDroppable>
        </DragProvider>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with custom minHeight in extraStyles', () => {
      renderWithTheme(
        <DragProvider>
          <DragInTheBlankDroppable {...defaultProps} minHeight={150}>
            <div>Content</div>
          </DragInTheBlankDroppable>
        </DragProvider>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});
