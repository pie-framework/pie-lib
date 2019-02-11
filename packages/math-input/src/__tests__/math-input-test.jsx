import { shallow } from 'enzyme';
import React from 'react';
import { MathInput } from '../math-input';

describe('MathInput', () => {
  let w;
  let onChange;

  beforeEach(() => {
    onChange = jest.fn();
  });
  const wrapper = extras => {
    const defaults = {
      classes: {},
      className: 'className',
      onChange
    };
    const props = { ...defaults, ...extras };
    return shallow(<MathInput {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {
    beforeEach(() => {
      w = wrapper();
      w.instance().input = {
        write: jest.fn(),
        command: jest.fn(),
        keystroke: jest.fn()
      };
    });
    describe('keypadPress', () => {
      it('calls input.write for latex', () => {
        w.instance().keypadPress({ latex: 'latex' });
        expect(w.instance().input.write).toHaveBeenLastCalledWith('latex');
      });
      it('calls input.write for write', () => {
        w.instance().keypadPress({ write: 'write' });
        expect(w.instance().input.write).toHaveBeenLastCalledWith('write');
      });
      it('calls input.command for command', () => {
        w.instance().keypadPress({ command: 'cmd' });
        expect(w.instance().input.command).toHaveBeenLastCalledWith('cmd');
      });
      it('calls input.keystroke for keystroke', () => {
        w.instance().keypadPress({ keystroke: 'k' });
        expect(w.instance().input.keystroke).toHaveBeenLastCalledWith('k');
      });
    });
  });

  describe('changeLatex', () => {
    it('calls onChange', () => {
      w = wrapper();
      w.instance().changeLatex('new-latex');
      expect(onChange).toHaveBeenCalledWith('new-latex');
    });
    it('does not call onChange if it is the same as the existing latex', () => {
      w = wrapper();
      w.setProps({ latex: 'new-latex' });
      w.instance().changeLatex('new-latex');
      expect(onChange).not.toHaveBeenCalledWith('new-latex');
    });
  });

  describe('inputFocus', () => {
    it('sets state', () => {
      w = wrapper();
      w.instance().inputFocus();
      expect(w.state().focused).toBe(true);
    });
  });
  describe('inputBlur', () => {
    it('sets state', () => {
      w = wrapper();
      w.instance().inputFocus();
      w.instance().inputBlur();
      expect(w.state().focused).toBe(false);
    });
  });
});
