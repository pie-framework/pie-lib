import renderMath from '../render-math';
import { MathJax } from 'mathjax3/mathjax3/mathjax';

jest.mock(
  'mathjax3/mathjax3/mathjax',
  () => ({
    MathJax: {
      document: jest.fn().mockReturnThis(),
      findMath: jest.fn().mockReturnThis(),
      compile: jest.fn().mockReturnThis(),
      getMetrics: jest.fn().mockReturnThis(),
      typeset: jest.fn().mockReturnThis(),
      updateDocument: jest.fn().mockReturnThis(),
      clear: jest.fn().mockReturnThis()
    }
  }),
  {
    virtual: true
  }
);

jest.mock('mathjax3/mathjax3/input/mathml', () => ({
  MathML: jest.fn()
}));

jest.mock('mathjax3/mathjax3/input/tex', () => ({
  TeX: jest.fn()
}));

jest.mock('mathjax3/mathjax3/output/chtml', () => ({
  CHTML: jest.fn()
}));

jest.mock('mathjax3/mathjax3/adaptors/browserAdaptor', () => ({
  browserAdaptor: jest.fn()
}));

jest.mock('mathjax3/mathjax3/handlers/html', () => ({
  RegisterHTMLHandler: jest.fn()
}));

describe.only('render-math', () => {
  it('calls katex render', () => {
    const div = document.createElement('div');
    renderMath(div);
    expect(MathJax.document).toHaveBeenCalledTimes(1);
    expect(MathJax.findMath).toHaveBeenCalledWith({ elements: [div] });
  });

  it('call render math for an array of elements', () => {
    const divOne = document.createElement('div');
    const divTwo = document.createElement('div');
    renderMath([divOne, divTwo]);
    expect(MathJax.document).toHaveBeenCalledTimes(1);
    expect(MathJax.findMath).toHaveBeenCalledWith({
      elements: [divOne, divTwo]
    });
  });
});
