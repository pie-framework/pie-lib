import React from 'react';
import mmlToLatex from '../mml-to-latex';
describe('mmlToLatex', () => {
  it('should work', () => {
    const mml =
      '<math xmlns="http://www.w3.org/1998/Math/MathML">  <mn>2</mn>  <mi>x</mi>  <mtext>&#xA0;</mtext>  <mo>&#x2264;</mo>  <mn>4</mn>  <mi>y</mi>  <mtext>&#xA0;</mtext>  <mo>+</mo>  <mtext>&#xA0;</mtext>  <mn>8</mn> <msqrt>    <mi>h</mi>  </msqrt></math>';
    const latex = '2x\\text{ }\\leq4y\\text{ }+\\text{ }8\\sqrt{h}';

    expect(mmlToLatex(mml)).toEqual(latex);
  });
});
