import * as React from 'react';
import { hasText } from '../has-text';

describe('has-text', () => {
  it.each`
    input                     | expected
    ${'<div>Rationale</div>'} | ${true}
    ${'Rationale'}            | ${true}
    ${'<div>hi</div>'}        | ${true}
    ${'<div>hi'}              | ${true}
    ${'<div></div>'}          | ${false}
    ${'<div>  </div>'}        | ${false}
    ${'<div><br />   </div>'} | ${false}
    ${' '}                    | ${false}
    ${null}                   | ${false}
  `('$input -> $expected', ({ input, expected }) => {
    const output = hasText(input);

    expect(output).toEqual(expected);
  });
});
