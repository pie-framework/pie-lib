import { shallow } from 'enzyme';
import React from 'react';
import { Input } from '../input';

describe('Input', () => {
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
    const out = shallow(<Input {...props} />);

    out.mathField = () => out.instance().mathField;
    return out;
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
    });
    describe('clear', () => {
      it('calls latex', () => {
        w.instance().clear();
        expect(w.mathField().latex).toHaveBeenCalledWith('');
      });
    });
    describe('blur', () => {
      it('calls blur', () => {
        w.instance().blur();
        expect(w.mathField().blur).toHaveBeenCalled();
      });
    });
    describe('focus', () => {
      it('calls focus', () => {
        w.instance().focus();
        expect(w.mathField().focus).toHaveBeenCalled();
      });
    });
    describe('command', () => {
      it('calls cmd', () => {
        w.instance().command('foo');
        expect(w.mathField().cmd).toHaveBeenCalledWith('foo');
      });
      it('calls cmd if passed an array', () => {
        w.instance().command(['foo', 'bar']);
        expect(w.mathField().cmd).toHaveBeenCalledWith('foo');
        expect(w.mathField().cmd).toHaveBeenCalledWith('bar');
      });
    });

    describe('keystroke', () => {
      beforeEach(() => {
        w.instance().keystroke('9');
      });
      it('calls keystroke', () =>
        expect(w.mathField().keystroke).toHaveBeenCalledWith('9'));
      it('calls focus', () => expect(w.mathField().focus).toHaveBeenCalled());
      it('calls latex', () => expect(w.mathField().latex).toHaveBeenCalled());
    });

    describe('write', () => {
      beforeEach(() => {
        w.instance().write('hi');
      });
      it('calls write', () =>
        expect(w.mathField().write).toHaveBeenCalledWith('hi'));
      it('calls focus', () => expect(w.mathField().focus).toHaveBeenCalled());
      it('calls latex', () => expect(w.mathField().latex).toHaveBeenCalled());
    });

    describe('onInputEdit', () => {
      it('calls onChange', () => {
        w = wrapper();
        w.mathField().latex.mockReturnValue('foo');
        w.instance().onInputEdit();
        expect(onChange).toHaveBeenCalledWith('foo');
      });
    });
  });
});
