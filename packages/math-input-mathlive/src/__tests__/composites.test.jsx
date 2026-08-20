import React from 'react';
import { render } from '@testing-library/react';

import MathInput from '../math-input';
import HorizontalKeypad from '../horizontal-keypad';
import Input from '../mf/input';

/**
 * The pieces that sit between the keypad and the field: how a pressed key is
 * routed into the field, and the legacy `{value,type}` shape math-toolbar
 * consumes.
 */
describe('MathInput.keypadPress routing', () => {
  const withInput = () => {
    const mi = new MathInput({});
    const calls = { write: [], keystroke: [] };

    mi.input = {
      write: (v) => calls.write.push(v),
      keystroke: (v) => calls.keystroke.push(v),
    };

    return { mi, calls };
  };

  it('routes an insert action to write()', () => {
    const { mi, calls } = withInput();

    mi.keypadPress({ latex: '\\pi' });

    expect(calls.write).toEqual(['\\pi']);
    expect(calls.keystroke).toEqual([]);
  });

  it('expands an argument-taking command before writing', () => {
    const { mi, calls } = withInput();

    mi.keypadPress({ command: '\\frac' });

    expect(calls.write).toEqual(['\\frac{#?}{#?}']);
  });

  it('routes a cursor keystroke to keystroke()', () => {
    const { mi, calls } = withInput();

    mi.keypadPress({ keystroke: 'Left' });

    expect(calls.keystroke).toEqual(['moveToPreviousChar']);
    expect(calls.write).toEqual([]);
  });

  it('ignores keys with no action', () => {
    const { mi, calls } = withInput();

    mi.keypadPress({});
    mi.keypadPress({ keystroke: 'Nonsense' });

    expect(calls.write).toEqual([]);
    expect(calls.keystroke).toEqual([]);
  });

  it('is a no-op before the field ref exists', () => {
    const mi = new MathInput({});

    expect(() => mi.keypadPress({ latex: '\\pi' })).not.toThrow();
  });

  it('changeLatex only fires onChange when the value differs', () => {
    const onChange = jest.fn();
    const mi = new MathInput({ latex: 'x', onChange });

    mi.changeLatex('x');
    expect(onChange).not.toHaveBeenCalled();

    mi.changeLatex('y');
    expect(onChange).toHaveBeenCalledWith('y');
  });

  it('tracks focus state', () => {
    const mi = new MathInput({});

    mi.setState = (s) => Object.assign(mi.state, s);
    mi.inputFocus();
    expect(mi.state.focused).toBe(true);

    mi.inputBlur();
    expect(mi.state.focused).toBe(false);
  });
});

describe('HorizontalKeypad legacy {value,type} model', () => {
  const pressed = (key) => {
    const onClick = jest.fn();
    const hk = new HorizontalKeypad({ onClick });

    hk.keypadPress(key);

    return onClick.mock.calls[0][0];
  };

  it('maps a command to {value, type: command}', () => {
    expect(pressed({ command: '\\frac' })).toEqual({ value: '\\frac', type: 'command' });
  });

  it('maps a write to {value}', () => {
    expect(pressed({ write: 'x' })).toEqual({ value: 'x' });
  });

  it('maps a keystroke to {type: cursor}', () => {
    expect(pressed({ keystroke: 'Left' })).toEqual({ type: 'cursor', value: 'Left' });
  });

  it('renders without throwing', () => {
    expect(() => render(<HorizontalKeypad onClick={() => {}} />)).not.toThrow();
  });
});

describe('Input: controlled-value sync and events', () => {
  const withField = () => {
    const input = new Input({});

    input.mathField = {
      value: '',
      getValue: () => input.mathField.value,
      insert(v) {
        input.mathField.value += v;
      },
      executeCommand() {},
      focus() {},
      blur() {},
      addEventListener() {},
      removeEventListener() {},
      remove() {},
    };

    return input;
  };

  it('emits stored-form latex on edit', () => {
    const onChange = jest.fn();
    const input = withField();

    input.props = { onChange };
    input.mathField.value = '\\longdiv{\\placeholder{}}';
    input.onInputEdit();

    // \placeholder is MathLive-internal and must not reach the model
    expect(onChange).toHaveBeenCalledWith('\\longdiv{}');
    expect(input.lastEmitted).toEqual('\\longdiv{}');
  });

  it('does not push a prop echo back into the field', () => {
    const input = withField();

    input.mathField.value = 'x';
    input.lastEmitted = 'x';
    input.props = { latex: 'x' };

    input.componentDidUpdate({ latex: '' });

    expect(input.mathField.value).toEqual('x');
  });

  it('pushes a genuinely new latex prop into the field', () => {
    const input = withField();

    input.mathField.value = 'x';
    input.lastEmitted = 'x';
    input.props = { latex: 'y' };

    input.componentDidUpdate({ latex: 'x' });

    expect(input.mathField.value).toEqual('y');
  });

  it('bridges stored latex on the way in', () => {
    const input = withField();

    input.props = { latex: '\\longdiv{5}' };
    input.componentDidUpdate({ latex: '' });

    // must become native \enclose so the content stays editable
    expect(input.mathField.value).toEqual('\\enclose{longdiv}{5}');
  });

  it('toggles readOnly', () => {
    const input = withField();

    input.props = { readOnly: true };
    input.componentDidUpdate({ readOnly: false });

    expect(input.mathField.readOnly).toBe(true);
  });

  it('clear() empties the field', () => {
    const input = withField();

    input.mathField.value = 'abc';
    expect(input.clear()).toEqual('');
    expect(input.mathField.value).toEqual('');
  });

  it('suppresses Enter so it cannot insert a line break', () => {
    const input = withField();
    const preventDefault = jest.fn();

    input.onKeyDown({ key: 'Enter', preventDefault });
    expect(preventDefault).toHaveBeenCalled();

    preventDefault.mockClear();
    input.onKeyDown({ key: 'a', preventDefault });
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('componentDidUpdate is safe before the field exists', () => {
    const input = new Input({ latex: 'x' });

    expect(() => input.componentDidUpdate({ latex: '' })).not.toThrow();
  });
});
