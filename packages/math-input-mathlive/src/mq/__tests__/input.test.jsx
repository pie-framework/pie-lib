import * as React from 'react';
import { render } from '@testing-library/react';
import { Input } from '../input';

describe('Input (MathLive)', () => {
  it('renders a host span', () => {
    const { container } = render(<Input className="foo" />);
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('foo');
  });

  it('mounts a MathfieldElement child into the host', () => {
    const { container } = render(<Input latex={'\\frac{1}{2}'} />);
    const field = container.querySelector('math-field');
    expect(field).not.toBeNull();
  });

  it('sets the internal field value from the latex prop', () => {
    let inputRef;
    render(<Input latex={'\\frac{1}{2}'} ref={(r) => (inputRef = r)} />);
    expect(inputRef.mathField).toBeDefined();
    expect(inputRef.mathField._value).toBe('\\frac{1}{2}');
  });

  it('write() delegates to insert', () => {
    let inputRef;
    render(<Input ref={(r) => (inputRef = r)} />);
    const mockInsert = jest.fn();
    inputRef.mathField.insert = mockInsert;
    inputRef.write('\\pi');
    expect(mockInsert).toHaveBeenCalledWith('\\pi', { format: 'latex', focus: true });
  });

  it('clear() empties the field value', () => {
    let inputRef;
    render(<Input latex={'x'} ref={(r) => (inputRef = r)} />);
    inputRef.clear();
    expect(inputRef.getLatex()).toBe('');
  });

  it('emits onChange when the mathfield fires an input event', () => {
    const onChange = jest.fn();
    let inputRef;
    render(<Input onChange={onChange} ref={(r) => (inputRef = r)} />);
    inputRef.mathField._value = 'x';
    inputRef.mathField.dispatchEvent(new Event('input'));
    expect(onChange).toHaveBeenCalledWith('x');
  });
});
