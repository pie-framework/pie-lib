import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { ImageToolbar } from '../image-toolbar';
import React from 'react';

// Mock the alt-dialog component to avoid complex modal rendering in tests
jest.mock('../alt-dialog', () => {
  return function AltDialog({ alt, onDone }) {
    return (
      <div data-testid="alt-dialog">
        <input
          data-testid="alt-input"
          defaultValue={alt}
          onChange={(e) => onDone(e.target.value)}
        />
      </div>
    );
  };
});

describe('ImageToolbar', () => {
  let onChange;

  beforeEach(() => {
    onChange = jest.fn();
  });

  const renderComponent = (extras = {}) => {
    const props = {
      onChange,
      imageLoaded: true,
      ...extras,
    };

    return render(<ImageToolbar {...props} />);
  };

  describe('rendering', () => {
    it('renders alignment buttons', () => {
      renderComponent();
      expect(screen.getByText('left')).toBeInTheDocument();
      expect(screen.getByText('center')).toBeInTheDocument();
      expect(screen.getByText('right')).toBeInTheDocument();
    });

    it('renders alt text button', () => {
      renderComponent();
      expect(screen.getByText('Alt text')).toBeInTheDocument();
    });

    it('does not render alignment buttons when disabled', () => {
      renderComponent({ disableImageAlignmentButtons: true });
      expect(screen.queryByText('left')).not.toBeInTheDocument();
      expect(screen.queryByText('center')).not.toBeInTheDocument();
      expect(screen.queryByText('right')).not.toBeInTheDocument();
    });

    it('shows active state for selected alignment', () => {
      const { container } = renderComponent({ alignment: 'center' });
      // The MarkButton component uses aria-pressed for active state
      const centerButton = screen.getByText('center').closest('button');
      expect(centerButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('user interactions', () => {
    it('calls onChange with alignment when left is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByText('left'));

      expect(onChange).toHaveBeenCalledWith({ alignment: 'left' });
    });

    it('calls onChange with alignment when center is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByText('center'));

      expect(onChange).toHaveBeenCalledWith({ alignment: 'center' });
    });

    it('calls onChange with alignment when right is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByText('right'));

      expect(onChange).toHaveBeenCalledWith({ alignment: 'right' });
    });
  });
});
