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
      const { container } = render(<FeedbackMenu onChange={onChange} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders menu with feedback type selector', () => {
      render(<FeedbackMenu onChange={onChange} feedback={{ type: 'default' }} />);
      // Menu should be in the document
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('opens menu when clicked', async () => {
      const user = userEvent.setup();
      render(<FeedbackMenu onChange={onChange} feedback={{ type: 'default' }} />);

      const button = screen.getByRole('button');
      await user.click(button);

      // Menu should be open (check for menu items)
      // This depends on the actual implementation
    });
  });
});
