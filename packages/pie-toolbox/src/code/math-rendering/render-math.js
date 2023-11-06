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

// import pkg from '../../package.json';
import { mmlNodes, chtmlNodes } from './mstack';
import debug from 'debug';
import { wrapMath, unWrapMath } from './normalization';
import { MmlFactory } from 'mathjax-full/js/core/MmlTree/MmlFactory';
import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor';
import { CHTMLWrapperFactory } from 'mathjax-full/js/output/chtml/WrapperFactory';
import { CHTMLmspace } from 'mathjax-full/js/output/chtml/Wrappers/mspace';

const visitor = new SerializedMmlVisitor();
const toMMl = (node) => visitor.visitTree(node);

const log = debug('pie-lib:math-rendering');

const NEWLINE_BLOCK_REGEX = /\\embed\{newLine\}\[\]/g;
const NEWLINE_LATEX = '\\newline ';

const getGlobal = () => {
  // TODO does it make sense to use version?
  // const key = `${pkg.name}@${pkg.version.split('.')[0]}`;
  // It looks like Ed made this change when he switched from mathjax3 to mathjax-full
  // I think it was supposed to make sure version 1 (using mathjax3) is not used
  // in combination with version 2 (using mathjax-full)

  // TODO higher level wrappers use this instance of math-rendering, and if 2 different instances are used, math rendering is not working
  //  so I will hardcode this for now until a better solution is found
  const key = '@pie-lib/math-rendering@2';

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

export const fixMathElement = (element) => {
  if (element.dataset.mathHandled) {
    return;
  }

  let property = 'innerText';

  if (element.textContent) {
    property = 'textContent';
  }

  if (element[property]) {
    element[property] = wrapMath(unWrapMath(element[property]).unwrapped);
    // because mathquill doesn't understand line breaks, sometimes we end up with custom elements on prompts/rationale/etc.
    // we need to replace the custom embedded elements with valid latex that Mathjax can understand
    element[property] = element[property].replace(NEWLINE_BLOCK_REGEX, NEWLINE_LATEX);
    element.dataset.mathHandled = true;
  }
};

export const fixMathElements = (el = document) => {
  const mathElements = el.querySelectorAll('[data-latex]');

  mathElements.forEach((item) => fixMathElement(item));
};

const adjustMathMLStyle = (el = document) => {
  const nodes = el.querySelectorAll('math');
  nodes.forEach((node) => node.setAttribute('displaystyle', 'true'));
};

const createMathMLInstance = (opts, docProvided = document) => {
  opts = opts || defaultOpts();

  if (opts.useSingleDollar) {
    // eslint-disable-next-line
    console.warn('[math-rendering] using $ is not advisable, please use $$..$$ or \\(...\\)');
  }

  const packages = AllPackages.filter((name) => name !== 'bussproofs'); // Bussproofs needs an output jax

  // The autoload extension predefines all the macros from the extensions that haven't been loaded already
  // so that they automatically load the needed extension when they are first used
  packages.push('autoload');

  const macros = {
    parallelogram: '\\lower.2em{\\Huge\\unicode{x25B1}}',
    overarc: '\\overparen',
    napprox: '\\not\\approx',
    longdiv: '\\enclose{longdiv}',
  };

  const texConfig = opts.useSingleDollar
    ? {
        packages,
        macros,
        inlineMath: [
          ['$', '$'],
          ['\\(', '\\)'],
        ],
        processEscapes: true,
        options: {
          enableExplorer: true,
          enableAssistiveMml: true,
          a11y: {
            speech: true,
            braille: true,
            subtitles: true,
          },
          sre: {
            domain: 'default',
            style: 'default',
            locale: 'en',
          },
        },
      }
    : {
        packages,
        macros,
        options: {
          enableExplorer: true,
          enableAssistiveMml: true,
          a11y: {
            speech: true,
            braille: true,
            subtitles: true,
          },
          sre: {
            domain: 'default',
            style: 'default',
            locale: 'en',
          },
        },
      };

  const mmlConfig = {
    options: {
      a11y: {
        speech: true,
        braille: true,
        subtitles: true,
      },
    },
    parseError: function(node) {
      // function to process parsing errors
      // eslint-disable-next-line no-console
      console.log('error:', node);
      this.error(this.adaptor.textContent(node).replace(/\n.*/g, ''));
    },
  };

  const fontURL = `https://unpkg.com/mathjax-full@${mathjax.version}/ts/output/chtml/fonts/tex-woff-v2`;
  const htmlConfig = {
    fontURL,

    wrapperFactory: new CHTMLWrapperFactory({
      ...CHTMLWrapperFactory.defaultNodes,
      ...chtmlNodes,
    }),

    options: {
      renderActions: {
        assistiveMml: [['AssistiveMmlHandler']],
      },
    },
  };

  const mml = new MathML(mmlConfig);

  const customMmlFactory = new MmlFactory({
    ...MmlFactory.defaultNodes,
    ...mmlNodes,
  });

  const html = mathjax.document(docProvided, {
    compileError: (mj, math, err) => {
      // eslint-disable-next-line no-console
      console.log('bad math?:', math);
      // eslint-disable-next-line no-console
      console.error(err);
    },
    typesetError: function(doc, math, err) {
      // eslint-disable-next-line no-console
      console.log('typeset error');
      // eslint-disable-next-line no-console
      console.error(err);
      doc.typesetError(math, err);
    },

    options: {
      enableAssistiveMml: true,
      menuOptions: {
        settings: {
          assistiveMml: true,
          collapsible: true,
          explorer: true,
        },
      },
    },

    InputJax: [new TeX(texConfig), mml],
    OutputJax: new CHTML(htmlConfig),
  });

  // Note: we must set this *after* mathjax.document (no idea why)
  mml.setMmlFactory(customMmlFactory);

  return html;
};

const bootstrap = (opts) => {
  if (typeof window === 'undefined') {
    return { Typeset: () => ({}) };
  }

  const html = createMathMLInstance(opts);

  return {
    version: mathjax.version,
    html: html,
    Typeset: function(...elements) {
      const updatedDocument = this.html
        .findMath(elements.length ? { elements } : {})
        .compile()
        .getMetrics()
        .typeset()
        .updateDocument();

      try {
        const list = updatedDocument.math.list;

        for (let item = list.next; typeof item.data !== 'symbol'; item = item.next) {
          const mathMl = toMMl(item.data.root);
          const parsedMathMl = mathMl.replaceAll('\n', '');

          item.data.typesetRoot.setAttribute('data-mathml', parsedMathMl);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e.toString());
      }

      updatedDocument.clear();
    },
  };
};

const renderMath = (el, renderOpts) => {
  const isString = typeof el === 'string';
  let executeOn = document.body;

  if (isString) {
    const div = document.createElement('div');

    div.innerHTML = el;
    executeOn = div;
  }

  fixMathElements(executeOn);
  adjustMathMLStyle(executeOn);

  if (isString) {
    const html = createMathMLInstance(undefined, executeOn);

    const updatedDocument = html
      .findMath()
      .compile()
      .getMetrics()
      .typeset()
      .updateDocument();

    const list = updatedDocument.math.list;
    const item = list.next;

    if (!item) {
      return '';
    }

    const mathMl = toMMl(item.data.root);
    const parsedMathMl = mathMl.replaceAll('\n', '');

    return parsedMathMl;
  }

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
    'text-align': 'center',
    height: '5px',
  },
};

export default renderMath;
