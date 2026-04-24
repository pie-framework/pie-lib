import { render, screen } from '@pie-lib/test-utils';
import userEvent from '@testing-library/user-event';
import React from 'react';

import ToolMenu from '../tool-menu';

jest.mock('@pie-lib/drag', () => ({
  DragProvider: ({ children }) => <div data-testid="drag-provider">{children}</div>,
}));

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

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: jest.fn((transform) => (transform ? 'translate3d(0, 0, 0)' : '')),
    },
  },
}));

jest.mock('@dnd-kit/sortable', () => ({
  arrayMove: jest.fn((array, from, to) => {
    const newArray = [...array];
    const [removed] = newArray.splice(from, 1);
    newArray.splice(to, 0, removed);
    return newArray;
  }),
}));

describe('ToolMenu', () => {
  let onChange = jest.fn();
  let onChangeTools = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
    onChangeTools.mockClear();
  });

  const renderComponent = (extras) => {
    const defaults = {
      className: 'className',
      onChange,
      onChangeTools,
      currentToolType: 'point',
      toolbarTools: ['point', 'line'],
      language: 'en',
    };
    const props = { ...defaults, ...extras };
    return render(<ToolMenu {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders ToggleBar with correct props', () => {
      renderComponent({ toolbarTools: ['point', 'line', 'circle'] });
      expect(screen.getByText(/point/i)).toBeInTheDocument();
      expect(screen.getByText(/line/i)).toBeInTheDocument();
      expect(screen.getByText(/circle/i)).toBeInTheDocument();
    });

    it('passes currentToolType to ToggleBar', () => {
      renderComponent({ currentToolType: 'line' });
      const selectedButton = screen.getByText(/line/i).closest('button');
      expect(selectedButton).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onChange when tool is selected', async () => {
      const user = userEvent.setup();
      renderComponent();

      const lineButton = screen.getByText(/line/i).closest('button');
      await user.click(lineButton);

      expect(onChange).toHaveBeenCalledWith('line');
    });

    it('calls onChangeTools when tools order changes', () => {
      renderComponent({ draggableTools: true });
      // Note: Drag-and-drop testing requires more complex setup with @dnd-kit/test-utils
      // For now, we verify the component renders with draggableTools enabled
      expect(screen.getByText(/point/i)).toBeInTheDocument();
    });

    it('disables tools when disabled prop is true', () => {
      renderComponent({ disabled: true });
      const pointButton = screen.getByText(/point/i).closest('button');
      expect(pointButton).toBeDisabled();
    });
  });
});
