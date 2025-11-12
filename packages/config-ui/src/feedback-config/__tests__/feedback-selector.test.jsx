import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { FeedbackSelector } from '../feedback-selector';

// Mock the editable-html component to avoid window dependencies in tests
jest.mock('@pie-lib/editable-html', () => {
  return {
    __esModule: true,
    default: ({ markup, onChange }) => (
      <textarea
        data-testid="editable-html"
        defaultValue={markup || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    ),
  };
});

describe('feedback-selector', () => {
  let onChange;

  const renderComponent = (feedback = { type: 'default', default: 'hi' }) => {
    return render(
      <FeedbackSelector
        label={'Feedback'}
        onChange={onChange}
        feedback={feedback}
      />
    );
  };

  beforeEach(() => {
    onChange = jest.fn();
  });

  describe('rendering', () => {
    it('renders feedback type selector', () => {
      renderComponent();
      expect(screen.getByText('Simple Feedback')).toBeInTheDocument();
      expect(screen.getByText('No Feedback')).toBeInTheDocument();
      expect(screen.getByText('Customized Feedback')).toBeInTheDocument();
    });

    it('shows default feedback text when type is default', () => {
      renderComponent({ type: 'default', default: 'hi' });
      expect(screen.getByText('hi')).toBeInTheDocument();
    });

    it('shows editable html when type is custom', () => {
      renderComponent({ type: 'custom', default: 'hi', custom: 'custom text' });
      expect(screen.getByTestId('editable-html')).toBeInTheDocument();
      expect(screen.getByTestId('editable-html')).toHaveValue('custom text');
    });

    it('does not show default feedback when type is none', () => {
      renderComponent({ type: 'none', default: 'hi' });
      expect(screen.queryByText('hi')).not.toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('calls onChange when switching to default feedback', async () => {
      const user = userEvent.setup();
      renderComponent({ type: 'custom', default: 'hi' });

      await user.click(screen.getByLabelText('Simple Feedback'));

      expect(onChange).toHaveBeenCalledWith({ type: 'default', default: 'hi' });
    });

    it('calls onChange when switching to custom feedback', async () => {
      const user = userEvent.setup();
      renderComponent({ type: 'default', default: 'hi' });

      await user.click(screen.getByLabelText('Customized Feedback'));

      expect(onChange).toHaveBeenCalledWith({ type: 'custom', default: 'hi' });
    });

    it('calls onChange when switching to no feedback', async () => {
      const user = userEvent.setup();
      renderComponent({ type: 'default', default: 'hi' });

      await user.click(screen.getByLabelText('No Feedback'));

      expect(onChange).toHaveBeenCalledWith({ type: 'none', default: 'hi' });
    });

    it('calls onChange with custom text when editing custom feedback', async () => {
      const user = userEvent.setup();
      renderComponent({ type: 'custom', default: 'hi', custom: '' });

      const editor = screen.getByTestId('editable-html');
      await user.clear(editor);
      await user.type(editor, 'text');

      // user.type triggers onChange for each character, so check that onChange was called
      // and that the last call has 'text' in custom field
      expect(onChange).toHaveBeenCalled();
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.type).toBe('custom');
      expect(lastCall.custom).toBe('text');
      expect(lastCall.default).toBe('hi');
    });
  });
});
