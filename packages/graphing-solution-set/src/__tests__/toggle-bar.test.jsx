import { render, screen } from '@pie-lib/test-utils';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { ToggleBar } from '../toggle-bar';

// Mock DragProvider to avoid @dnd-kit React version conflicts
jest.mock('@pie-lib/drag', () => ({
  DragProvider: ({ children }) => <div data-testid="drag-provider">{children}</div>,
}));

// Mock @dnd-kit/core hooks to avoid DndContext requirement
jest.mock('@dnd-kit/core', () => ({
  useDraggable: jest.fn(() => ({
    attributes: {
      role: 'button',
      tabIndex: 0,
    },
    listeners: {
      onPointerDown: jest.fn(),
    },
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  })),
  useDroppable: jest.fn(() => ({
    setNodeRef: jest.fn(),
    isOver: false,
    active: null,
  })),
}));

// Mock @dnd-kit/utilities for CSS transform
jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: jest.fn((transform) => (transform ? 'translate3d(0, 0, 0)' : '')),
    },
  },
}));

// Mock @dnd-kit/sortable for arrayMove
jest.mock('@dnd-kit/sortable', () => ({
  arrayMove: jest.fn((array, from, to) => {
    const newArray = [...array];
    const [removed] = newArray.splice(from, 1);
    newArray.splice(to, 0, removed);
    return newArray;
  }),
}));

// Mock Translator to return the key as-is for testing
jest.mock('@pie-lib/translator', () => ({
  translator: {
    t: (key) => {
      // Extract tool name from key like "graphing.point" -> "point"
      const parts = key.split('.');
      return parts[parts.length - 1];
    },
  },
}));

describe('ToggleBar', () => {
  let onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  const renderComponent = (extras) => {
    const defaults = {
      className: 'className',
      onChange,
      options: ['line', 'polygon'],
      language: 'en',
    };
    const props = { ...defaults, ...extras };
    return render(<ToggleBar {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders tool buttons for valid tools', () => {
      renderComponent({ options: ['line', 'polygon'] });
      expect(screen.getByText(/line/i)).toBeInTheDocument();
      expect(screen.getByText(/polygon/i)).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onChange when tool button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({ options: ['line', 'polygon'] });

      const lineButton = screen.getByText(/line/i).closest('button');
      await user.click(lineButton);

      expect(onChange).toHaveBeenCalledWith('line');
    });
  });
});
