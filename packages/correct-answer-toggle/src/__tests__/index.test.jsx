import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CorrectAnswerToggle } from '../index';

describe('CorrectAnswerToggle', () => {
  let onToggle;

  const renderComponent = (toggled = true, msgs = {}) => {
    return render(
      <CorrectAnswerToggle
        show={true}
        toggled={toggled}
        onToggle={onToggle}
        hideMessage={msgs.hide}
        showMessage={msgs.show}
      />,
    );
  };

  beforeEach(() => {
    onToggle = jest.fn();
  });

  describe('rendering', () => {
    it('shows hide message when toggled is true', () => {
      renderComponent(true);
      expect(screen.getByText('Hide correct answer')).toBeInTheDocument();
    });

    it('shows show message when toggled is false', () => {
      renderComponent(false);
      expect(screen.getByText('Show correct answer')).toBeInTheDocument();
    });

    it('displays custom hide message', () => {
      renderComponent(true, { hide: 'hide!' });
      expect(screen.getByText('hide!')).toBeInTheDocument();
    });

    it('displays custom show message', () => {
      renderComponent(false, { show: 'show!' });
      expect(screen.getByText('show!')).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('calls onToggle with false when clicked while toggled', async () => {
      const user = userEvent.setup();
      renderComponent(true);

      const button = screen.getByText('Hide correct answer');
      await user.click(button);

      expect(onToggle).toHaveBeenCalledWith(false);
    });

    it('calls onToggle with true when clicked while not toggled', async () => {
      const user = userEvent.setup();
      renderComponent(false);

      const button = screen.getByText('Show correct answer');
      await user.click(button);

      expect(onToggle).toHaveBeenCalledWith(true);
    });

    it('toggles correctly after prop update', async () => {
      const user = userEvent.setup();
      const { rerender } = renderComponent(true);

      // First click - toggled is true, should call with false
      await user.click(screen.getByText('Hide correct answer'));
      expect(onToggle).toHaveBeenCalledWith(false);

      // Simulate prop update to toggled=false
      onToggle.mockClear();
      rerender(
        <CorrectAnswerToggle
          show={true}
          toggled={false}
          onToggle={onToggle}
        />
      );

      // Second click - toggled is false, should call with true
      await user.click(screen.getByText('Show correct answer'));
      expect(onToggle).toHaveBeenCalledWith(true);
    });
  });
});
