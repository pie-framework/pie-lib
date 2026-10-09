/**
 * LaTeX translation layer between the MathQuill-era content model and MathLive.
 *
 * Two independent concerns live here:
 *
 *  1. Newlines. MathQuill had no line break, so pie-lib registered a custom
 *     `newLine` embed that serialises to `\embed{newLine}[]`. MathLive has no
 *     embed system but supports real multiline environments, so we translate
 *     `\embed{newLine}[]` <-> `\\` inside `\displaylines{}`.
 *
 *     Authored content keeps its `\embed{newLine}[]` on-disk form (that is what
 *     @pie-lib/math-rendering already normalises for MathJax), so each renderer
 *     normalises at its own boundary and stored items stay compatible.
 *
 *  2. Keypad key -> MathLive action. MathQuill keys carry `write`/`command`/
 *     `keystroke` built for `mf.write()` / `mf.cmd()` / `mf.keystroke()`.
 *     MathLive has `insert()` and `executeCommand()` instead.
 */

export const NEWLINE_EMBED = '\\embed{newLine}[]';
const NEWLINE_EMBED_REGEX = /\\embed\{newLine\}\[\]/g;
const DISPLAYLINES_REGEX = /^\\displaylines\{([\s\S]*)\}$/;

/**
 * MathQuill's editable sub-field syntax, e.g. `\MathQuillMathField[r1]{}`.
 * These are the answer blocks in templated math items; MathLive expresses the
 * same idea as `\placeholder[id]{}` and reads them back via the prompts API.
 */
const MQ_FIELD_REGEX = /\\MathQuillMathField\[([^\]]*)\]\{([^{}]*)\}/g;
const PLACEHOLDER_REGEX = /\\placeholder\[([^\]]*)\]\{([^{}]*)\}/g;

/**
 * Unnamed placeholders, which MathLive inserts on its own.
 *
 * Typing a command with empty arguments (`\longdiv{}`, `\frac{}{}`) makes
 * MathLive serialise the empty slots as `\placeholder{}`. That token is
 * MathLive-specific: MathJax - which @pie-lib/math-rendering uses to render
 * prompts and previews - has no such command and renders it as red error text.
 * Stored latex must therefore keep plain empty groups.
 */
const BARE_PLACEHOLDER_REGEX = /\\placeholder\{([^{}]*)\}/g;
const BARE_PLACEHOLDER_NO_ARG_REGEX = /\\placeholder(?![[{a-zA-Z])/g;

/** Default id used when stored latex has an unnamed field. */
export const DEFAULT_FIELD_ID = 'r1';

/**
 * A visible stand-in for an empty argument slot, used for STATIC rendering only.
 *
 * Stored latex legitimately contains empty groups - `\longdiv{}`, `\frac{}{}`,
 * `x^{}` - to express a command's shape. MathQuill drew those as a shaded box
 * (`.mq-empty`); MathLive renders `{}` as nothing, so `convertLatexToMarkup`
 * output comes out completely blank (not even the surrounding bracket, in the
 * case of `\enclose{longdiv}{}`).
 *
 * `\placeholder{}` is not usable here: in static markup it renders as a
 * non-breaking space, because its editable box only exists inside a live
 * mathfield. So something with real width is required.
 *
 * It must be a `\rule`, not a unicode glyph. A glyph's width comes from font
 * metrics, and U+25AB is not in the KaTeX fonts - the browser substitutes a
 * wider fallback while MathLive still sizes surrounding accents from its own
 * metrics. That left stretchy accents (`\overarc`, `\overleftrightarrow`)
 * visibly narrower than the box they were meant to span. A rule carries an
 * explicit em width, so accents size correctly - and a filled box is closer to
 * MathQuill's `.mq-empty` anyway.
 *
 * Live mathfields need none of this - MathLive manages empty slots itself.
 */
const EMPTY_SLOT = '\\htmlData{pie-empty=1}{\\rule{0.55em}{0.55em}}';
const EMPTY_GROUP_REGEX = /\{\s*\}/g;
// Empty delimiter pairs: `\abs{}` is converted to `\left|\right|`, and the
// parenthesis / bracket keys are `\left(\right)` / `\left[\right]`. None has a
// `{}` group for the rule above to catch, so they would render as bare fences.
const EMPTY_FENCE_REGEX = /\\left([(\[|])\s*\\right([)\]|])/g;
// The same muted fill as the other slots (`pie-empty`), but a tall rectangle
// rather than a square. It also sets the fences' height: `\left...\right` stretch
// to their content, so a taller slot gives taller parentheses.
//
// A `\rule` stands on the baseline, but the fences are centred on the math axis
// (0.25em above it), so an un-lifted box sat high between them. `[-0.25em]`
// lowers it by (axis - height / 2) = 0.25 - 1 / 2, centring it on the axis.
//
// Lowering it alone also shrinks the fences, which size themselves to their
// content (MathLive switches to short bars). The zero-width `\rule{0em}{1em}`
// strut keeps the content as tall as before, so the bars keep their height and
// only the box moves.
const EMPTY_FENCE_SLOT = '\\rule{0em}{1em}\\htmlData{pie-empty=1}{\\rule[-0.25em]{0.55em}{1em}}';

/**
 * Make empty argument slots visible, for static rendering.
 *
 * Display-only: never feed the result to a mathfield or to storage - the
 * original latex is what gets typed and saved.
 *
 * @param {string} latex
 * @returns {string}
 */
export const withVisibleEmptySlots = (latex) =>
  (latex || '')
    .replace(EMPTY_GROUP_REGEX, `{${EMPTY_SLOT}}`)
    .replace(EMPTY_FENCE_REGEX, (_m, open, close) => `\\left${open}${EMPTY_FENCE_SLOT}\\right${close}`);

/**
 * Pie commands that take an argument, and their native MathLive equivalents.
 *
 * These MUST NOT be handled as MathLive macros. A macro is serialised from the
 * arguments it was created with, so text typed inside its expansion never makes
 * it back out: `getValue('latex')` keeps returning `\longdiv{\placeholder{}}`
 * while `getValue('ascii-math')` shows the typed content. Setting
 * `captureSelection: false` lets the cursor in but does not change
 * serialisation.
 *
 * Expanding to native constructs instead gives real, editable atoms that
 * round-trip. All three targets are understood by MathJax too, so stored latex
 * still renders in @pie-lib/math-rendering without a reverse mapping.
 */
/**
 * Rewrite argument-taking pie commands into native MathLive latex.
 * Applied on the way *into* a mathfield.
 *
 * @param {string} latex
 * @returns {string}
 */
export const toNativeCommands = (latex) => {
  if (typeof latex !== 'string' || !latex) {
    return latex || '';
  }

  let out = latex;

  // \abs{x} -> \left|x\right| needs brace-aware handling, the rest are prefix
  // swaps.
  out = replaceAbs(out);
  out = out.replace(/\\longdiv\{/g, '\\enclose{longdiv}{');
  out = out.replace(/\\overarc\{/g, '\\overparen{');
  out = escapeBareComments(out);

  return out;
};

/**
 * Escape an unescaped `%`.
 *
 * In real LaTeX `%` starts a comment, so MathLive discards it *and everything
 * after it*: `50%` renders as `50`, and `x%y` as just `x`. MathQuill had no
 * such notion - it treated `%` as a symbol - so latex from anywhere outside the
 * keypad may still carry a bare one.
 *
 * Only a `%` preceded by an even number of backslashes is bare: `\%` is already
 * escaped, while the `%` in `\\%` (a line break, then a comment) is not.
 *
 * @param {string} latex
 * @returns {string}
 */
const escapeBareComments = (latex) => {
  if (latex.indexOf('%') === -1) {
    return latex;
  }

  let out = '';
  // Consecutive backslashes immediately before the current character.
  let backslashes = 0;

  for (let i = 0; i < latex.length; i++) {
    const ch = latex[i];

    out += ch === '%' && backslashes % 2 === 0 ? '\\%' : ch;
    backslashes = ch === '\\' ? backslashes + 1 : 0;
  }

  return out;
};

/** `\abs{x}` -> `\left|x\right|`, matching balanced braces. */
const replaceAbs = (latex) => {
  let out = latex;
  let idx = out.indexOf('\\abs{');

  while (idx !== -1) {
    const open = idx + '\\abs{'.length - 1;
    let depth = 0;
    let close = -1;

    for (let i = open; i < out.length; i++) {
      if (out[i] === '{') depth++;
      else if (out[i] === '}') {
        depth--;
        if (depth === 0) {
          close = i;
          break;
        }
      }
    }

    if (close === -1) {
      break;
    }

    const inner = out.slice(open + 1, close);

    out = `${out.slice(0, idx)}\\left|${inner}\\right|${out.slice(close + 1)}`;
    idx = out.indexOf('\\abs{');
  }

  return out;
};

/**
 * Ids of the answer blocks in a piece of stored latex, in document order.
 *
 * @param {string} latex
 * @returns {string[]}
 */
export const fieldIds = (latex) => {
  if (typeof latex !== 'string') {
    return [];
  }

  const out = [];
  let match;

  MQ_FIELD_REGEX.lastIndex = 0;

  while ((match = MQ_FIELD_REGEX.exec(latex)) !== null) {
    out.push(match[1] || DEFAULT_FIELD_ID);
  }

  return out;
};

/**
 * Convert stored latex (which may contain `\embed{newLine}[]`) into latex that
 * MathLive can parse and render as multiple lines.
 *
 * @param {string} latex
 * @returns {string}
 */
export const toMathLive = (latex) => {
  if (typeof latex !== 'string' || !latex) {
    return latex || '';
  }

  // Argument-taking pie commands -> native constructs, so their content stays
  // editable and serialises back correctly (see toNativeCommands).
  let out = toNativeCommands(latex);

  // Answer blocks: \MathQuillMathField[id]{x} -> \placeholder[id]{x}
  out = out.replace(MQ_FIELD_REGEX, (_m, id, content) => `\\placeholder[${id || DEFAULT_FIELD_ID}]{${content}}`);

  // Newlines: \embed{newLine}[] -> a multiline environment
  if (out.indexOf(NEWLINE_EMBED) !== -1) {
    out = `\\displaylines{${out.split(NEWLINE_EMBED_REGEX).join(' \\\\ ')}}`;
  }

  return out;
};

/**
 * Keypad command names that MathQuill treated as ALIASES of a different command.
 *
 * MathQuill registered `\\divide` as another name for `\\div` (and
 * `\\perpendicular` for `\\perp`), so pressing the key stored the real command.
 * MathLive only knows these names through `PIE_MACROS`, and serialises a macro
 * under its own name - so `\\divide` reached storage verbatim, where MathJax
 * (@pie-lib/math-rendering) has no such command and renders it as red text.
 *
 * Every other keypad command already matches what MathQuill stored (`\\degree`,
 * `\\nsim`, `\\ncong`, `\\nparallel`, `\\square`, `\\napprox`,
 * `\\parallelogram`), and MathJax understands those.
 */
const MATHQUILL_ALIASES = {
  '\\divide': '\\div',
  '\\perpendicular': '\\perp',
};

// Whole command names only: `\\divideontimes` is a real AMS symbol.
const MATHQUILL_ALIAS_REGEX = /\\(divide|perpendicular)(?![a-zA-Z])/g;

/**
 * Primes. MathLive turns a prime that follows a base into a superscript atom and
 * serialises it as `^{\\prime}`, or `^{\\doubleprime}` for the keypad's double
 * prime key (`5''` comes back out as `5^{\\doubleprime}`). MathJax has no
 * `\\doubleprime`, and two adjacent `^{\\prime}` groups - what typing `'` twice
 * produces - are a "double exponent" error. MathQuill stored plain apostrophes,
 * which both MathJax and MathLive read as primes, so store those.
 *
 * Only a superscript made of primes alone is rewritten: `x^{\\prime 2}` keeps
 * its group, since it holds more than primes.
 */
const PRIME_SUPERSCRIPT_REGEX = /\^\{((?:\s*\\(?:prime|doubleprime)(?![a-zA-Z]))+)\s*\}/g;
const BARE_DOUBLEPRIME_REGEX = /\\doubleprime(?![a-zA-Z])/g;

const primesToApostrophes = (primes) =>
  // eslint-disable-next-line quotes
  "'".repeat(
    (primes.match(/\\prime(?![a-zA-Z])/g) || []).length + 2 * (primes.match(BARE_DOUBLEPRIME_REGEX) || []).length,
  );

/**
 * Rewrite what MathLive serialises into the form MathQuill stored: alias
 * command names, and primes.
 *
 * @param {string} latex
 * @returns {string}
 */
export const toCanonicalCommands = (latex) =>
  typeof latex === 'string'
    ? latex
        .replace(MATHQUILL_ALIAS_REGEX, (m) => MATHQUILL_ALIASES[m])
        .replace(PRIME_SUPERSCRIPT_REGEX, (_m, primes) => primesToApostrophes(primes))
        // eslint-disable-next-line quotes
        .replace(BARE_DOUBLEPRIME_REGEX, "''")
    : latex;

/**
 * Convert latex out of MathLive back into the stored form, so items authored
 * with the MathLive editor remain readable by @pie-lib/math-rendering and by
 * the existing MathQuill implementation.
 *
 * @param {string} latex
 * @returns {string}
 */
export const fromMathLive = (latex) => {
  if (typeof latex !== 'string' || !latex) {
    return latex || '';
  }

  const match = latex.trim().match(DISPLAYLINES_REGEX);
  let out = match ? match[1] : latex;

  // `\\` is the line separator inside a multiline environment.
  if (out.indexOf('\\\\') !== -1) {
    out = out
      .split(/\s*\\\\\s*/)
      .map((s) => s.trim())
      .join(NEWLINE_EMBED);
  }

  // Answer blocks: \placeholder[id]{x} -> \MathQuillMathField[id]{x}
  out = out.replace(
    PLACEHOLDER_REGEX,
    (_m, id, content) => `\\MathQuillMathField[${id || DEFAULT_FIELD_ID}]{${content}}`,
  );

  // Unnamed placeholders are MathLive's own representation of an empty slot and
  // must not reach storage or MathJax. Unwrap them: keep any content, drop the
  // command itself (the surrounding braces are already part of the host latex,
  // so re-adding them here would produce `\longdiv{{}}`).
  out = out.replace(BARE_PLACEHOLDER_REGEX, (_m, content) => content);
  out = out.replace(BARE_PLACEHOLDER_NO_ARG_REGEX, '');

  // Store the command MathQuill stored, not the alias - also heals latex that was
  // saved with `\\divide` before the keypad resolved it.
  return toCanonicalCommands(out);
};

/**
 * MathQuill `cmd()` semantics: commands that take arguments should land the
 * cursor inside the first argument. MathLive expresses that with `#?`
 * placeholders in the inserted latex.
 */
const COMMANDS_WITH_ARGS = {
  // An explicit "blank over blank" key: both slots start empty.
  '\\frac': '\\frac{#?}{#?}',
  // Division, which must behave like MathQuill's `/`: whatever precedes the
  // cursor becomes the numerator and the caret lands in the denominator. `#@`
  // is MathLive's token for "the selection, or the item before the cursor" -
  // this is exactly the template MathLive binds to the `/` key itself. Using
  // `#?` here instead produced an empty fraction and left the typed number
  // stranded outside it.
  '/': '\\frac{#@}{#?}',
  '\\sqrt': '\\sqrt{#?}',
  '\\nthroot': '\\sqrt[#?]{#?}',
  '\\overline': '\\overline{#?}',
  '\\overrightarrow': '\\overrightarrow{#?}',
  '\\overleftrightarrow': '\\overleftrightarrow{#?}',
  // Native forms, not the pie macros: a macro would not serialise the user's
  // typed content back out (see toNativeCommands).
  '\\overarc': '\\overparen{#?}',
  '\\longdiv': '\\enclose{longdiv}{#?}',
  '^': '^{#?}',
  _: '_{#?}',
  '(': '\\left(#?\\right)',
  '[': '\\left[#?\\right]',
  '|': '\\left|#?\\right|',
};

/**
 * MathQuill keystroke names -> MathLive command selectors.
 */
const KEYSTROKES = {
  Left: 'moveToPreviousChar',
  Right: 'moveToNextChar',
  Backspace: 'deleteBackward',
  Delete: 'deleteForward',
  Up: 'moveUp',
  Down: 'moveDown',
};

/**
 * Translate a keypad key definition into a MathLive action.
 *
 * Mirrors the precedence in @pie-lib/math-input's MathInput.keypadPress:
 * latex (unless a command is present) -> write -> command -> keystroke.
 *
 * @param {object} key
 * @returns {{type: 'insert'|'command', value: string}|undefined}
 */
export const keyToAction = (key) => {
  if (!key) {
    return undefined;
  }

  if (key.latex && !key.command) {
    return { type: 'insert', value: key.latex };
  }

  if (key.write) {
    return { type: 'insert', value: key.write };
  }

  if (key.command) {
    // Some keys carry an array of commands (e.g. Measured Angle is
    // ['m', '\\angle'], log-base-n is ['\\log', '_']). MathQuill's `cmd()`
    // applied them in sequence; MathLive inserts one latex string, so expand
    // each part and concatenate.
    const parts = Array.isArray(key.command) ? key.command : [key.command];
    const value = parts.map((c) => COMMANDS_WITH_ARGS[c] || MATHQUILL_ALIASES[c] || c).join('');

    return { type: 'insert', value };
  }

  if (key.keystroke) {
    const selector = KEYSTROKES[key.keystroke];

    return selector ? { type: 'command', value: selector } : undefined;
  }

  return undefined;
};

export { COMMANDS_WITH_ARGS, KEYSTROKES, MATHQUILL_ALIASES };
