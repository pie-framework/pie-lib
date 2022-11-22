import React from 'react';
import debug from 'debug';
import { Data } from 'slate';
import { BracketTypes, wrapMath, unWrapMath } from '../normalization';

const log = debug('@pie-lib:math-rendering:test:normalization');

describe('normalization', () => {
  describe('unWrapMath', () => {
    const assertUnWrap = (html, expected, wrapType) => {
      it(`innerHTML: ${html} is unWrapped to: ${expected} with wrapType: ${wrapType}`, () => {
        const out = unWrapMath(html);

        expect(out).toEqual({
          unwrapped: expected,
          wrapType: wrapType,
        });
      });
    };

    assertUnWrap('$$<$$', '<', BracketTypes.DOLLAR);
    assertUnWrap('$<$', '<', BracketTypes.DOLLAR);
    assertUnWrap('\\(<\\)', '<', BracketTypes.ROUND_BRACKETS);
    assertUnWrap('\\[<\\]', '<', BracketTypes.ROUND_BRACKETS);
    assertUnWrap('latex', 'latex', BracketTypes.ROUND_BRACKETS);
    assertUnWrap('\\displaystyle foo', 'foo', BracketTypes.ROUND_BRACKETS);
  });

  describe('wrapMath', () => {
    const assertWrap = (latex, expectedHtml, wrapper) => {
      wrapper = wrapper || BracketTypes.ROUND_BRACKETS;
      it(`${latex} is wrapped to: ${expectedHtml}`, () => {
        const out = wrapMath(latex, wrapper);

        log('out: ', out);

        expect(out).toEqual(expectedHtml);
      });
    };

    assertWrap('latex', '\\(latex\\)', BracketTypes.ROUND_BRACKETS);
    assertWrap('latex', '\\(latex\\)', BracketTypes.SQUARE_BRACKETS);
    assertWrap('latex', '$latex$', BracketTypes.DOLLAR);
    assertWrap('latex', '$latex$', BracketTypes.DOUBLE_DOLLAR);

    /**
     * Note that when this is converted to html it get's escaped - but that's an issue with the slate html-serializer.
     */
    assertWrap('<', '\\(<\\)');
  });
});
