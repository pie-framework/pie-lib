import { EditorAndPad } from '../editor-and-pad';
import { shallow } from 'enzyme';
import React from 'react';

jest.mock('@pie-lib/math-input', () => ({
  HorizontalKeypad: () => <div>HorizontalKeypad</div>
}));

jest.mock('../mathquill/editor', () => () => <div>MockEditor</div>);

describe('EditorAndPad', () => {
  let onChange;

  beforeEach(() => {
    onChange = jest.fn();
  });

  const mkWrapper = extras => {
    const props = {
      latex: '\\frac{1}{2}',
      onChange,
      classes: {},
      ...extras
    };

    const w = shallow(<EditorAndPad {...props} />);
    w.instance().input = {
      clear: jest.fn(),
      command: jest.fn(),
      keystroke: jest.fn(),
      write: jest.fn()
    };
    return w;
  };

  describe('snapshot', () => {
    it('renders', () => {
      const w = mkWrapper();

      expect(w).toMatchSnapshot();
    });
  });

  describe('onClick', () => {
    let w;

    beforeEach(() => {
      w = mkWrapper();
    });

    it('calls clear', () => {
      const i = w.instance();
      i.onClick({ value: 'clear' });
      expect(i.input.clear).toHaveBeenCalled();
    });

    it('calls command', () => {
      const i = w.instance();
      i.onClick({ type: 'command', value: 'foo' });
      expect(i.input.command).toHaveBeenCalledWith('foo');
    });

    it('calls keystroke', () => {
      const i = w.instance();
      i.onClick({ type: 'cursor', value: '<' });
      expect(i.input.keystroke).toHaveBeenCalledWith('<');
    });

    it('calls keystroke', () => {
      const i = w.instance();
      i.onClick({ type: 'other', value: 'write data' });
      expect(i.input.write).toHaveBeenCalledWith('write data');
    });
  });
});
