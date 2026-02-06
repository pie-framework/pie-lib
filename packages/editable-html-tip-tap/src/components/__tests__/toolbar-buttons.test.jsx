import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Button, MarkButton, RawButton, RawMarkButton } from '../common/toolbar-buttons';

describe('RawButton', () => {
  it('renders without crashing', () => {
    const { container } = render(<RawButton onClick={jest.fn()}>Click me</RawButton>);
    expect(container).toBeInTheDocument();
  });

  it('renders children', () => {
    const { getByText } = render(<RawButton onClick={jest.fn()}>Test Button</RawButton>);
    expect(getByText('Test Button')).toBeInTheDocument();
  });

  it('calls onClick on mouse down', () => {
    const onClick = jest.fn();
    const { getByText } = render(<RawButton onClick={onClick}>Click</RawButton>);
    fireEvent.mouseDown(getByText('Click'));
    expect(onClick).toHaveBeenCalled();
  });

  it('prevents default on mouse down', () => {
    const onClick = jest.fn();
    const { getByText } = render(<RawButton onClick={onClick}>Click</RawButton>);
    const button = getByText('Click');
    const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    button.dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('calls onClick on Enter key press', () => {
    const onClick = jest.fn();
    const { getByText } = render(<RawButton onClick={onClick}>Click</RawButton>);
    fireEvent.keyDown(getByText('Click'), { key: 'Enter' });
    expect(onClick).toHaveBeenCalled();
  });

  it('calls onClick on Space key press', () => {
    const onClick = jest.fn();
    const { getByText } = render(<RawButton onClick={onClick}>Click</RawButton>);
    fireEvent.keyDown(getByText('Click'), { key: ' ' });
    expect(onClick).toHaveBeenCalled();
  });

  it('does not call onClick on other key press', () => {
    const onClick = jest.fn();
    const { getByText } = render(<RawButton onClick={onClick}>Click</RawButton>);
    fireEvent.keyDown(getByText('Click'), { key: 'a' });
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies active style when active is true', () => {
    const { getByText } = render(
      <RawButton onClick={jest.fn()} active={true}>
        Active
      </RawButton>,
    );
    const button = getByText('Active');
    expect(button).toHaveStyle({ color: 'black' });
  });

  it('applies disabled style when disabled is true', () => {
    const { getByText } = render(
      <RawButton onClick={jest.fn()} disabled={true}>
        Disabled
      </RawButton>,
    );
    const button = getByText('Disabled');
    expect(button).toHaveStyle({ cursor: 'not-allowed' });
  });

  it('applies extraStyles when provided', () => {
    const extraStyles = { backgroundColor: 'red' };
    const { getByText } = render(
      <RawButton onClick={jest.fn()} extraStyles={extraStyles}>
        Styled
      </RawButton>,
    );
    const button = getByText('Styled');
    expect(button).toHaveStyle({ backgroundColor: 'red' });
  });

  it('has aria-label when provided', () => {
    const { getByLabelText } = render(
      <RawButton onClick={jest.fn()} ariaLabel="Test Button">
        Button
      </RawButton>,
    );
    expect(getByLabelText('Test Button')).toBeInTheDocument();
  });

  it('has aria-pressed attribute', () => {
    const { getByText } = render(
      <RawButton onClick={jest.fn()} active={true}>
        Button
      </RawButton>,
    );
    expect(getByText('Button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('is focusable with tabIndex', () => {
    const { getByText } = render(<RawButton onClick={jest.fn()}>Button</RawButton>);
    expect(getByText('Button')).toHaveAttribute('tabIndex', '0');
  });
});

describe('Button', () => {
  it('is the same as RawButton', () => {
    expect(Button).toBe(RawButton);
  });
});

describe('RawMarkButton', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <RawMarkButton onToggle={jest.fn()} mark="bold" label="Bold">
        B
      </RawMarkButton>,
    );
    expect(container).toBeInTheDocument();
  });

  it('renders children', () => {
    const { getByText } = render(
      <RawMarkButton onToggle={jest.fn()} mark="bold" label="Bold">
        Bold
      </RawMarkButton>,
    );
    expect(getByText('Bold')).toBeInTheDocument();
  });

  it('calls onToggle with mark on mouse down', () => {
    const onToggle = jest.fn();
    const { getByText } = render(
      <RawMarkButton onToggle={onToggle} mark="italic" label="Italic">
        I
      </RawMarkButton>,
    );
    fireEvent.mouseDown(getByText('I'));
    expect(onToggle).toHaveBeenCalledWith('italic');
  });

  it('prevents default on mouse down', () => {
    const onToggle = jest.fn();
    const { getByText } = render(
      <RawMarkButton onToggle={onToggle} mark="bold" label="Bold">
        B
      </RawMarkButton>,
    );
    const button = getByText('B');
    const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    button.dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('calls onToggle on Enter key press', () => {
    const onToggle = jest.fn();
    const { getByText } = render(
      <RawMarkButton onToggle={onToggle} mark="underline" label="Underline">
        U
      </RawMarkButton>,
    );
    fireEvent.keyDown(getByText('U'), { key: 'Enter' });
    expect(onToggle).toHaveBeenCalledWith('underline');
  });

  it('calls onToggle on Space key press', () => {
    const onToggle = jest.fn();
    const { getByText } = render(
      <RawMarkButton onToggle={onToggle} mark="strike" label="Strike">
        S
      </RawMarkButton>,
    );
    fireEvent.keyDown(getByText('S'), { key: ' ' });
    expect(onToggle).toHaveBeenCalledWith('strike');
  });

  it('does not call onToggle on other key press', () => {
    const onToggle = jest.fn();
    const { getByText } = render(
      <RawMarkButton onToggle={onToggle} mark="bold" label="Bold">
        B
      </RawMarkButton>,
    );
    fireEvent.keyDown(getByText('B'), { key: 'a' });
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('applies active style when active is true', () => {
    const { getByText } = render(
      <RawMarkButton onToggle={jest.fn()} mark="bold" label="Bold" active={true}>
        B
      </RawMarkButton>,
    );
    const button = getByText('B');
    expect(button).toHaveStyle({ color: 'black' });
  });

  it('has aria-label from label prop', () => {
    const { getByLabelText } = render(
      <RawMarkButton onToggle={jest.fn()} mark="bold" label="Toggle Bold">
        B
      </RawMarkButton>,
    );
    expect(getByLabelText('Toggle Bold')).toBeInTheDocument();
  });

  it('has aria-pressed attribute', () => {
    const { getByText } = render(
      <RawMarkButton onToggle={jest.fn()} mark="bold" label="Bold" active={true}>
        B
      </RawMarkButton>,
    );
    expect(getByText('B')).toHaveAttribute('aria-pressed', 'true');
  });

  it('is focusable with tabIndex', () => {
    const { getByText } = render(
      <RawMarkButton onToggle={jest.fn()} mark="bold" label="Bold">
        B
      </RawMarkButton>,
    );
    expect(getByText('B')).toHaveAttribute('tabIndex', '0');
  });
});

describe('MarkButton', () => {
  it('is the same as RawMarkButton', () => {
    expect(MarkButton).toBe(RawMarkButton);
  });
});
