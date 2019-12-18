import { mathjax } from 'mathjax-full/js/mathjax';
import { MathML } from 'mathjax-full/js/input/mathml';
import { TeX } from 'mathjax-full/js/input/tex';

import { CHTML } from 'mathjax-full/js/output/chtml';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';

if (typeof window !== 'undefined') {
  const { browserAdaptor } = require('mathjax-full/js/adaptors/browserAdaptor');
  RegisterHTMLHandler(browserAdaptor());
}
import pkg from '../package.json';

import debug from 'debug';
import { wrapMath, unWrapMath } from './normalization';

const log = debug('pie-lib:math-rendering');

const getGlobal = () => {
  const key = `${pkg.name}@${pkg.version.split('.')[0]}`;

  if (typeof window !== 'undefined') {
    if (!window[key]) {
      window[key] = {};
    }
    return window[key];
  } else {
    return {};
  }
};

let instance = getGlobal().instance;

/** Add temporary support for a global singleDollar override
 *  <code>
 *   // This will enable single dollar rendering
 *   window.pie = window.pie || {};
 *   window.pie.mathRendering =  {useSingleDollar: true };
 *  </code>
 */
const defaultOpts = () => getGlobal().opts || {};

export const fixMathElement = element => {
  let property = 'innerText';

  if (element.textContent) {
    property = 'textContent';
  }

  if (element[property]) {
    element[property] = wrapMath(unWrapMath(element[property]).unwrapped);
  }
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
  const fontURL = `https://unpkg.com/mathjax-full@${mathjax.version}/ts/output/chtml/fonts/tex-woff-v2`;
  const htmlConfig = { fontURL };
  const html = mathjax.document(document, {
    InputJax: [new TeX(texConfig), new MathML(mmlConfig)],
    OutputJax: new CHTML(htmlConfig)
  });

  return {
    version: mathjax.version,
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
  const currentInstance = getGlobal().instance;

  fixMathElements();

  if (currentInstance) {
    instance = currentInstance;
  } else {
    instance = bootstrap(renderOpts);
    getGlobal().instance = instance;
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
