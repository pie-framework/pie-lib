import { mathjax } from 'mathjax-full/js/mathjax';
import { MathML } from 'mathjax-full/js/input/mathml';
import { TeX } from 'mathjax-full/js/input/tex';

import { CHTML } from 'mathjax-full/js/output/chtml';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { browserAdaptor } from 'mathjax-full/js/adaptors/browserAdaptor';

if (typeof window !== 'undefined') {
  RegisterHTMLHandler(browserAdaptor());
}

import pkg from '../package.json';
import { CHTMLmstack } from './chtml-mstack';
import debug from 'debug';
import { wrapMath, unWrapMath } from './normalization';
import { MmlFactory } from 'mathjax-full/js/core/MmlTree/MmlFactory';
import { AbstractMmlNode, TEXCLASS } from 'mathjax-full/js/core/MmlTree/MmlNode';
import { CHTMLWrapperFactory } from 'mathjax-full/js/output/chtml/WrapperFactory';

export class MmlNone extends AbstractMmlNode {
  properties = {
    useHeight: 1
  };

  texClass = TEXCLASS.ORD;

  get kind() {
    return 'none';
  }

  get linebreakContainer() {
    return true;
  }

  setTeXclass(prev) {
    this.getPrevClass(prev);
    for (const child of this.childNodes) {
      child.setTeXclass(null);
    }
    return this;
  }
}
export class MmlMstack extends AbstractMmlNode {
  properties = {
    useHeight: 1
  };

  texClass = TEXCLASS.ORD;

  get kind() {
    return 'mstack';
  }

  get linebreakContainer() {
    return true;
  }

  setTeXclass(prev) {
    this.getPrevClass(prev);
    for (const child of this.childNodes) {
      child.setTeXclass(null);
    }
    return this;
  }
}

export class MmlMsrow extends AbstractMmlNode {
  properties = {
    useHeight: 1
  };

  texClass = TEXCLASS.ORD;

  get kind() {
    return 'msrow';
  }

  get linebreakContainer() {
    return true;
  }

  setTeXclass(prev) {
    this.getPrevClass(prev);
    for (const child of this.childNodes) {
      child.setTeXclass(null);
    }
    return this;
  }
}
export class MmlMsline extends AbstractMmlNode {
  properties = {
    useHeight: 1
  };

  texClass = TEXCLASS.ORD;

  get kind() {
    return 'msline';
  }

  get linebreakContainer() {
    return true;
  }

  setTeXclass(prev) {
    this.getPrevClass(prev);
    for (const child of this.childNodes) {
      child.setTeXclass(null);
    }
    return this;
  }
}

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
      mstack: CHTMLmstack
    })
  };

  const mml = new MathML(mmlConfig);

  const customMmlFactory = new MmlFactory({
    ...MmlFactory.defaultNodes,
    mstack: MmlMstack,
    msrow: MmlMsrow,
    msline: MmlMsline,
    none: MmlNone
  });
  mml.setMmlFactory(customMmlFactory);

  const chtml = new CHTML(htmlConfig);
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

export default renderMath;
