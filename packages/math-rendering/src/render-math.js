import { MathJax } from 'mathjax3/mathjax3/mathjax';
import { MathML } from 'mathjax3/mathjax3/input/mathml';
import { TeX } from 'mathjax3/mathjax3/input/tex';

import { CHTML } from 'mathjax3/mathjax3/output/chtml';
import { browserAdaptor as adaptor } from 'mathjax3/mathjax3/adaptors/browserAdaptor';
import { RegisterHTMLHandler } from 'mathjax3/mathjax3/handlers/html';
RegisterHTMLHandler(adaptor());
import debug from 'debug';

const log = debug('pie-lib:math-rendering');

let instance = null;

const bootstrap = (opts = { useSingleDollar: false }) => {
  if (typeof window === 'undefined') {
    return { Typeset: () => ({}) };
  }

  if (opts.useSingleDollar) {
    // eslint-disable-next-line
    console.warn(
      '[math-rendering] using $ is not advisable, please use $$..$$ or \\(...\\)'
    );
  }

  const texConfig = opts.useSingleDollar
    ? { inlineMath: [['$', '$'], ['\\(', '\\)']], processEscapes: true }
    : {};

  const mmlConfig = {};

  const htmlConfig = Object.assign(
    {
      fontURL:
        'https://cdn.rawgit.com/mathjax/mathjax-v3/3.0.0-beta.1/mathjax2/css'
    },
    {}
  );

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

export const renderMath = (el, renderOpts) => {
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
