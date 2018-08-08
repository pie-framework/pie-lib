import katex from 'katex';
require('katex/dist/katex.css');

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
  renderMathInElement(el, { ...renderOpts, ...opts });
};
