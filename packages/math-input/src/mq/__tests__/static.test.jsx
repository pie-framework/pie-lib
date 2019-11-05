import { shallow } from 'enzyme';
import React from 'react';
import Static from '../static';

const Mathquill = require('@pie-framework/mathquill');

jest.mock('@pie-framework/mathquill', () => ({
  StaticMath: jest.fn().mockReturnValue({
    latex: jest.fn(),
    parseLatex: jest.fn()
  }),
  getInterface: jest.fn().mockReturnThis()
}));

describe('static', () => {
  let w;
  describe('mount', () => {
    beforeEach(() => {
      w = shallow(<Static latex="foo" />, {
        disableLifecycleMethods: true
      });

      w.instance().input = {};
      w.instance().componentDidMount();
    });

    it('set the html', () => {
      expect(Mathquill.getInterface().StaticMath().latex).toBeCalledWith('foo');
    });

    it('calls MQ.StaticMath', () => {
      expect(Mathquill.getInterface().StaticMath).toHaveBeenCalled();
    });
  });

  describe('shouldComponentUpdate', () => {
    it('returns false if there is an error', () => {
      w = shallow(<Static latex="foo" />, { disableLifecycleMethods: true });
      w.instance().mathField = {
        parseLatex: jest.fn(e => {
          throw new Error('boom');
        })
      };
      expect(w.instance().shouldComponentUpdate({ latex: '\\abs{}' })).toEqual(false);
    });

    it('returns true if ??', () => {
      w = shallow(<Static latex="foo" />, { disableLifecycleMethods: true });
      w.instance().mathField = {
        latex: jest.fn().mockReturnValue('foo'),
        parseLatex: jest.fn().mockReturnValue('foo'),
        innerFields: ['field1', 'field2']
      };
      expect(w.instance().shouldComponentUpdate({ latex: '\\abs{}' })).toEqual(true);
    });
  });
});
