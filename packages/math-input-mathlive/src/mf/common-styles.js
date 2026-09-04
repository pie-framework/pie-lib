/**
 * Shared MathLive styling.
 *
 * Replaces @pie-lib/math-input's `common-mq-styles.js`. That file was built
 * around MathQuill's `.mq-*` class names, none of which exist in MathLive
 * output, so the selectors here target MathLive's own structure instead.
 *
 * The four named groups are kept because consumers destructure them:
 *
 *   const { commonMqFontStyles, commonMqKeyboardStyles, longdivStyles, supsubStyles }
 *     = mq.CommonMqStyles;   // math-toolbar/src/editor-and-pad.jsx, math-preview.jsx
 *
 * Most are intentionally near-empty: MathLive sizes scripts, radicals and
 * fences correctly on its own, so the MathQuill-era corrections are not needed.
 * They stay as documented extension points rather than being deleted, so the
 * destructuring above keeps working.
 */

/**
 * Font styling. MathQuill needed explicit MathJax font families to match the
 * static renderer; MathLive ships the KaTeX fonts it renders with, so this only
 * smooths rendering and lets the host override the family.
 */
export const commonMqFontStyles = {
  '-webkit-font-smoothing': 'antialiased',
  '& math-field': {
    fontFamily: 'inherit',
  },
};

/**
 * Long division. The MathQuill fork drew this with nested `.mq-longdiv-*`
 * elements that needed manual offsets; here it comes from the `\longdiv` macro
 * (see `PIE_MACROS`), tagged with `data-pie-macro="longdiv"`.
 */
export const longdivStyles = {
  '& [data-pie-macro="longdiv"]': {
    display: 'inline-flex',
  },
};

/**
 * Superscript/subscript sizing. MathLive follows TeX metrics, so no overrides
 * are required.
 */
export const supsubStyles = {};

/** Empty placeholder boxes (answer blocks / open slots). */
export const placeholderStyles = {
  '& .ML__placeholder': {
    borderBottom: '1px solid currentColor',
    minWidth: '1em',
  },
  // Stand-in glyph for an empty argument slot in STATIC math (see
  // `withVisibleEmptySlots`). Muted so it reads as "a slot goes here" rather
  // than as part of the symbol, matching how MathQuill shaded `.mq-empty`.
  '& [data-pie-empty]': {
    opacity: 0.5,
  },
  // Stretchy accents (\overarc, \overleftrightarrow, \overrightarrow) render an
  // <svg width="100%" preserveAspectRatio="none"> inside a `.ML__stretchy`. That
  // span is absolutely positioned, so its immediate wrapper computes to 0px and
  // the width has to resolve against a *positioned* ancestor. Pin that to
  // `.ML__base`, whose width already equals the accent's content (measured:
  // 9.85px for a 0.56em slot), so the arc spans exactly its content.
  //
  // Do NOT write a bare `& svg` rule instead: MathLive's own rule is
  // descendant-scoped (`.ML__latex .ML__stretchy svg`), and a global one
  // re-parents every svg in the subtree.
  '& .ML__base': {
    position: 'relative',
  },
  '& .ML__stretchy': {
    position: 'absolute',
    left: 0,
    width: '100%',
  },
  // MathLive centres an accent by shifting it right half the content width -
  // `margin-left: 0.28em` for a 0.56em slot - which assumes a glyph with its own
  // side bearings. Over a synthetic empty slot it just pushes the arc right.
  //
  // `!important` is required: MathLive writes this as an INLINE style
  // (`style="top:-3.4em;margin-left:0.28em"`), which a class cannot override.
  //
  // It also fixes the width. `.ML__center` is the stretchy's containing block
  // (MathLive gives `.ML__vlist > span` position:relative), and its width is the
  // base minus that margin - measured 9.85px - 4.93px = 4.93px, exactly half,
  // which is why the arc came out half-width AND offset right.
  //
  // Scoped with `:has(.ML__stretchy)`: only stretchy accents are affected.
  // A single-glyph accent (`\hat{x}`, `\vec{x}`) genuinely needs its centring
  // offset, and must keep it.
  '& .ML__center:has(.ML__stretchy)': {
    marginLeft: '0 !important',
  },
};

/**
 * Styling for the on-screen keyboard and any container rendering math labels.
 * Also hides MathLive's own affordances, since pie supplies its own keypad.
 */
export const commonMqKeyboardStyles = {
  ...commonMqFontStyles,
  ...longdivStyles,
  ...placeholderStyles,
  touchAction: 'manipulation',
  '& math-field': {
    fontSize: 'inherit',
    outline: 'none',
  },
  '& math-field::part(virtual-keyboard-toggle)': {
    display: 'none',
  },
  '& math-field::part(menu-toggle)': {
    display: 'none',
  },
};

/** Everything combined - the common case for a container of math. */
export const commonMathLiveStyles = {
  ...commonMqFontStyles,
  ...longdivStyles,
  ...supsubStyles,
  ...placeholderStyles,
  '& math-field': {
    fontSize: 'inherit',
    outline: 'none',
  },
  '& math-field::part(virtual-keyboard-toggle)': {
    display: 'none',
  },
  '& math-field::part(menu-toggle)': {
    display: 'none',
  },
};

export const commonKeyboardStyles = commonMqKeyboardStyles;

/**
 * Default export mirrors @pie-lib/math-input's `CommonMqStyles` object so
 * existing destructuring keeps working.
 */
export default {
  commonMqFontStyles,
  longdivStyles,
  supsubStyles,
  commonMqKeyboardStyles,
  placeholderStyles,
  commonMathLiveStyles,
};
