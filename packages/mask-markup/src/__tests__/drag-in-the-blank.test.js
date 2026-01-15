import * as React from 'react';
import { render, screen } from '@testing-library/react';
import DragInTheBlank from '../drag-in-the-blank';

const markup = `<div>
  <img src="https://image.shutterstock.com/image-vector/cow-jumped-over-moon-traditional-260nw-1152899330.jpg"></img>
   <h5>Hey Diddle Diddle <i>by ?</i></h5>
 <p>1: Hey, diddle, diddle,</p>
 <p>2: The cat and the fiddle,</p>
 <p>3: The cow {{0}} over the moon;</p>
 <p>4: The little dog {{1}},</p>
 <p>5: To see such sport,</p>
 <p>6: And the dish ran away with the {{2}}.</p>
</div>`;
const choice = (v, id) => ({ value: v, id });

// Mock DragProvider and DragDroppablePlaceholder to avoid DndContext requirement
jest.mock('@pie-lib/drag', () => ({
  DragProvider: ({ children, onDragStart, onDragEnd }) => {
    // Simple wrapper that doesn't require DndContext
    return <div data-testid="drag-provider">{children}</div>;
  },
  DragDroppablePlaceholder: ({ children, disabled, instanceId }) => {
    // Simple wrapper that doesn't require useDroppable
    return <div data-testid="drag-droppable-placeholder">{children}</div>;
  },
}));

// Mock @dnd-kit/core components and hooks used by DragInTheBlank and child components
jest.mock('@dnd-kit/core', () => ({
  DragOverlay: ({ children }) => <div data-testid="drag-overlay">{children}</div>,
  closestCenter: jest.fn(),
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

describe('DragInTheBlank', () => {
  const defaultProps = {
    disabled: false,
    feedback: {},
    markup,
    choices: [
      choice('Jumped', '0'),
      choice('Laughed', '1'),
      choice('Spoon', '2'),
      choice('Fork', '3'),
      choice('Bumped', '4'),
      choice('Smiled', '5'),
    ],

    value: {
      0: undefined,
    },
  };

  describe('render', () => {
    it('renders correctly with default props', () => {
      const { container } = render(<DragInTheBlank {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
      // Check that markup content is rendered
      expect(screen.getByText(/Hey Diddle Diddle/)).toBeInTheDocument();
      expect(screen.getByText(/Hey, diddle, diddle,/)).toBeInTheDocument();
    });

    it('renders correctly with disabled prop as true', () => {
      const { container } = render(<DragInTheBlank {...defaultProps} disabled={true} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders correctly with feedback', () => {
      const { container } = render(
        <DragInTheBlank
          {...defaultProps}
          feedback={{
            0: {
              value: 'Jumped',
              correct: 'Jumped',
            },
            1: {
              value: 'Laughed',
              correct: 'Laughed',
            },
            2: {
              value: 'Spoon',
              correct: 'Spoon',
            },
          }}
        />
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
