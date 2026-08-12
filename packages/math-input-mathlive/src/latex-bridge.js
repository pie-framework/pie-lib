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
 * mathfield. So an actual glyph is required.
 *
 * Live mathfields need none of this - MathLive manages empty slots itself.
 */
const EMPTY_SLOT = '\\htmlData{pie-empty=1}{\\unicode{"25AB}}';
const EMPTY_GROUP_REGEX = /\{\s*\}/g;

/**
 * Make empty argument slots visible, for static rendering.
 *
 * Display-only: never feed the result to a mathfield or to storage - the
 * original latex is what gets typed and saved.
 *
 * @param {string} latex
 * @returns {string}
 */
export const withVisibleEmptySlots = (latex) => (latex || '').replace(EMPTY_GROUP_REGEX, `{${EMPTY_SLOT}}`);

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
