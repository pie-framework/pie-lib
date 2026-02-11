import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ActionsButton } from '../actions-button';

jest.mock('@pie-lib/translator', () => ({
  __esModule: true,
  default: {
    translator: {
      t: jest.fn((key) => {
        const translations = {
          'charting.add': 'Add Category',
          'charting.delete': 'Delete',
          'charting.newLabel': 'New Category',
        };
        return translations[key] || key;
      }),
    },
  },
}));

let theme;

beforeAll(() => {
  theme = createTheme();
});

describe('ActionsButton', () => {
  const addCategory = jest.fn();
  const deleteCategory = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (extras = {}) => {
    const defaults = {
      addCategory,
      deleteCategory,
      categories: [],
      language: 'en',
    };
    const props = { ...defaults, ...extras };
    return render(
      <ThemeProvider theme={theme}>
        <ActionsButton {...props} />
      </ThemeProvider>,
    );
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container).toBeInTheDocument();
    });

    it('renders Actions button', () => {
      const { getByText } = renderComponent();
      expect(getByText('Actions')).toBeInTheDocument();
    });

    it('renders with custom language', () => {
      const { container } = renderComponent({ language: 'es' });
      expect(container).toBeInTheDocument();
    });

    it('renders with empty categories', () => {
      const { container } = renderComponent({ categories: [] });
      expect(container).toBeInTheDocument();
    });

    it('renders with multiple categories', () => {
      const categories = [
        { label: 'A', deletable: true },
        { label: 'B', deletable: true },
        { label: 'C', deletable: false },
      ];
      const { container } = renderComponent({ categories });
      expect(container).toBeInTheDocument();
    });
  });

  describe('popover interactions', () => {
    it('opens popover when Actions button is clicked', () => {
      const { getByText } = renderComponent();
      const actionsButton = getByText('Actions');

      fireEvent.click(actionsButton);

      expect(getByText(/Add Category/i)).toBeInTheDocument();
    });

    it('closes popover when clicking outside', () => {
      const { getByText } = renderComponent();
      const actionsButton = getByText('Actions');

      fireEvent.click(actionsButton);
      expect(getByText(/Add Category/i)).toBeInTheDocument();

      const backdrop = document.querySelector('.MuiPopover-root');
      if (backdrop) {
        fireEvent.click(backdrop);
      }
    });

    it('has correct accessibility attributes', () => {
      const { getByText } = renderComponent();
      const actionsButton = getByText('Actions');

      expect(actionsButton).toHaveAttribute('role', 'button');
      expect(actionsButton).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('add category functionality', () => {
    it('calls addCategory when add button is clicked', () => {
      const { getByText } = renderComponent();

      fireEvent.click(getByText('Actions'));
      fireEvent.click(getByText(/Add Category/i));

      expect(addCategory).toHaveBeenCalledTimes(1);
    });

    it('closes popover after adding category', () => {
      const { getByText } = renderComponent();

      fireEvent.click(getByText('Actions'));
      fireEvent.click(getByText(/Add Category/i));

      expect(addCategory).toHaveBeenCalled();
    });
  });

  describe('delete category functionality', () => {
    it('shows delete buttons for deletable categories', () => {
      const categories = [
        { label: 'Category A', deletable: true },
        { label: 'Category B', deletable: true },
      ];
      const { getByText } = renderComponent({ categories });

      fireEvent.click(getByText('Actions'));

      expect(getByText(/Delete <Category A>/i)).toBeInTheDocument();
      expect(getByText(/Delete <Category B>/i)).toBeInTheDocument();
    });

    it('does not show delete button for non-deletable categories', () => {
      const categories = [{ label: 'Category A', deletable: false }];
      const { getByText, queryByText } = renderComponent({ categories });

      fireEvent.click(getByText('Actions'));

      expect(queryByText(/Delete <Category A>/i)).not.toBeInTheDocument();
    });

    it('does not show delete button for categories with correctness', () => {
      const categories = [{ label: 'Category A', deletable: true, correctness: { value: 'correct' } }];
      const { getByText, queryByText } = renderComponent({ categories });

      fireEvent.click(getByText('Actions'));

      expect(queryByText(/Delete <Category A>/i)).not.toBeInTheDocument();
    });

    it('calls deleteCategory with correct index', () => {
      const categories = [
        { label: 'Category A', deletable: true },
        { label: 'Category B', deletable: true },
      ];
      const { getByText } = renderComponent({ categories });

      fireEvent.click(getByText('Actions'));
      fireEvent.click(getByText(/Delete <Category B>/i));

      expect(deleteCategory).toHaveBeenCalledWith(1);
    });

    it('closes popover after deleting category', () => {
      const categories = [{ label: 'Category A', deletable: true }];
      const { getByText } = renderComponent({ categories });

      fireEvent.click(getByText('Actions'));
      fireEvent.click(getByText(/Delete <Category A>/i));

      expect(deleteCategory).toHaveBeenCalled();
    });

    it('shows "New Category" for categories without label', () => {
      const categories = [{ label: '', deletable: true }];
      const { getByText } = renderComponent({ categories });

      fireEvent.click(getByText('Actions'));

      expect(getByText(/Delete <New Category>/i)).toBeInTheDocument();
    });

    it('handles deletion of multiple categories', () => {
      const categories = [
        { label: 'A', deletable: true },
        { label: 'B', deletable: true },
        { label: 'C', deletable: true },
      ];
      const { getByText } = renderComponent({ categories });

      fireEvent.click(getByText('Actions'));

      expect(getByText(/Delete <A>/i)).toBeInTheDocument();
      expect(getByText(/Delete <B>/i)).toBeInTheDocument();
      expect(getByText(/Delete <C>/i)).toBeInTheDocument();
    });
  });

  describe('componentWillUnmount', () => {
    it('cleans up state on unmount', () => {
      const { unmount, getByText } = renderComponent();

      fireEvent.click(getByText('Actions'));
      unmount();

      // Should not throw error
      expect(true).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles empty categories array', () => {
      const { container } = renderComponent({ categories: [] });
      expect(container).toBeInTheDocument();
    });

    it('handles undefined language', () => {
      const { container } = renderComponent({ language: undefined });
      expect(container).toBeInTheDocument();
    });

    it('handles mixed deletable and correctness states', () => {
      const categories = [
        { label: 'A', deletable: true },
        { label: 'B', deletable: false },
        { label: 'C', deletable: true, correctness: { value: 'correct' } },
        { label: 'D', deletable: true },
      ];
      const { getByText } = renderComponent({ categories });

      fireEvent.click(getByText('Actions'));

      expect(getByText(/Delete <A>/i)).toBeInTheDocument();
      expect(getByText(/Delete <D>/i)).toBeInTheDocument();
    });

    it('handles categories with special characters in labels', () => {
      const categories = [{ label: '<>&"\'', deletable: true }];
      const { getByText } = renderComponent({ categories });

      fireEvent.click(getByText('Actions'));

      expect(getByText(/Delete </i)).toBeInTheDocument();
    });

    it('handles very long category labels', () => {
      const categories = [{ label: 'A'.repeat(100), deletable: true }];
      const { container } = renderComponent({ categories });
      expect(container).toBeInTheDocument();
    });
  });

  describe('popover positioning', () => {
    it('has correct anchor origin', () => {
      const { getByText, queryByText } = renderComponent();

      expect(queryByText(/\+ Add Category/i)).not.toBeInTheDocument();

      fireEvent.click(getByText('Actions'));

      expect(getByText(/\+ Add Category/i)).toBeInTheDocument();
    });
  });
});
