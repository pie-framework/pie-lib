import { keysForGrade } from './keys/grades';
import * as keys from './keys';

import MathInput from './math-input';
import HorizontalKeypad from './horizontal-keypad';
import KeyPad from './keypad';

import * as mf from './mf';
import {
  registerEmbed,
  applyStaticMath,
  latexToMarkup,
  loadMathLive,
  configureFonts,
  getMacros,
  PIE_MACROS,
} from './mathlive-instance';
import { toMathLive, fromMathLive, keyToAction, NEWLINE_EMBED } from './latex-bridge';

const addLeftBracket = (s) => (s.indexOf('\\(') === 0 ? s : `\\(${s}`);
const addRightBracket = (s) => (s.indexOf('\\)') === s.length - 2 ? s : `${s}\\)`);
const rmLeftBracket = (s) => (s.indexOf('\\(') === 0 ? s.substring(2) : s);
const rmRightBracket = (s) => (s.indexOf('\\)') === s.length - 2 ? s.substring(0, s.length - 2) : s);

const addBrackets = (s) => addRightBracket(addLeftBracket(s));
const removeBrackets = (s) => rmRightBracket(rmLeftBracket(s));

/**
 * `updateSpans` is intentionally a no-op.
 *
 * In @pie-lib/math-input it patched MathQuill's rendered DOM by walking
 * `span[mathquill-command-id]` to resize the parallel glyph and tag primes.
 * MathLive emits none of those attributes and does not need the fixups, but the
 * export is kept so callers do not break.
 */
const updateSpans = () => {};

export {
  keysForGrade,
  addBrackets,
  removeBrackets,
  keys,
  MathInput,
  HorizontalKeypad,
  KeyPad,
  updateSpans,
  // `mf` is the MathLive equivalent of math-input's `mq`. Both names are
  // exported so a consumer can switch packages by changing only the import.
  mf,
  mf as mq,
  registerEmbed,
  applyStaticMath,
  // MathLive-specific additions
  latexToMarkup,
  loadMathLive,
  configureFonts,
  getMacros,
  PIE_MACROS,
  toMathLive,
  fromMathLive,
  keyToAction,
  NEWLINE_EMBED,
};
