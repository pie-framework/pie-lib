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

/** Default id used when stored latex has an unnamed field. */
export const DEFAULT_FIELD_ID = 'r1';

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

  // Answer blocks: \MathQuillMathField[id]{x} -> \placeholder[id]{x}
  let out = latex.replace(MQ_FIELD_REGEX, (_m, id, content) => `\\placeholder[${id || DEFAULT_FIELD_ID}]{${content}}`);

  // Newlines: \embed{newLine}[] -> a multiline environment
  if (out.indexOf(NEWLINE_EMBED) !== -1) {
    out = `\\displaylines{${out.split(NEWLINE_EMBED_REGEX).join(' \\\\ ')}}`;
  }

  return out;
};

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

  return out;
};

/**
 * MathQuill `cmd()` semantics: commands that take arguments should land the
 * cursor inside the first argument. MathLive expresses that with `#?`
 * placeholders in the inserted latex.
 */
const COMMANDS_WITH_ARGS = {
  '\\frac': '\\frac{#?}{#?}',
  '/': '\\frac{#?}{#?}',
  '\\sqrt': '\\sqrt{#?}',
  '\\nthroot': '\\sqrt[#?]{#?}',
  '\\overline': '\\overline{#?}',
  '\\overrightarrow': '\\overrightarrow{#?}',
  '\\overleftrightarrow': '\\overleftrightarrow{#?}',
  '\\overarc': '\\overarc{#?}',
  '\\longdiv': '\\longdiv{#?}',
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
    const value = parts.map((c) => COMMANDS_WITH_ARGS[c] || c).join('');

    return { type: 'insert', value };
  }

  if (key.keystroke) {
    const selector = KEYSTROKES[key.keystroke];

    return selector ? { type: 'command', value: selector } : undefined;
  }

  return undefined;
};

export { COMMANDS_WITH_ARGS, KEYSTROKES };
