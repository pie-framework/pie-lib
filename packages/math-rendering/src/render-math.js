import { mathjax } from 'mathjax-full/js/mathjax';
import { MathML } from 'mathjax-full/js/input/mathml';
import { TeX } from 'mathjax-full/js/input/tex';

import { CHTML } from 'mathjax-full/js/output/chtml';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { browserAdaptor } from 'mathjax-full/js/adaptors/browserAdaptor';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';

if (typeof window !== 'undefined') {
  RegisterHTMLHandler(browserAdaptor());
}

import pkg from '../package.json';
import { mmlNodes, chtmlNodes } from './mstack';
import debug from 'debug';
import { wrapMath, unWrapMath } from './normalization';
import { MmlFactory } from 'mathjax-full/js/core/MmlTree/MmlFactory';
import { CHTMLWrapperFactory } from 'mathjax-full/js/output/chtml/WrapperFactory';
import { CHTMLmspace } from 'mathjax-full/js/output/chtml/Wrappers/mspace';

const log = debug('pie-lib:math-rendering');

const NEWLINE_BLOCK_REGEX = /\\embed\{newLine\}\[\]/g;
const NEWLINE_LATEX = '\\newline ';

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
    // because mathquill doesn't understand line breaks, sometimes we end up with custom elements on prompts/rationale/etc.
    // we need to replace the custom embedded elements with valid latex that Mathjax can understand
    element[property] = element[property].replace(NEWLINE_BLOCK_REGEX, NEWLINE_LATEX);
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

  const packages = AllPackages.filter(name => name !== 'bussproofs'); // Bussproofs needs an output jax

  // The autoload extension predefines all the macros from the extensions that haven't been loaded already
  // so that they automatically load the needed extension when they are first used
  packages.push('autoload');

  const macros = {
    parallelogram: '\\lower.2em{\\Huge\\unicode{x25B1}}',
    overarc: '\\overparen',
    napprox: '\\not\\approx',
    longdiv: '\\enclose{longdiv}'
  };

  const texConfig = opts.useSingleDollar
    ? {
        packages,
        macros,
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        processEscapes: true
      }
    : {
        packages,
        macros
      };

  const mmlConfig = {
    parseError: function(node) {
      // function to process parsing errors
      console.log('error:', node);
      this.error(this.adaptor.textContent(node).replace(/\n.*/g, ''));
    }
  };

  const fontURL = `https://unpkg.com/mathjax-full@${mathjax.version}/ts/output/chtml/fonts/tex-woff-v2`;
  const htmlConfig = {
    fontURL,

    wrapperFactory: new CHTMLWrapperFactory({
      ...CHTMLWrapperFactory.defaultNodes,
      ...chtmlNodes
    })
  };

  const mml = new MathML(mmlConfig);

  const customMmlFactory = new MmlFactory({
    ...MmlFactory.defaultNodes,
    ...mmlNodes
  });

  const html = mathjax.document(document, {
    compileError: (mj, math, err) => {
      console.log('bad math?:', math);
      console.error(err);
    },
    typesetError: function(doc, math, err) {
      console.log('typeset error');
      console.error(err);
      doc.typesetError(math, err);
    },

    InputJax: [new TeX(texConfig), mml],
    OutputJax: new CHTML(htmlConfig)
  });

  // Note: we must set this *after* mathjax.document (no idea why)
  mml.setMmlFactory(customMmlFactory);

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
  //TODO: remove this - has nothing to do with math-rendering (it's from editable-html)
  fixMathElements();

  if (!getGlobal().instance) {
    getGlobal().instance = bootstrap(renderOpts);
  }

  if (!el) {
    log('el is undefined');
    return;
  }

  if (el instanceof Element) {
    getGlobal().instance.Typeset(el);
  } else if (el.length) {
    const arr = Array.from(el);
    getGlobal().instance.Typeset(...arr);
  }
};

/**
 * This style is added to overried default styling of mjx-mspace Mathjax tag
 * In mathjax src code \newline latex gets parsed to <mjx-mspace></mjx-mspace>,
 * but has the default style
 * 'mjx-mspace': {
    "display": 'in-line',
    "text-align": 'left'
  } which prevents it from showing as a newline value
 */
CHTMLmspace.styles = {
  'mjx-mspace': {
    display: 'block',
    'text-align': 'center'
  }
};

export default renderMath;
