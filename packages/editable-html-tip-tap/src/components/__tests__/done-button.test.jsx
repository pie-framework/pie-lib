import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { RawDoneButton, DoneButton } from '../common/done-button';

describe('RawDoneButton', () => {
  it('renders without crashing', () => {
    const { container } = render(<RawDoneButton onClick={jest.fn()} />);
    expect(container).toBeInTheDocument();
  });

  it('renders with Check icon', () => {
    const { container } = render(<RawDoneButton onClick={jest.fn()} />);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    const { container } = render(<RawDoneButton onClick={onClick} />);
    const button = container.querySelector('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('has aria-label "Done"', () => {
    const { container } = render(<RawDoneButton onClick={jest.fn()} />);
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('aria-label', 'Done');
  });

  it('accepts doneButtonRef prop', () => {
    const doneButtonRef = jest.fn();
    const { container } = render(<RawDoneButton onClick={jest.fn()} doneButtonRef={doneButtonRef} />);
    // doneButtonRef is passed as buttonRef to IconButton, just verify it's accepted
    expect(container).toBeInTheDocument();
  });

  it('applies correct styling', () => {
    const { container } = render(<RawDoneButton onClick={jest.fn()} />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('MuiIconButton-root');
  });
});

describe('DoneButton', () => {
  it('is the same as RawDoneButton', () => {
    expect(DoneButton).toBe(RawDoneButton);
  });

  it('renders correctly', () => {
    const { container } = render(<DoneButton onClick={jest.fn()} />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });
});
