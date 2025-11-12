import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import withUndoReset from '../withUndoReset';

describe('withUndoReset', () => {
  let defaultProps;
  let onSessionChange;

  const WrappedClass = class WrappedComponent extends React.Component {
    onSessionChange = (session) => {
      this.props.onSessionChange(session);
    };

    onAddItem = (item) => {
      this.onSessionChange({
        ...this.props.session,
        items: this.props.session.items.concat(item),
      });
    };

    onRemoveLastItem = () => {
      const newItems = [...this.props.session.items];
      newItems.pop();

      this.onSessionChange({
        ...this.props.session,
        items: newItems,
      });
    };

    render() {
      const { session } = this.props;
      const items = session.items || [];

      return (
        <div data-testid="wrapped-component">
          <button data-testid="add-item" onClick={() => this.onAddItem({ id: Date.now() })}>
            Add Item
          </button>
          <button data-testid="remove-item" onClick={() => this.onRemoveLastItem()}>
            Remove Item
          </button>
          <div data-testid="items-container">
            {items.map((item) => (
              <span key={item.id} data-testid={`item-${item.id}`}>
                {item.id}
              </span>
            ))}
          </div>
        </div>
      );
    }
  };

  const Component = withUndoReset(WrappedClass);

  beforeEach(() => {
    onSessionChange = jest.fn();
    defaultProps = {
      session: {
        items: [],
      },
      onSessionChange,
    };
  });

  describe('HOC functionality', () => {
    it('renders the wrapped component', () => {
      render(<Component {...defaultProps} />);
      expect(screen.getByTestId('wrapped-component')).toBeInTheDocument();
    });

    it('renders undo and reset buttons', () => {
      render(<Component {...defaultProps} />);
      expect(screen.getByText(/Undo/i)).toBeInTheDocument();
      expect(screen.getByText(/Start Over/i)).toBeInTheDocument();
    });

    it('passes session props to wrapped component', () => {
      render(<Component {...defaultProps} />);
      const itemsContainer = screen.getByTestId('items-container');
      expect(itemsContainer).toBeInTheDocument();
    });
  });

  describe('undo functionality', () => {
    it('undo button is disabled when there are no changes', () => {
      render(<Component {...defaultProps} />);
      const undoButton = screen.getByText(/Undo/i).closest('button');
      expect(undoButton).toBeDisabled();
    });

    it('undo button is enabled after a change', async () => {
      const user = userEvent.setup();
      render(<Component {...defaultProps} />);

      const addButton = screen.getByTestId('add-item');
      await user.click(addButton);

      const undoButton = screen.getByText(/Undo/i).closest('button');
      expect(undoButton).toBeEnabled();
    });

    it('undoes changes when undo button is clicked', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<Component {...defaultProps} />);

      // Add an item
      const addButton = screen.getByTestId('add-item');
      await user.click(addButton);

      // Get the actual item ID from the onSessionChange call
      const addedItem = onSessionChange.mock.calls[0][0].items[0];

      // Update props to reflect the change
      const updatedProps = {
        ...defaultProps,
        session: { items: [addedItem] },
      };
      rerender(<Component {...updatedProps} />);

      expect(screen.getByTestId(`item-${addedItem.id}`)).toBeInTheDocument();

      // Click undo
      const undoButton = screen.getByText(/Undo/i).closest('button');
      await user.click(undoButton);

      // Should call onSessionChange with previous session
      expect(onSessionChange).toHaveBeenCalledWith({ items: [] });
    });
  });

  describe('reset functionality', () => {
    it('reset button is disabled when there are no changes', () => {
      render(<Component {...defaultProps} />);
      const resetButton = screen.getByText(/Start Over/i).closest('button');
      expect(resetButton).toBeDisabled();
    });

    it('reset button is enabled after a change', async () => {
      const user = userEvent.setup();
      render(<Component {...defaultProps} />);

      const addButton = screen.getByTestId('add-item');
      await user.click(addButton);

      const resetButton = screen.getByText(/Start Over/i).closest('button');
      expect(resetButton).toBeEnabled();
    });

    it('resets all changes when reset button is clicked', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<Component {...defaultProps} />);

      // Make multiple changes
      const addButton = screen.getByTestId('add-item');
      await user.click(addButton);
      await user.click(addButton);

      // Update props to reflect the changes
      const updatedProps = {
        ...defaultProps,
        session: { items: [{ id: 1 }, { id: 2 }] },
      };
      rerender(<Component {...updatedProps} />);

      // Click reset
      const resetButton = screen.getByText(/Start Over/i).closest('button');
      await user.click(resetButton);

      // Should call onSessionChange with initial session
      expect(onSessionChange).toHaveBeenCalledWith({ items: [] });
    });
  });
});
