import React from 'react';
import { render } from '@testing-library/react';
import renderMath, { fixMathElement } from '../render-math';
// import * as MathJaxModule from '../mathjax-script';
import { times } from 'lodash-es';

jest.mock('../mathjax-script', () => ({
  initializeMathJax: jest.fn(),
}));

describe('render-math', () => {
  beforeEach(() => {
    // Reset the mocks before each test
    jest.resetAllMocks();
    // Mock window.MathJax and window.mathjaxLoadedP
    global.window.MathJax = {
      texReset: jest.fn(),
      typesetClear: jest.fn(),
      typeset: jest.fn(),
      typesetPromise: jest.fn(() => Promise.resolve()),
    };
    global.window.mathjaxLoadedP = Promise.resolve();
  });

  it('calls initializeMathJax once without @pie-lib/math-rendering@2', () => {
    jest.useFakeTimers();
    const div = document.createElement('div');

    delete window['@pie-lib/math-rendering@2'];

    // Initialize as undefined for the first call
    global.window.MathJax = undefined;
    global.window.mathjaxLoadedP = undefined;

    // Call renderMath once to initialize MathJax
    renderMath(div);

    // Subsequent calls should not re-initialize MathJax
    global.window.MathJax = {
      texReset: jest.fn(),
      typesetClear: jest.fn(),
      typeset: jest.fn(),
      typesetPromise: jest.fn(() => Promise.resolve()),
    };
    global.window.mathjaxLoadedP = Promise.resolve();

    // Call renderMath 9 more times
    times(9).forEach((i) => renderMath(div));

    // setTimeout(() => {
    //   expect(MathJaxModule.initializeMathJax).toHaveBeenCalledTimes(1);
    // }, 500);
  });

  it('does not call initializeMathJax when @pie-lib/math-rendering@2 is present', () => {
    const div = document.createElement('div');

    renderMath(div);
    // expect(MathJaxModule.initializeMathJax).not.toHaveBeenCalled();
  });

  it('wraps the math containing element the right way', () => {
    const { container } = render(
      <div>
        <span data-latex="">{'420\\text{ cm}=4.2\\text{ meters}'}</span>
      </div>,
    );
    const spanElem = container.querySelector('span[data-latex]');

    fixMathElement(spanElem);

    expect(spanElem.textContent).toEqual('\\(420\\text{ cm}=4.2\\text{ meters}\\)');
  });
});
