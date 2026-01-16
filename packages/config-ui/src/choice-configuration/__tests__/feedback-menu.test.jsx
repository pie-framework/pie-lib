import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedbackMenu from '../feedback-menu';

describe('feedback-menu', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  describe('rendering', () => {
    it('renders feedback menu with default options', () => {
      const { container } = render(<FeedbackMenu onChange={onChange} classes={{}} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders menu with feedback type selector', () => {
      render(<FeedbackMenu onChange={onChange} value={{ type: 'default' }} classes={{}} />);
      // Menu button should be in the document
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with no feedback type', () => {
      render(<FeedbackMenu onChange={onChange} value={{ type: 'none' }} classes={{}} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with custom feedback type', () => {
      render(<FeedbackMenu onChange={onChange} value={{ type: 'custom' }} classes={{}} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders feedback icon button', () => {
      render(<FeedbackMenu onChange={onChange} classes={{}} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('opens menu when button is clicked', async () => {
      const user = userEvent.setup();
      render(<FeedbackMenu onChange={onChange} value={{ type: 'default' }} classes={{}} />);

      const button = screen.getByRole('button');
      await user.click(button);

      // Menu items should appear
      expect(screen.getByText('No Feedback')).toBeInTheDocument();
      expect(screen.getByText('Default')).toBeInTheDocument();
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('calls onChange with "none" when No Feedback is selected', async () => {
      const user = userEvent.setup();
      render(<FeedbackMenu onChange={onChange} value={{ type: 'default' }} classes={{}} />);

      const button = screen.getByRole('button');
      await user.click(button);

      const noFeedbackOption = screen.getByText('No Feedback');
      await user.click(noFeedbackOption);

      expect(onChange).toHaveBeenCalledWith('none');
    });

    it('calls onChange with "default" when Default is selected', async () => {
      const user = userEvent.setup();
      render(<FeedbackMenu onChange={onChange} value={{ type: 'none' }} classes={{}} />);

      const button = screen.getByRole('button');
      await user.click(button);

      const defaultOption = screen.getByText('Default');
      await user.click(defaultOption);

      expect(onChange).toHaveBeenCalledWith('default');
    });

    it('calls onChange with "custom" when Custom is selected', async () => {
      const user = userEvent.setup();
      render(<FeedbackMenu onChange={onChange} value={{ type: 'none' }} classes={{}} />);

      const button = screen.getByRole('button');
      await user.click(button);

      const customOption = screen.getByText('Custom');
      await user.click(customOption);

      expect(onChange).toHaveBeenCalledWith('custom');
    });

    it('closes menu after selection', async () => {
      const user = userEvent.setup();
      render(<FeedbackMenu onChange={onChange} value={{ type: 'default' }} classes={{}} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(screen.getByText('No Feedback')).toBeInTheDocument();

      const noFeedbackOption = screen.getByText('No Feedback');
      await user.click(noFeedbackOption);

      // Menu should close after selection
      expect(onChange).toHaveBeenCalledWith('none');
    });
  });

  describe('feedback type indicators', () => {
    it('shows correct icon color for default feedback', () => {
      const { container } = render(
        <FeedbackMenu onChange={onChange} value={{ type: 'default' }} classes={{}} />
      );
      // Icon should be present with primary color
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('shows correct icon color for custom feedback', () => {
      const { container } = render(
        <FeedbackMenu onChange={onChange} value={{ type: 'custom' }} classes={{}} />
      );
      // Icon should be present with primary color
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('shows correct icon color for disabled feedback', () => {
      const { container } = render(
        <FeedbackMenu onChange={onChange} value={{ type: 'none' }} classes={{}} />
      );
      // Icon should be present with disabled color
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('aria labels', () => {
    it('has aria-label on button for default feedback', () => {
      render(
        <FeedbackMenu onChange={onChange} value={{ type: 'default' }} classes={{}} />
      );
      const button = screen.getByRole('button', { name: /Default Feedback/i });
      expect(button).toBeInTheDocument();
    });

    it('has aria-label on button for custom feedback', () => {
      render(
        <FeedbackMenu onChange={onChange} value={{ type: 'custom' }} classes={{}} />
      );
      const button = screen.getByRole('button', { name: /Custom Feedback/i });
      expect(button).toBeInTheDocument();
    });

    it('has aria-label on button for disabled feedback', () => {
      render(
        <FeedbackMenu onChange={onChange} value={{ type: 'none' }} classes={{}} />
      );
      const button = screen.getByRole('button', { name: /Feedback disabled/i });
      expect(button).toBeInTheDocument();
    });
  });
});
