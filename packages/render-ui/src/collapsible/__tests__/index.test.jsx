import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Collapsible } from '../index';

describe('collapsible', () => {
  describe('rendering', () => {
    it('renders collapsible component', () => {
      const { container } = render(<Collapsible classes={{}} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with default collapsed state', () => {
      render(<Collapsible classes={{}} labels={{ hidden: 'Show More', visible: 'Show Less' }} />);
      // Should show "Show More" when collapsed
      expect(screen.queryByText('Show More')).toBeInTheDocument();
    });

    it('renders children when expanded', async () => {
      const user = userEvent.setup();
      render(
        <Collapsible classes={{}}>
          <div>Test Content</div>
        </Collapsible>,
      );

      // Initially collapsed, children not visible
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument();

      // Click to expand
      const toggleButton = screen.getByText('Show');
      await user.click(toggleButton);

      // Wait for expansion animation and check children are visible
      await screen.findByText('Test Content');
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });
});
