import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DragProvider } from '../drag-provider';

jest.mock('@dnd-kit/core', () => ({
  DndContext: ({
    children,
    onDragStart,
    onDragEnd,
    onDragCancel,
    sensors,
    collisionDetection,
    modifiers,
    autoScroll,
    accessibility,
  }) => (
    <div
      data-testid="dnd-context"
      data-has-sensors={!!sensors}
      data-has-collision-detection={!!collisionDetection}
      data-has-modifiers={!!modifiers}
      data-has-auto-scroll={!!autoScroll}
      data-has-accessibility={!!accessibility}
      data-on-drag-start={typeof onDragStart === 'function' ? 'function' : 'undefined'}
      data-on-drag-end={typeof onDragEnd === 'function' ? 'function' : 'undefined'}
      data-on-drag-cancel={typeof onDragCancel === 'function' ? 'function' : 'undefined'}
    >
      {/* Lets tests simulate dnd-kit itself invoking the handler DragProvider built. */}
      <button data-testid="simulate-drag-cancel" onClick={() => onDragCancel?.({ active: { id: 'x' } })} />
      {children}
    </div>
  ),
  PointerSensor: 'PointerSensor',
  KeyboardSensor: 'KeyboardSensor',
  useSensor: jest.fn((sensor, config) => ({ sensor, config })),
  useSensors: jest.fn((...sensors) => sensors),
}));

describe('DragProvider', () => {
  const defaultProps = {
    children: <div data-testid="test-child">Test Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render children correctly', () => {
      render(<DragProvider {...defaultProps} />);
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <DragProvider>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </DragProvider>,
      );
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should wrap children in DndContext', () => {
      render(<DragProvider {...defaultProps} />);
      const dndContext = screen.getByTestId('dnd-context');
      expect(dndContext).toBeInTheDocument();
      expect(dndContext).toContainElement(screen.getByTestId('test-child'));
    });

    it('should render with complex children', () => {
      render(
        <DragProvider>
          <div>
            <span data-testid="nested">Nested</span>
            <ul>
              <li data-testid="list-item">Item</li>
            </ul>
          </div>
        </DragProvider>,
      );
      expect(screen.getByTestId('nested')).toBeInTheDocument();
      expect(screen.getByTestId('list-item')).toBeInTheDocument();
    });
  });

  describe('DndContext props', () => {
    it('should pass sensors to DndContext', () => {
      render(<DragProvider {...defaultProps} />);
      const dndContext = screen.getByTestId('dnd-context');
      expect(dndContext).toHaveAttribute('data-has-sensors', 'true');
    });

    it('should pass onDragStart handler to DndContext', () => {
      const onDragStart = jest.fn();
      render(<DragProvider {...defaultProps} onDragStart={onDragStart} />);
      const dndContext = screen.getByTestId('dnd-context');
      expect(dndContext).toHaveAttribute('data-on-drag-start', 'function');
    });

    it('should pass onDragEnd handler to DndContext', () => {
      const onDragEnd = jest.fn();
      render(<DragProvider {...defaultProps} onDragEnd={onDragEnd} />);
      const dndContext = screen.getByTestId('dnd-context');
      expect(dndContext).toHaveAttribute('data-on-drag-end', 'function');
    });

    it('should always pass an onDragCancel handler to DndContext, even without one of its own', () => {
      render(<DragProvider {...defaultProps} />);
      const dndContext = screen.getByTestId('dnd-context');
      expect(dndContext).toHaveAttribute('data-on-drag-cancel', 'function');
    });

    it('invokes the given onDragCancel when dnd-kit cancels a drag', () => {
      const onDragCancel = jest.fn();
      render(<DragProvider {...defaultProps} onDragCancel={onDragCancel} />);

      fireEvent.click(screen.getByTestId('simulate-drag-cancel'));

      expect(onDragCancel).toHaveBeenCalledWith({ active: { id: 'x' } });
    });

    it('does not throw when dnd-kit cancels a drag and no onDragCancel was given', () => {
      render(<DragProvider {...defaultProps} />);

      expect(() => {
        fireEvent.click(screen.getByTestId('simulate-drag-cancel'));
      }).not.toThrow();
    });

    it('should pass collisionDetection to DndContext', () => {
      const collisionDetection = jest.fn();
      render(<DragProvider {...defaultProps} collisionDetection={collisionDetection} />);
      const dndContext = screen.getByTestId('dnd-context');
      expect(dndContext).toHaveAttribute('data-has-collision-detection', 'true');
    });

    it('should pass modifiers to DndContext', () => {
      const modifiers = [jest.fn()];
      render(<DragProvider {...defaultProps} modifiers={modifiers} />);
      const dndContext = screen.getByTestId('dnd-context');
      expect(dndContext).toHaveAttribute('data-has-modifiers', 'true');
    });

    it('should pass autoScroll to DndContext', () => {
      const autoScroll = { enabled: true };
      render(<DragProvider {...defaultProps} autoScroll={autoScroll} />);
      const dndContext = screen.getByTestId('dnd-context');
      expect(dndContext).toHaveAttribute('data-has-auto-scroll', 'true');
    });

    it('should pass accessibility to DndContext', () => {
      const accessibility = { screenReaderInstructions: { draggable: 'Press Space or Enter to pick up.' } };
      render(<DragProvider {...defaultProps} accessibility={accessibility} />);
      const dndContext = screen.getByTestId('dnd-context');
      expect(dndContext).toHaveAttribute('data-has-accessibility', 'true');
    });

    it('should pass all props to DndContext', () => {
      const onDragStart = jest.fn();
      const onDragEnd = jest.fn();
      const collisionDetection = jest.fn();
      const modifiers = [jest.fn()];
      const autoScroll = { enabled: true };
      const accessibility = { screenReaderInstructions: { draggable: 'Press Space or Enter to pick up.' } };

      render(
        <DragProvider
          {...defaultProps}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          collisionDetection={collisionDetection}
          modifiers={modifiers}
          autoScroll={autoScroll}
          accessibility={accessibility}
        />,
      );

      const dndContext = screen.getByTestId('dnd-context');
      expect(dndContext).toHaveAttribute('data-on-drag-start', 'function');
      expect(dndContext).toHaveAttribute('data-on-drag-end', 'function');
      expect(dndContext).toHaveAttribute('data-has-collision-detection', 'true');
      expect(dndContext).toHaveAttribute('data-has-modifiers', 'true');
      expect(dndContext).toHaveAttribute('data-has-auto-scroll', 'true');
      expect(dndContext).toHaveAttribute('data-has-accessibility', 'true');
    });
  });

  describe('optional props', () => {
    it('should work without onDragStart', () => {
      expect(() => {
        render(<DragProvider {...defaultProps} />);
      }).not.toThrow();
    });

    it('should work without onDragEnd', () => {
      expect(() => {
        render(<DragProvider {...defaultProps} />);
      }).not.toThrow();
    });

    it('should work without collisionDetection', () => {
      render(<DragProvider {...defaultProps} />);
      const dndContext = screen.getByTestId('dnd-context');
      expect(dndContext).toHaveAttribute('data-has-collision-detection', 'false');
    });

    it('should work without modifiers', () => {
      render(<DragProvider {...defaultProps} />);
      const dndContext = screen.getByTestId('dnd-context');
      expect(dndContext).toHaveAttribute('data-has-modifiers', 'false');
    });

    it('should work without autoScroll', () => {
      render(<DragProvider {...defaultProps} />);
      const dndContext = screen.getByTestId('dnd-context');
      expect(dndContext).toHaveAttribute('data-has-auto-scroll', 'false');
    });

    it('should work without accessibility', () => {
      render(<DragProvider {...defaultProps} />);
      const dndContext = screen.getByTestId('dnd-context');
      expect(dndContext).toHaveAttribute('data-has-accessibility', 'false');
    });
  });

  describe('sensors setup', () => {
    it('should initialize PointerSensor with activation constraint', () => {
      const { useSensor } = require('@dnd-kit/core');
      render(<DragProvider {...defaultProps} />);

      expect(useSensor).toHaveBeenCalledWith('PointerSensor', { activationConstraint: { distance: 8 } });
    });

    it('should initialize KeyboardSensor with no options by default', () => {
      const { useSensor } = require('@dnd-kit/core');
      render(<DragProvider {...defaultProps} />);

      expect(useSensor).toHaveBeenCalledWith('KeyboardSensor', undefined);
    });

    it('should combine sensors with useSensors', () => {
      const { useSensors } = require('@dnd-kit/core');
      render(<DragProvider {...defaultProps} />);

      expect(useSensors).toHaveBeenCalled();
    });

    it('should initialize KeyboardSensor with a custom coordinateGetter when provided', () => {
      const { useSensor } = require('@dnd-kit/core');
      const keyboardCoordinateGetter = jest.fn();
      render(<DragProvider {...defaultProps} keyboardCoordinateGetter={keyboardCoordinateGetter} />);

      expect(useSensor).toHaveBeenCalledWith('KeyboardSensor', {
        coordinateGetter: keyboardCoordinateGetter,
        keyboardCodes: undefined,
      });
    });

    it('should initialize KeyboardSensor with custom keyboardCodes when provided', () => {
      const { useSensor } = require('@dnd-kit/core');
      const keyboardCodes = { start: ['Space'], cancel: ['Escape'], end: ['Space'] };
      render(<DragProvider {...defaultProps} keyboardCodes={keyboardCodes} />);

      expect(useSensor).toHaveBeenCalledWith('KeyboardSensor', {
        coordinateGetter: undefined,
        keyboardCodes,
      });
    });

    it('should not customize KeyboardSensor when only unrelated props are passed', () => {
      const { useSensor } = require('@dnd-kit/core');
      render(<DragProvider {...defaultProps} collisionDetection={jest.fn()} />);

      expect(useSensor).toHaveBeenCalledWith('KeyboardSensor', undefined);
    });
  });

  describe('re-rendering', () => {
    it('should update children when they change', () => {
      const { rerender } = render(<DragProvider {...defaultProps} />);
      expect(screen.getByText('Test Content')).toBeInTheDocument();

      rerender(
        <DragProvider>
          <div data-testid="new-child">New Content</div>
        </DragProvider>,
      );
      expect(screen.getByText('New Content')).toBeInTheDocument();
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
    });

    it('should update handlers when they change', () => {
      const onDragStart1 = jest.fn();
      const onDragStart2 = jest.fn();

      const { rerender } = render(<DragProvider {...defaultProps} onDragStart={onDragStart1} />);

      rerender(<DragProvider {...defaultProps} onDragStart={onDragStart2} />);

      // Should still have the handler attribute
      const dndContext = screen.getByTestId('dnd-context');
      expect(dndContext).toHaveAttribute('data-on-drag-start', 'function');
    });
  });

  describe('edge cases', () => {
    it('should handle fragment children', () => {
      render(
        <DragProvider>
          <>
            <div data-testid="fragment-child-1">First</div>
            <div data-testid="fragment-child-2">Second</div>
          </>
        </DragProvider>,
      );
      expect(screen.getByTestId('fragment-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('fragment-child-2')).toBeInTheDocument();
    });

    it('should handle null children within array', () => {
      render(
        <DragProvider>
          {[
            <div key="1" data-testid="valid-child">
              Valid
            </div>,
            null,
            <div key="2" data-testid="another-valid">
              Another
            </div>,
          ]}
        </DragProvider>,
      );
      expect(screen.getByTestId('valid-child')).toBeInTheDocument();
      expect(screen.getByTestId('another-valid')).toBeInTheDocument();
    });

    it('should handle empty modifiers array', () => {
      render(<DragProvider {...defaultProps} modifiers={[]} />);
      const dndContext = screen.getByTestId('dnd-context');
      expect(dndContext).toHaveAttribute('data-has-modifiers', 'true');
    });

    it('should handle multiple modifier functions', () => {
      const modifiers = [jest.fn(), jest.fn(), jest.fn()];
      render(<DragProvider {...defaultProps} modifiers={modifiers} />);
      const dndContext = screen.getByTestId('dnd-context');
      expect(dndContext).toHaveAttribute('data-has-modifiers', 'true');
    });
  });

  describe('prop types validation', () => {
    // Suppress console errors for prop type validation tests
    const originalError = console.error;
    beforeAll(() => {
      console.error = jest.fn();
    });
    afterAll(() => {
      console.error = originalError;
    });

    it('should accept valid children prop', () => {
      expect(() => {
        render(<DragProvider {...defaultProps} />);
      }).not.toThrow();
    });

    it('should accept function props for callbacks', () => {
      expect(() => {
        render(<DragProvider {...defaultProps} onDragStart={jest.fn()} onDragEnd={jest.fn()} />);
      }).not.toThrow();
    });

    it('should accept function prop for collisionDetection', () => {
      expect(() => {
        render(<DragProvider {...defaultProps} collisionDetection={jest.fn()} />);
      }).not.toThrow();
    });

    it('should accept array of functions for modifiers', () => {
      expect(() => {
        render(<DragProvider {...defaultProps} modifiers={[jest.fn(), jest.fn()]} />);
      }).not.toThrow();
    });

    it('should accept object for autoScroll', () => {
      expect(() => {
        render(<DragProvider {...defaultProps} autoScroll={{ enabled: true }} />);
      }).not.toThrow();
    });
  });
});
