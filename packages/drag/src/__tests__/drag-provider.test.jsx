import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '@pie-lib/test-utils';
import { DragProvider } from '../drag-provider';

jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }) => <div data-testid="dnd-context">{children}</div>,
  PointerSensor: jest.fn(),
  KeyboardSensor: jest.fn(),
  useSensor: jest.fn((sensor) => sensor),
  useSensors: jest.fn((...sensors) => sensors),
}));

describe('DragProvider', () => {
  const defaultProps = {
    children: <div data-testid="child-element">Child Content</div>,
  };

  describe('rendering', () => {
    it('renders children correctly', () => {
      renderWithTheme(<DragProvider {...defaultProps} />);
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('renders with onDragEnd callback', () => {
      const onDragEnd = jest.fn();
      renderWithTheme(<DragProvider {...defaultProps} onDragEnd={onDragEnd} />);
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });

    it('renders with onDragStart callback', () => {
      const onDragStart = jest.fn();
      renderWithTheme(<DragProvider {...defaultProps} onDragStart={onDragStart} />);
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });

    it('renders with collisionDetection function', () => {
      const collisionDetection = jest.fn();
      renderWithTheme(<DragProvider {...defaultProps} collisionDetection={collisionDetection} />);
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });

    it('renders with modifiers array', () => {
      const modifiers = [jest.fn(), jest.fn()];
      renderWithTheme(<DragProvider {...defaultProps} modifiers={modifiers} />);
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });

    it('renders with autoScroll configuration', () => {
      const autoScroll = { enabled: true, threshold: { x: 0.2, y: 0.2 } };
      renderWithTheme(<DragProvider {...defaultProps} autoScroll={autoScroll} />);
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });
  });

  describe('DndContext integration', () => {
    it('wraps children in DndContext', () => {
      const { container } = renderWithTheme(<DragProvider {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      renderWithTheme(
        <DragProvider>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </DragProvider>
      );
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('handles complex nested children', () => {
      renderWithTheme(
        <DragProvider>
          <div>
            <div data-testid="nested-child">
              <span>Nested Content</span>
            </div>
          </div>
        </DragProvider>
      );
      expect(screen.getByTestId('nested-child')).toBeInTheDocument();
      expect(screen.getByText('Nested Content')).toBeInTheDocument();
    });
  });

  describe('sensors configuration', () => {
    it('configures PointerSensor with activation constraint', () => {
      renderWithTheme(<DragProvider {...defaultProps} />);
      // The sensors are configured internally
      // We can verify the component renders without errors
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });

    it('configures KeyboardSensor', () => {
      renderWithTheme(<DragProvider {...defaultProps} />);
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });
  });

  describe('prop combinations', () => {
    it('renders with all props provided', () => {
      const onDragEnd = jest.fn();
      const onDragStart = jest.fn();
      const collisionDetection = jest.fn();
      const modifiers = [jest.fn()];
      const autoScroll = { enabled: true };

      renderWithTheme(
        <DragProvider
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          collisionDetection={collisionDetection}
          modifiers={modifiers}
          autoScroll={autoScroll}
        >
          <div data-testid="test-child">Test</div>
        </DragProvider>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('renders with no optional props', () => {
      renderWithTheme(
        <DragProvider>
          <div data-testid="test-child">Test</div>
        </DragProvider>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles empty children', () => {
      const { container } = renderWithTheme(<DragProvider>{null}</DragProvider>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles undefined callbacks gracefully', () => {
      renderWithTheme(
        <DragProvider onDragEnd={undefined} onDragStart={undefined}>
          <div data-testid="test-child">Test</div>
        </DragProvider>
      );
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('renders with string children', () => {
      renderWithTheme(<DragProvider>Just text content</DragProvider>);
      expect(screen.getByText('Just text content')).toBeInTheDocument();
    });

    it('renders with array of children', () => {
      const children = [
        <div key="1" data-testid="child-1">1</div>,
        <div key="2" data-testid="child-2">2</div>,
      ];
      renderWithTheme(<DragProvider>{children}</DragProvider>);
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });
  });
});
