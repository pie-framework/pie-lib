import debug from 'debug';
import katex from 'katex';
require('katex/dist/katex.css');

const log = debug('pie-lib:math-rendering');

let renderMathInElement = () => {};

if (typeof window !== 'undefined') {
  //Auto render requires the katex global
  window.katex = katex;
  renderMathInElement = require('katex/dist/contrib/auto-render.min');
}

const renderOpts = {
  delimiters: [
    { left: '\\(', right: '\\)', display: false },
    { left: '$', right: '$', display: false }
  ]
};

export default (el, opts) => {
  if (!el) {
    log('el is undefined');
    return;
  }

  if (el instanceof Element) {
    renderMathInElement(el, { ...renderOpts, ...opts });
  } else if (el.length) {
    const arr = Array.from(el);
    arr.forEach(e => renderMathInElement(e, { ...renderOpts, ...opts }));
  }
};
