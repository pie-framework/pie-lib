import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeedbackConfig, buildDefaults } from '../index';

// Mock FeedbackSelector to simplify testing
jest.mock('../feedback-selector', () => {
  return function FeedbackSelector({ label, feedback, onChange }) {
    return (
      <div data-testid="feedback-selector">
        <label>{label}</label>
        <select
          aria-label={label}
          value={feedback.type}
          onChange={(e) => onChange({ ...feedback, type: e.target.value })}
        >
          <option value="default">Default</option>
          <option value="custom">Custom</option>
          <option value="none">None</option>
        </select>
      </div>
    );
  };
});

describe('FeedbackConfig', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  describe('rendering', () => {
    it('renders with default feedback types', () => {
      const feedback = buildDefaults();

      render(<FeedbackConfig feedback={feedback} onChange={onChange} />);

      expect(screen.getByText('Feedback')).toBeInTheDocument();
      expect(screen.getByText('If correct, show')).toBeInTheDocument();
      expect(screen.getByText('If partially correct, show')).toBeInTheDocument();
      expect(screen.getByText('If incorrect, show')).toBeInTheDocument();
    });

    it('renders all three feedback selectors by default', () => {
      const feedback = buildDefaults();

      render(<FeedbackConfig feedback={feedback} onChange={onChange} />);

      const selectors = screen.getAllByTestId('feedback-selector');
      expect(selectors).toHaveLength(3);
    });

    it('does not render partial feedback selector when allowPartial is false', () => {
      const feedback = buildDefaults();

      render(<FeedbackConfig allowPartial={false} feedback={feedback} onChange={onChange} />);

      expect(screen.getByText('If correct, show')).toBeInTheDocument();
      expect(screen.queryByText('If partially correct, show')).not.toBeInTheDocument();
      expect(screen.getByText('If incorrect, show')).toBeInTheDocument();

      const selectors = screen.getAllByTestId('feedback-selector');
      expect(selectors).toHaveLength(2);
    });
  });

  describe('user interactions', () => {
    it('calls onChange when correct feedback type changes', async () => {
      const user = userEvent.setup();
      const feedback = buildDefaults();

      render(<FeedbackConfig feedback={feedback} onChange={onChange} />);

      const correctSelect = screen.getByLabelText('If correct, show');
      await user.selectOptions(correctSelect, 'custom');

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          correct: expect.objectContaining({ type: 'custom' }),
        }),
      );
    });

    it('calls onChange when incorrect feedback type changes', async () => {
      const user = userEvent.setup();
      const feedback = buildDefaults();

      render(<FeedbackConfig feedback={feedback} onChange={onChange} />);

      const incorrectSelect = screen.getByLabelText('If incorrect, show');
      await user.selectOptions(incorrectSelect, 'none');

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          incorrect: expect.objectContaining({ type: 'none' }),
        }),
      );
    });

    it('calls onChange when partial feedback type changes', async () => {
      const user = userEvent.setup();
      const feedback = buildDefaults();

      render(<FeedbackConfig feedback={feedback} onChange={onChange} />);

      const partialSelect = screen.getByLabelText('If partially correct, show');
      await user.selectOptions(partialSelect, 'custom');

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          partial: expect.objectContaining({ type: 'custom' }),
        }),
      );
    });
  });

  describe('buildDefaults helper', () => {
    it('returns default feedback configuration', () => {
      const defaults = buildDefaults();

      expect(defaults).toEqual({
        correct: { type: 'default', default: 'Correct' },
        incorrect: { type: 'default', default: 'Incorrect' },
        partial: { type: 'default', default: 'Nearly' },
      });
    });

    it('merges custom values with defaults', () => {
      const defaults = buildDefaults({
        correct: { type: 'custom', custom: 'Great job!' },
      });

      expect(defaults).toEqual({
        correct: { type: 'custom', default: 'Correct', custom: 'Great job!' },
        incorrect: { type: 'default', default: 'Incorrect' },
        partial: { type: 'default', default: 'Nearly' },
      });
    });
  });
});
