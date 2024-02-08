import React from 'react';
import { mount } from 'enzyme';
import renderMath, { fixMathElement } from '../render-math';
import * as MathJaxModule from '../mathjax-script';
import _ from 'lodash';

jest.mock('../mathjax-script', () => ({
  initializeMathJax: jest.fn(),
}));

describe('render-math', () => {
  beforeEach(() => {
    // Reset the mocks before each test
    jest.resetAllMocks();

    // Mock window.MathJax and window.mathjaxLoadedP
    global.window.MathJax = {
      typeset: jest.fn(),
      texReset: jest.fn(),
      typesetClear: jest.fn(),
      typeset: jest.fn(),
      typesetPromise: jest.fn(() => Promise.resolve()),
    };
    global.window.mathjaxLoadedP = Promise.resolve();
  });

  it('calls initializeMathJax once', () => {
    const div = document.createElement('div');

    // Initialize as undefined for the first call
    global.window.MathJax = undefined;
    global.window.mathjaxLoadedP = undefined;

    // Call renderMath once to initialize MathJax
    renderMath(div);

    // Subsequent calls should not re-initialize MathJax
    global.window.MathJax = {
      typeset: jest.fn(),
      texReset: jest.fn(),
      typesetClear: jest.fn(),
      typeset: jest.fn(),
      typesetPromise: jest.fn(() => Promise.resolve()),
    };
    global.window.mathjaxLoadedP = Promise.resolve();

    // Call renderMath 9 more times
    _.times(9).forEach((i) => renderMath(div));

    expect(MathJaxModule.initializeMathJax).toHaveBeenCalledTimes(1);
  });

  it('wraps the math containing element the right way', () => {
    const wrapper = mount(
      <div>
        <span data-latex="">{'420\\text{ cm}=4.2\\text{ meters}'}</span>
      </div>,
    );
    const spanElem = wrapper.instance();

    fixMathElement(spanElem);

    expect(spanElem.textContent).toEqual('\\(420\\text{ cm}=4.2\\text{ meters}\\)');
  });
});
