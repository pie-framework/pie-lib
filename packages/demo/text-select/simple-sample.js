'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.tokens = exports.text = void 0;
var foo = 'foo';
var bar = 'bar';
var math =
  '<math xmlns="http:/www.w3.org/1998/Math/MathML">\n<mstyle displaystyle="true">\n  <mo>-</mo>\n  <mn>6</mn>\n  <msup>\n    <mi>x</mi>\n    <mn>3</mn>\n  </msup>\n  <mo>+</mo>\n  <mn>14</mn>\n  <msup>\n    <mi>x</mi>\n    <mn>2</mn>\n  </msup>\n</mstyle>\n</math>';
var div = '<div>I am a div</div>';
var notSelectableOne = '<p> you cant select me</p>';
var notSelectableTwo = '<p> or me!</p>';
var h1 = '<h1>this is a h1</h1>';
var arr = [foo, bar, math, notSelectableOne, div, notSelectableTwo, h1];
var text = arr.join(' ');
exports.text = text;
var tokens = [foo, bar, math, div, h1].map(function(s) {
  var start = text.indexOf(s);
  return {
    start: start,
    end: start + s.length,
  };
});
exports.tokens = tokens;
//# sourceMappingURL=simple-sample.js.map
