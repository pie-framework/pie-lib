import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertDialog from '../alert-dialog';

describe('AlertDialog Component', () => {
  const onClose = jest.fn();
  const onConfirm = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
    onConfirm.mockClear();
  });

  describe('Rendering when open', () => {
    it('should render dialog when open is true', () => {
      render(<AlertDialog open={true} title="Confirm" text="Are you sure?" onClose={onClose} onConfirm={onConfirm} />);

      expect(screen.getByText('Confirm')).toBeInTheDocument();
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });

    it('should not render dialog when open is false', () => {
      const { container } = render(
        <AlertDialog open={false} title="Confirm" text="Are you sure?" onClose={onClose} onConfirm={onConfirm} />,
      );

      const dialogs = container.querySelectorAll('[role="dialog"]');
      expect(dialogs.length).toBe(0);
    });
  });

  describe('Title and Text', () => {
    it('should handle both title and text', () => {
      render(
        <AlertDialog
          open={true}
          title="Important"
          text="This is an important message"
          onClose={onClose}
          onConfirm={onConfirm}
        />,
      );

      expect(screen.getByText('Important')).toBeInTheDocument();
      expect(screen.getByText('This is an important message')).toBeInTheDocument();
    });

    it('should handle text as object', () => {
      const textObj = <div>Rich text content</div>;
      render(<AlertDialog open={true} title="Rich Content" text={textObj} onClose={onClose} onConfirm={onConfirm} />);

      expect(screen.getByText('Rich text content')).toBeInTheDocument();
    });
  });

  describe('Buttons', () => {
    it('should render close button when onClose is provided', () => {
      render(<AlertDialog open={true} title="Dialog" text="Content" onClose={onClose} onConfirm={onConfirm} />);

      expect(screen.getByRole('button', { name: 'CANCEL' })).toBeInTheDocument();
    });

    it('should render confirm button when onConfirm is provided', () => {
      render(<AlertDialog open={true} title="Dialog" text="Content" onClose={onClose} onConfirm={onConfirm} />);

      expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    });

    it('should have default button text', () => {
      render(<AlertDialog open={true} title="Dialog" text="Content" onClose={onClose} onConfirm={onConfirm} />);

      expect(screen.getByRole('button', { name: 'CANCEL' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    });
  });

  describe('User interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<AlertDialog open={true} title="Dialog" text="Content" onClose={onClose} onConfirm={onConfirm} />);

      const closeButton = screen.getByRole('button', { name: 'CANCEL' });
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });

    it('should call onConfirm when confirm button is clicked', async () => {
      const user = userEvent.setup();
      render(<AlertDialog open={true} title="Dialog" text="Content" onClose={onClose} onConfirm={onConfirm} />);

      const confirmButton = screen.getByRole('button', { name: 'OK' });
      await user.click(confirmButton);

      expect(onConfirm).toHaveBeenCalled();
    });
  });

  describe('Focus management', () => {
    it('should have autoFocus on confirm button by default', () => {
      render(<AlertDialog open={true} title="Dialog" text="Content" onClose={onClose} onConfirm={onConfirm} />);

      const confirmButton = screen.getByRole('button', { name: 'OK' });
      expect(confirmButton).toBeInTheDocument();
    });

    it('should disable auto focus when disableAutoFocus is true', () => {
      render(
        <AlertDialog
          open={true}
          title="Dialog"
          text="Content"
          onClose={onClose}
          onConfirm={onConfirm}
          disableAutoFocus={true}
        />,
      );

      expect(screen.getByText('Dialog')).toBeInTheDocument();
    });

    it('should disable enforce focus when disableEnforceFocus is true', () => {
      render(
        <AlertDialog
          open={true}
          title="Dialog"
          text="Content"
          onClose={onClose}
          onConfirm={onConfirm}
          disableEnforceFocus={true}
        />,
      );

      expect(screen.getByText('Dialog')).toBeInTheDocument();
    });

    it('should disable restore focus when disableRestoreFocus is true', () => {
      render(
        <AlertDialog
          open={true}
          title="Dialog"
          text="Content"
          onClose={onClose}
          onConfirm={onConfirm}
          disableRestoreFocus={true}
        />,
      );

      expect(screen.getByText('Dialog')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle very long title', () => {
      const longTitle = 'This is a very long title that should wrap properly in the dialog';
      render(<AlertDialog open={true} title={longTitle} text="Content" onClose={onClose} onConfirm={onConfirm} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle very long text', () => {
      const longText = 'This is a very long text that should wrap properly in the dialog. '.repeat(10);
      render(<AlertDialog open={true} title="Dialog" text={longText} onClose={onClose} onConfirm={onConfirm} />);

      expect(screen.getByText(new RegExp(longText.slice(0, 50)))).toBeInTheDocument();
    });

    it('should handle only close callback', () => {
      render(<AlertDialog open={true} title="Close Only" text="Content" onClose={onClose} />);

      expect(screen.getByRole('button', { name: 'CANCEL' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'OK' })).not.toBeInTheDocument();
    });

    it('should handle only confirm callback', () => {
      render(<AlertDialog open={true} title="Confirm Only" text="Content" onConfirm={onConfirm} />);

      expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'CANCEL' })).not.toBeInTheDocument();
    });
  });
});
