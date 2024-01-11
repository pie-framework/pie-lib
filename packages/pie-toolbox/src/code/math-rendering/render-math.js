

import { initializeMathJax } from './mathjax-script';

import { mmlNodes, chtmlNodes } from './mstack';
import debug from 'debug';
import { wrapMath, unWrapMath } from './normalization';



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
        extensions,
        macros,
        inlineMath: [
          ['$', '$'],
          ['\\(', '\\)'],
        ],
        processEscapes: true,
      }
    : {
        packages,
        extensions,
        macros,
        a11y: {
          speech: true,
          braille: true,
          subtitles: true,
        },
      };

  const mmlConfig = {
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

    // options:  accessibilityOptions,
  };

  const mml = new MathML(mmlConfig);

  const customMmlFactory = new MmlFactory({
    ...MmlFactory.defaultNodes,
    ...mmlNodes,
  });

  const html = mathjax.document(document, {
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
    a11y: {
      speech: true,
      braille: true,
      subtitles: true,
    },
    Typeset: function(...elements) {
      console.log(this.html, 'this html');
      const updatedDocument = this.html
        .findMath(elements.length ? { elements } : {})
        .compile()
        .getMetrics()
        .typeset()
        .updateDocument();

      // try {
      //   const list = updatedDocument.math.list;

      //   for (let item = list.next; typeof item.data !== 'symbol'; item = item.next) {
      //     const mathMl = toMMl(item.data.root);
      //     const parsedMathMl = mathMl.replaceAll('\n', '');

      //     item.data.typesetRoot.setAttribute('data-mathml', parsedMathMl);
      //   }
      // } catch (e) {
      //   // eslint-disable-next-line no-console
      //   console.error(e.toString());
      // }

      updatedDocument.clear();
    },
  };
};

const renderMath = (el) => {

  if (!window.MathJax) {
    console.log('LOAD MathJax--------');
    initializeMathJax();

    window.mathjaxLoadedP.then(() => {
      console.log('MathJax is ready');
      if (window.MathJax) {
        // Typeset the entire document
        window.MathJax.texReset();
        window.MathJax.typesetClear();
        window.MathJax.typeset();
      }
    });
  }


};



export default renderMath;
