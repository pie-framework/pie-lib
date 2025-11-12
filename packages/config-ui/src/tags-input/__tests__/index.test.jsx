import { TagsInput } from '../index';
import { render, screen, userEvent, pressKey, Keys } from '@pie-lib/test-utils';
import React from 'react';

describe('TagsInput', () => {
  describe('rendering', () => {
    it('renders existing tags as chips', () => {
      render(<TagsInput tags={['foo', 'bar']} onChange={jest.fn()} />);

      expect(screen.getByText('foo')).toBeInTheDocument();
      expect(screen.getByText('bar')).toBeInTheDocument();
    });

    it('renders input field', () => {
      render(<TagsInput tags={['foo']} onChange={jest.fn()} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    let onChange;
    const renderComponent = (tags = ['foo']) => {
      onChange = jest.fn();
      return render(<TagsInput onChange={onChange} tags={tags} />);
    };

    describe('focus behavior', () => {
      it('allows user to focus the input', async () => {
        const user = userEvent.setup();
        renderComponent();

        const input = screen.getByRole('textbox');
        await user.click(input);

        expect(input).toHaveFocus();
      });

      it('allows user to blur the input', async () => {
        const user = userEvent.setup();
        renderComponent();

        const input = screen.getByRole('textbox');
        await user.click(input);
        expect(input).toHaveFocus();

        await user.tab();
        expect(input).not.toHaveFocus();
      });
    });

    describe('typing in input', () => {
      it('updates input value when user types', async () => {
        const user = userEvent.setup();
        renderComponent();

        const input = screen.getByRole('textbox');
        await user.type(input, 'boo');

        expect(input).toHaveValue('boo');
      });
    });

    describe('adding tags', () => {
      it('adds new tag when user presses Enter', async () => {
        const user = userEvent.setup();
        renderComponent();

        const input = screen.getByRole('textbox');
        await user.type(input, 'banana');
        pressKey(input, Keys.ENTER);

        expect(onChange).toHaveBeenCalledWith(['foo', 'banana']);
      });

      it('does not add duplicate tags', async () => {
        const user = userEvent.setup();
        renderComponent();

        const input = screen.getByRole('textbox');
        await user.type(input, 'foo');
        pressKey(input, Keys.ENTER);

        expect(onChange).not.toHaveBeenCalled();
      });

      it('clears input after adding tag', async () => {
        const user = userEvent.setup();
        renderComponent();

        const input = screen.getByRole('textbox');
        await user.type(input, 'banana');
        pressKey(input, Keys.ENTER);

        expect(input).toHaveValue('');
      });
    });

    describe('deleting tags', () => {
      it('removes tag when user clicks delete button', async () => {
        const user = userEvent.setup();
        renderComponent(['foo', 'bar']);

        // Find the delete button for 'foo' tag
        const deleteButtons = screen.getAllByTestId('CancelIcon');
        await user.click(deleteButtons[0]);

        expect(onChange).toHaveBeenCalledWith(['bar']);
      });
    });
  });
});
