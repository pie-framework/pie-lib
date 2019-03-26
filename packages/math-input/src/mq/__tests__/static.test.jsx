import { shallow } from 'enzyme';
import React from 'react';
import Static from '../static';

const Mathquill = require('mathquill');

jest.mock('mathquill', () => ({
  StaticMath: jest.fn().mockReturnValue({
    latex: jest.fn()
  }),
  getInterface: jest.fn().mockReturnThis()
}));

describe('static', () => {
  describe('mount', () => {
    let w;
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
});
