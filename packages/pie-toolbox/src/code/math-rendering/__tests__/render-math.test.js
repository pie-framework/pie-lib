import React from 'react';
import { mount } from 'enzyme';
import renderMath, { fixMathElement } from '../render-math';
import _ from 'lodash';

jest.mock(
  'mathjax-full-pie/js/mathjax',
  () => ({
    mathjax: {
      document: jest.fn().mockReturnThis(),
      findMath: jest.fn().mockReturnThis(),
      compile: jest.fn().mockReturnThis(),
      getMetrics: jest.fn().mockReturnThis(),
      typeset: jest.fn().mockReturnThis(),
      updateDocument: jest.fn().mockReturnThis(),
      clear: jest.fn().mockReturnThis(),
      handlers: {
        handlesDocument: jest.fn().mockReturnThis(),
      },
      handleRetriesFor: jest.fn().mockImplementation((callback) => callback()),
    },
  }),
  {
    virtual: false,
  },
);

jest.mock('mathjax-full-pie/js/input/mathml', () => {
  const mock = jest.fn().mockReturnThis();
  mock.setMmlFactory = jest.fn();
  return {
    MathML: () => mock,
  };
});

jest.mock('mathjax-full-pie/js/input/tex', () => ({
  TeX: jest.fn(),
}));
jest.mock('mathjax-full-pie/js/core/MmlTree/MmlFactory', () => {
  const instance = {
    setMmlFactory: jest.fn(),
    defaultNodes: {},
  };
  return {
    MmlFactory: () => instance,
  };
});

const mockMathInstance = {
  document: jest.fn().mockReturnThis(),
  findMath: jest.fn().mockReturnThis(),
  compile: jest.fn().mockReturnThis(),
  enrich: jest.fn().mockReturnThis(),
  addMenu: jest.fn().mockReturnThis(),
  attachSpeech: jest.fn().mockReturnThis(),
  assistiveMml: jest.fn().mockReturnThis(),
  getMetrics: jest.fn().mockReturnThis(),
  typeset: jest.fn().mockReturnThis(),
  updateDocument: jest.fn().mockReturnValue({
    math: {
      list: undefined,
    },
    clear: jest.fn().mockReturnThis(),
  }),
  clear: jest.fn().mockReturnThis(),
  handlers: {
    handlesDocument: jest.fn().mockReturnThis(),
  },
  handleRetriesFor: jest.fn().mockImplementation((callback) => callback()),
};

const mockHtml = {
  findMath: jest.fn().mockReturnValue(mockMathInstance),
};

const mockEnrichHandlerInstance = {
  create: jest.fn().mockImplementation(() => mockHtml),
};

jest.mock('mathjax-full-pie/js/a11y/semantic-enrich', () => {
  return {
    EnrichHandler: () => mockEnrichHandlerInstance,
  };
});

jest.mock('mathjax-full-pie/js/a11y/assistive-mml', () => {
  return {
    AssistiveMmlHandler: () => {},
  };
});

jest.mock('mathjax-full-pie/js/ui/menu/MenuHandler', () => {
  return {
    MenuHandler: () => {},
  };
});

jest.mock('mathjax-full-pie/js/output/chtml', () => ({
  CHTML: jest.fn(),
}));

jest.mock('mathjax-full-pie/js/adaptors/browserAdaptor', () => ({
  browserAdaptor: jest.fn(),
}));

jest.mock('mathjax-full-pie/js/handlers/html', () => ({
  RegisterHTMLHandler: jest.fn(),
}));

jest.mock('mathjax-full-pie/js/core/MmlTree/SerializedMmlVisitor', () => ({
  SerializedMmlVisitor: jest.fn(),
}));

describe('render-math', () => {
  it('calls classFactory.create once', () => {
    const div = document.createElement('div');

    _.times(10).forEach((i) => renderMath(div));

    expect(mockEnrichHandlerInstance.create).toHaveBeenCalledTimes(1);
  });

  it('calls MathJax render', () => {
    const div = document.createElement('div');

    renderMath(div);
    expect(mockEnrichHandlerInstance.create).toHaveBeenCalledTimes(1);
    expect(mockHtml.findMath).toHaveBeenCalledWith({ elements: [div] });
  });

  it('call render math for an array of elements', () => {
    const divOne = document.createElement('div');
    const divTwo = document.createElement('div');

    renderMath([divOne, divTwo]);

    expect(mockEnrichHandlerInstance.create).toHaveBeenCalledTimes(1);
    expect(mockHtml.findMath).toHaveBeenCalledWith({
      elements: [divOne, divTwo],
    });
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
