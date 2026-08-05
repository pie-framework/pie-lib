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
