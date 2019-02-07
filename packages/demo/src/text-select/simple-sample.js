const foo = 'foo';
const bar = 'bar';
const math = `<math xmlns="http:/www.w3.org/1998/Math/MathML">
<mstyle displaystyle="true">
  <mo>-</mo>
  <mn>6</mn>
  <msup>
    <mi>x</mi>
    <mn>3</mn>
  </msup>
  <mo>+</mo>
  <mn>14</mn>
  <msup>
    <mi>x</mi>
    <mn>2</mn>
  </msup>
</mstyle>
</math>`;
const div = '<div>I am a div</div>';
const notSelectableOne = '<p> you cant select me</p>';
const notSelectableTwo = '<p> or me!</p>';
const h1 = '<h1>this is a h1</h1>';
const arr = [foo, bar, math, notSelectableOne, div, notSelectableTwo, h1];
export const text = arr.join(' ');

export const tokens = [foo, bar, math, div, h1].map(s => {
  const start = text.indexOf(s);
  return {
    start,
    end: start + s.length
  };
});
