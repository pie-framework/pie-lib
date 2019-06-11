import { MathJax } from 'mathjax3/mathjax3/mathjax';
import { MathML } from 'mathjax3/mathjax3/input/mathml';

import { RegisterHTMLHandler } from 'mathjax3/mathjax3/handlers/html';

import { TeX } from 'mathjax3/mathjax3/input/tex';

import { CHTML } from 'mathjax3/mathjax3/output/chtml';

import { STATE } from 'mathjax3/mathjax3/core/MathItem';

import 'mathjax3/mathjax3/input/tex/base/BaseConfiguration';
import 'mathjax3/mathjax3/input/tex/ams/AmsConfiguration';
import { SerializedMmlVisitor } from 'mathjax3/mathjax3/core/MmlTree/SerializedMmlVisitor';

if (typeof window !== 'undefined') {
  const { browserAdaptor } = require('mathjax3/mathjax3/adaptors/browserAdaptor');
  RegisterHTMLHandler(browserAdaptor());
}

export const toMathMl = latex => {
  const packages = ['ams', 'base'];
  const settings = { tags: 'none' };
  let options = { packages };
  Object.assign(options, settings);
  const html = MathJax.document('<html></html>', {
    InputJax: new TeX(options)
  });
  const root = html.convert(latex, { end: STATE.CONVERT });
  const v = new SerializedMmlVisitor();
  root.setTeXclass(null);
  const actual = v.visitTree(root);
  return actual;
};

export const toLatex = mathMl => mathMl;
