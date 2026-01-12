import { render, screen } from '@pie-lib/test-utils';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { ToggleBar } from '../toggle-bar';

// Mock DragProvider to avoid @dnd-kit React version conflicts
jest.mock('@pie-lib/drag', () => ({
  DragProvider: ({ children }) => <div data-testid="drag-provider">{children}</div>,
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
