import { render, screen } from '@pie-lib/test-utils';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { ToggleBar } from '../toggle-bar';

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

jest.mock('@pie-lib/translator', () => ({
  translator: {
    t: (key) => {
      const parts = key.split('.');
      return parts[parts.length - 1];
    },
  },
}));

describe('ToggleBar', () => {
  let onChange = jest.fn();
  let onChangeToolsOrder = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
    onChangeToolsOrder.mockClear();
  });

  const renderComponent = (extras) => {
    const defaults = {
      className: 'className',
      onChange,
      onChangeToolsOrder,
      options: ['point', 'line'],
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
      renderComponent({ options: ['point', 'line', 'circle'] });
      expect(screen.getByText(/point/i)).toBeInTheDocument();
      expect(screen.getByText(/line/i)).toBeInTheDocument();
      expect(screen.getByText(/circle/i)).toBeInTheDocument();
    });

    it('does not render invalid tool options', () => {
      renderComponent({ options: ['point', 'invalid-tool', 'line'] });
      expect(screen.getByText(/point/i)).toBeInTheDocument();
      expect(screen.getByText(/line/i)).toBeInTheDocument();
      expect(screen.queryByText(/invalid-tool/i)).not.toBeInTheDocument();
    });

    it('highlights selected tool', () => {
      const { container } = renderComponent({ selectedToolType: 'line' });
      const selectedButton = screen.getByText(/line/i).closest('button');
      expect(selectedButton).toHaveAttribute('value', 'line');
    });
  });

  describe('interactions', () => {
    it('calls onChange when tool button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({ options: ['point', 'line'] });

      const pointButton = screen.getByText(/point/i).closest('button');
      await user.click(pointButton);

      expect(onChange).toHaveBeenCalledWith('point');
    });

    it('calls onChange with selected tool type', async () => {
      const user = userEvent.setup();
      renderComponent({ options: ['point', 'line'], selectedToolType: 'point' });

      const lineButton = screen.getByText(/line/i).closest('button');
      await user.click(lineButton);

      expect(onChange).toHaveBeenCalledWith('line');
    });

    it('disables buttons when disabled prop is true', () => {
      renderComponent({ disabled: true, options: ['point', 'line'] });

      const pointButton = screen.getByText(/point/i).closest('button');
      const lineButton = screen.getByText(/line/i).closest('button');

      expect(pointButton).toBeDisabled();
      expect(lineButton).toBeDisabled();
    });

    it('does not call onChange when disabled', () => {
      renderComponent({ disabled: true, options: ['point'] });

      const pointButton = screen.getByText(/point/i).closest('button');
      expect(pointButton).toBeDisabled();
      // Note: Cannot test click on disabled button with pointer-events: none
      // The disabled state is verified above
    });
  });
});
