import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Correct, Incorrect, NothingSubmitted, PartiallyCorrect } from '../response-indicators';

// Mock the icons
jest.mock('@pie-lib/icons', () => ({
  Correct: () => <span data-testid="correct-icon">Correct Icon</span>,
  Incorrect: () => <span data-testid="incorrect-icon">Incorrect Icon</span>,
  PartiallyCorrect: () => <span data-testid="partially-correct-icon">Partially Correct Icon</span>,
  NothingSubmitted: () => <span data-testid="nothing-submitted-icon">Nothing Submitted Icon</span>,
}));

// Mock the Feedback component
jest.mock('../feedback', () => {
  return function Feedback({ feedback, correctness }) {
    return (
      <div data-testid="feedback-content">
        <div>{feedback}</div>
        <div>{correctness}</div>
      </div>
    );
  };
});

describe('response-indicators', () => {
  describe('Correct indicator', () => {
    it('renders correct icon without feedback', () => {
      render(<Correct />);
      expect(screen.getByTestId('correct-icon')).toBeInTheDocument();
    });

    it('renders correct icon with feedback', () => {
      render(<Correct feedback="Great job!" />);
      expect(screen.getByTestId('correct-icon')).toBeInTheDocument();
    });

    it('shows feedback popover when icon is clicked', async () => {
      const user = userEvent.setup();
      render(<Correct feedback="Great job!" />);

      const icon = screen.getByTestId('correct-icon');
      await user.click(icon);

      expect(screen.getByTestId('feedback-content')).toBeInTheDocument();
      expect(screen.getByText('Great job!')).toBeInTheDocument();
      expect(screen.getByText('correct')).toBeInTheDocument();
    });

    it('does not show popover when there is no feedback', async () => {
      const user = userEvent.setup();
      render(<Correct />);

      const icon = screen.getByTestId('correct-icon');
      await user.click(icon);

      expect(screen.queryByTestId('feedback-content')).not.toBeInTheDocument();
    });
  });

  describe('Incorrect indicator', () => {
    it('renders incorrect icon', () => {
      render(<Incorrect />);
      expect(screen.getByTestId('incorrect-icon')).toBeInTheDocument();
    });

    it('shows feedback with incorrect correctness', async () => {
      const user = userEvent.setup();
      render(<Incorrect feedback="Try again" />);

      await user.click(screen.getByTestId('incorrect-icon'));

      expect(screen.getByText('Try again')).toBeInTheDocument();
      expect(screen.getByText('incorrect')).toBeInTheDocument();
    });
  });

  describe('PartiallyCorrect indicator', () => {
    it('renders partially correct icon', () => {
      render(<PartiallyCorrect />);
      expect(screen.getByTestId('partially-correct-icon')).toBeInTheDocument();
    });

    it('shows feedback with partially-correct correctness', async () => {
      const user = userEvent.setup();
      render(<PartiallyCorrect feedback="Almost there" />);

      await user.click(screen.getByTestId('partially-correct-icon'));

      expect(screen.getByText('Almost there')).toBeInTheDocument();
      expect(screen.getByText('partially-correct')).toBeInTheDocument();
    });
  });

  describe('NothingSubmitted indicator', () => {
    it('renders nothing submitted icon', () => {
      render(<NothingSubmitted />);
      expect(screen.getByTestId('nothing-submitted-icon')).toBeInTheDocument();
    });

    it('shows feedback with nothing-submitted correctness', async () => {
      const user = userEvent.setup();
      render(<NothingSubmitted feedback="Please submit an answer" />);

      await user.click(screen.getByTestId('nothing-submitted-icon'));

      expect(screen.getByText('Please submit an answer')).toBeInTheDocument();
      expect(screen.getByText('nothing-submitted')).toBeInTheDocument();
    });
  });
});
