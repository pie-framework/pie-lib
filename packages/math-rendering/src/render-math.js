import { MathJax } from 'mathjax3/mathjax3/mathjax';
import { MathML } from 'mathjax3/mathjax3/input/mathml';
import { TeX } from 'mathjax3/mathjax3/input/tex';

import { CHTML } from 'mathjax3/mathjax3/output/chtml';
import { RegisterHTMLHandler } from 'mathjax3/mathjax3/handlers/html';

const MATHJAX_VERSION = '3.0.0-beta.4';

if (typeof window !== 'undefined') {
  const { browserAdaptor } = require('mathjax3/mathjax3/adaptors/browserAdaptor');
  RegisterHTMLHandler(browserAdaptor());
}

import debug from 'debug';
import { wrapMath, unWrapMath } from './normalization';

const log = debug('pie-lib:math-rendering');

let instance = null;

/** Add temporary support for a global singleDollar override
 *  <code>
 *   // This will enable single dollar rendering
 *   window.pie = window.pie || {};
 *   window.pie.mathRendering =  {useSingleDollar: true };
 *  </code>
 */
const defaultOpts = () => {
  if (typeof window !== 'undefined') {
    window.pie = window.pie || {};
    return window.pie.mathRendering || {};
  } else {
    return {};
  }
};

export const fixMathElement = element => {
  let property = 'innerText';

  if (element.textContent) {
    property = 'textContent';
  }

  element[property] = wrapMath(unWrapMath(element[property]).unwrapped);
};

export const fixMathElements = () => {
  const mathElements = document.querySelectorAll('[data-latex]');

  mathElements.forEach(item => fixMathElement(item));
};

const bootstrap = opts => {
  if (typeof window === 'undefined') {
    return { Typeset: () => ({}) };
  }

  opts = opts || defaultOpts();

  if (opts.useSingleDollar) {
    // eslint-disable-next-line
    console.warn('[math-rendering] using $ is not advisable, please use $$..$$ or \\(...\\)');
  }

  const texConfig = opts.useSingleDollar
    ? { inlineMath: [['$', '$'], ['\\(', '\\)']], processEscapes: true }
    : {};

  const mmlConfig = {};
  const fontURL = `https://unpkg.com/mathjax3@${MATHJAX_VERSION}/mathjax3-ts/output/chtml/fonts/tex-woff-v2`;
  const htmlConfig = { fontURL };

  fixMathElements();

  const html = MathJax.document(document, {
    InputJax: [new TeX(texConfig), new MathML(mmlConfig)],
    OutputJax: new CHTML(htmlConfig)
  });

  return {
    version: MathJax.version,
    html: html,

    Typeset: function(...elements) {
      this.html
        .findMath(elements.length ? { elements } : {})
        .compile()
        .getMetrics()
        .typeset()
        .updateDocument()
        .clear();
    }
  };
};

const renderMath = (el, renderOpts) => {
  if (!instance) {
    instance = bootstrap(renderOpts);
  }

  if (!el) {
    log('el is undefined');
    return;
  }

  if (el instanceof Element) {
    instance.Typeset(el);
  } else if (el.length) {
    const arr = Array.from(el);
    instance.Typeset(...arr);
  }
};

export default renderMath;
