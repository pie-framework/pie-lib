import debug from 'debug';

const log = debug('pie-lib:math-input-mathlive:longdiv');

/**
 * Long division (`\enclose{longdiv}{...}`, which `\longdiv` is mapped to).
 *
 * MathLive 0.110 draws it wrong in three ways, all in `EncloseAtom.render`:
 *
 *  1. It lowers the dividend by `padding + clearance` (0.45em) with
 *     `position: relative; top`, which moves it off the baseline, so the divisor
 *     looks too high.
 *  2. The notation box's CSS width leaves out the room it made for the `)`,
 *     while the SVG's viewBox includes it. The SVG is stretched to 100% of the
 *     box, so the whole drawing is scaled down (to about 86%).
 *  3. The bar is drawn `base.width` long from the `)`, but the dividend itself
 *     starts after the `)` and its gap, so the bar stops short of the end of
 *     the dividend. `base.width` also leaves out the spacing MathLive puts
 *     around `,` and `+`, so even the right length would come up short.
 *
 * This reads back the numbers MathLive wrote into inline styles and the SVG,
 * and corrects them, so the rest of MathLive's drawing (the arc, the stroke
 * weight) is kept. The bar's end is measured from the rendered dividend when
 * the markup is laid out, and computed from MathLive's numbers otherwise.
 *
 * Every value set here is absolute, so running it again is harmless - it has
 * to run after every render of a live field anyway.
 */

/** A length MathLive wrote as `prop:<n>em` in an inline style, or 0. */
const inlineEm = (style, prop) => {
  const match = new RegExp(`(?:^|;)\\s*${prop}:\\s*(-?[\\d.]+)em`).exec(style || '');

  return match ? parseFloat(match[1]) : 0;
};

/**
 * Direct child with a given tag. Not `querySelector(':scope > tag')`: jsdom's
 * selector engine does not support `:scope` inside SVG elements.
 */
const childTag = (el, tag) => el && Array.from(el.children || []).find((c) => c.tagName.toLowerCase() === tag);

/** Right edge of what is actually drawn inside an element, ignoring the caret. */
const drawnRight = (el) => {
  let right = -Infinity;

  el.querySelectorAll('*').forEach((child) => {
    if (child.children.length || (child.classList && child.classList.contains('ML__caret'))) {
      return;
    }

    const rect = child.getBoundingClientRect();

    if (rect.width > 0) {
      right = Math.max(right, rect.right);
    }
  });

  return right;
};

/**
 * Correct every long division under `root`.
 *
 * @param {ParentNode} root a mathfield's shadow root, or an element holding
 *   static MathLive markup
 * @returns {number} how many were corrected
 */
export const fixLongDivision = (root) => {
  if (!root || typeof root.querySelectorAll !== 'function') {
    return 0;
  }

  let fixed = 0;

  root.querySelectorAll('.ML__notation').forEach((notation) => {
    try {
      const svg = childTag(notation, 'svg');
      const line = childTag(svg, 'line');

      // Long division is the only notation MathLive draws with an arc (<path>).
      if (!line || !childTag(svg, 'path')) {
        return;
      }

      const dividend = notation.nextElementSibling;
      const style = dividend && dividend.getAttribute('style');
      const width = inlineEm(style, 'width');
      const gap = inlineEm(style, 'margin-left');
      const drop = inlineEm(style, 'top');
      const viewBox = (svg.getAttribute('viewBox') || '').trim().split(/\s+/).map(Number);
      const start = parseFloat(line.getAttribute('x1'));

      if (!width || viewBox.length !== 4 || Number.isNaN(start)) {
        return;
      }

      // 2. size the box to the viewBox, so the drawing is not scaled down
      notation.style.width = `calc(${viewBox[2]}em + 1px)`;

      // 1. put the dividend back on the baseline. Growing the box upwards by the
      // same amount keeps the drawing where it was relative to the dividend, and
      // makes the line tall enough that the field does not clip the bar.
      if (drop && notation.parentElement) {
        dividend.style.top = '0';
        notation.parentElement.style.paddingTop = `${drop}em`;
      }

      // 3. run the bar from the ")" to the end of the dividend
      let end = start + gap + width;
      const svgRect = svg.getBoundingClientRect();
      const right = drawnRight(dividend);

      if (svgRect.width > 0 && Number.isFinite(right)) {
        end = (right - svgRect.left) * (viewBox[2] / svgRect.width);
      }

      line.setAttribute('x2', String(end));
      fixed += 1;
    } catch (e) {
      log('could not correct a long division: %s', e && e.message);
    }
  });

  return fixed;
};

/**
 * Correct static markup now, and again once web fonts have loaded: the bar's
 * end is measured, and glyph widths change when the math fonts arrive.
 *
 * @param {Element} element
 */
export const fixLongDivisionWhenReady = (element) => {
  fixLongDivision(element);

  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => fixLongDivision(element)).catch(() => {});
  }
};

/**
 * Keep a live mathfield's long divisions corrected. MathLive rebuilds its shadow
 * DOM on every render (each keystroke, a resize, the fonts loading), which
 * discards the corrections, so they are reapplied whenever it does.
 *
 * @param {HTMLElement} mathField a MathLive `<math-field>`
 * @returns {function|undefined} teardown, to call on unmount
 */
export const trackLongDivision = (mathField) => {
  const root = mathField && mathField.shadowRoot;

  if (!root) {
    return undefined;
  }

  const run = () => fixLongDivision(root);

  run();

  if (typeof MutationObserver === 'undefined') {
    return () => {};
  }

  // Only childList: the corrections themselves change attributes, so they do
  // not retrigger this.
  const observer = new MutationObserver(run);

  observer.observe(root, { childList: true, subtree: true });

  return () => observer.disconnect();
};
