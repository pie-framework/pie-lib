import { classObject } from '../../../__tests__/utils';
import { RawMarkButton, RawButton } from '../toolbar-buttons';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock IconButton
jest.mock('@mui/material/IconButton', () => {
  return function IconButton({ children, onClick, className }) {
    return (
      <button onClick={onClick} className={className} data-testid="icon-button">
        {children}
      </button>
    );
  };
});

describe('Button', () => {
  const onClick = jest.fn();

  beforeEach(() => {
    onClick.mockClear();
  });

  it('renders with children', () => {
    const classes = classObject('root');
    render(
      <RawButton onClick={onClick} classes={classes}>
        children
      </RawButton>,
    );

    expect(screen.getByText('children')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const classes = classObject('root');
    render(
      <RawButton onClick={onClick} classes={classes}>
        children
      </RawButton>,
    );

    const button = screen.getByTestId('icon-button');
    await user.click(button);

    expect(onClick).toHaveBeenCalled();
  });
});

describe('MarkButton', () => {
  const classes = classObject('button', 'root', 'active');
  const onToggle = jest.fn();

  beforeEach(() => {
    onToggle.mockClear();
  });

  it('renders when not active', () => {
    render(
      <RawMarkButton mark={'i'} onToggle={onToggle} active={false} classes={classes}>
        children
      </RawMarkButton>,
    );

    expect(screen.getByText('children')).toBeInTheDocument();
    const button = screen.getByTestId('icon-button');
    expect(button).not.toHaveClass('active');
  });

  it('renders when active', () => {
    render(
      <RawMarkButton mark={'i'} onToggle={onToggle} active={true} classes={classes}>
        children
      </RawMarkButton>,
    );

    expect(screen.getByText('children')).toBeInTheDocument();
    const button = screen.getByTestId('icon-button');
    expect(button).toHaveClass('active');
  });

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup();
    render(
      <RawMarkButton mark={'i'} onToggle={onToggle} active={false} classes={classes}>
        children
      </RawMarkButton>,
    );

    const button = screen.getByTestId('icon-button');
    await user.click(button);

    expect(onToggle).toHaveBeenCalled();
  });
});
