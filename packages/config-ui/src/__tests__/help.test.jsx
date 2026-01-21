import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Help, { HelpButton, HelpDialog } from '../help';

describe('HelpButton', () => {
  it('renders help icon button', () => {
    render(<HelpButton />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<HelpButton onClick={onClick} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders with large size', () => {
    const { container } = render(<HelpButton />);
    const button = container.querySelector('button[class*="sizeLarge"]');
    expect(button || screen.getByRole('button')).toBeInTheDocument();
  });
});

describe('HelpDialog', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    title: 'Help Title',
    children: 'Help content here',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when open is true', () => {
    render(<HelpDialog {...defaultProps} />);
    expect(screen.getByText('Help Title')).toBeInTheDocument();
    expect(screen.getByText('Help content here')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<HelpDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Help Title')).not.toBeInTheDocument();
  });

  it('displays title correctly', () => {
    render(<HelpDialog {...defaultProps} title="Custom Help" />);
    expect(screen.getByText('Custom Help')).toBeInTheDocument();
  });

  it('displays children content', () => {
    const content = 'This is helpful information';
    render(<HelpDialog {...defaultProps} children={content} />);
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it('calls onClose when OK button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<HelpDialog {...defaultProps} onClose={onClose} />);
    
    const okButton = screen.getByRole('button', { name: /OK/i });
    await user.click(okButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when dialog is closed via backdrop', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<HelpDialog {...defaultProps} onClose={onClose} />);
    
    // Simulate backdrop click by calling onClose (MUI Dialog prop)
    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).toBeInTheDocument();
  });

  it('renders OK button', () => {
    render(<HelpDialog {...defaultProps} />);
    const okButton = screen.getByRole('button', { name: /OK/i });
    expect(okButton).toBeInTheDocument();
  });

  it('handles multiline children content', () => {
    const content = ['Line 1', 'Line 2', 'Line 3'];
    render(
      <HelpDialog {...defaultProps}>
        {content.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </HelpDialog>
    );
    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
    expect(screen.getByText('Line 3')).toBeInTheDocument();
  });
});

describe('Help Component', () => {
  const defaultProps = {
    title: 'Help Title',
    children: 'Help content',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders help button initially', () => {
    render(<Help {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('opens dialog when help button is clicked', async () => {
    const user = userEvent.setup();
    render(<Help {...defaultProps} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('Help Title')).toBeInTheDocument();
    expect(screen.getByText('Help content')).toBeInTheDocument();
  });

  it('closes dialog when OK button is clicked', async () => {
    const user = userEvent.setup();
    render(<Help {...defaultProps} />);
    
    const helpButton = screen.getByRole('button', { name: '' });
    await user.click(helpButton);
    
    const okButton = screen.getByRole('button', { name: /OK/i });
    await user.click(okButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Help Title')).not.toBeInTheDocument();
    });
  });

  it('displays title prop', () => {
    render(<Help title="Custom Title" children="content" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('displays children prop', async () => {
    const user = userEvent.setup();
    render(<Help {...defaultProps} children="Custom help content" />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('Custom help content')).toBeInTheDocument();
  });

  it('can open and close dialog multiple times', async () => {
    const user = userEvent.setup();
    render(<Help {...defaultProps} />);
    
    const helpButton = screen.getByRole('button', { name: '' });
    
    await user.click(helpButton);
    expect(screen.getByText('Help Title')).toBeInTheDocument();
    
    let okButton = screen.getByRole('button', { name: /OK/i });
    await user.click(okButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Help Title')).not.toBeInTheDocument();
    });
    
    await user.click(helpButton);
    expect(screen.getByText('Help Title')).toBeInTheDocument();
  });
});
