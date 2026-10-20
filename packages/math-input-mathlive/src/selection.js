import debug from 'debug';

const log = debug('pie-lib:math-input-mathlive:selection');

/**
 * Widen a selection so it covers whole atoms of a single parent.
 *
 * MathLive extends a selection over *flat offsets*, so Shift+Arrow walks into
 * a fraction instead of over it: from before `2x` in `5x^2+2x+\frac{\pi}{2}-4`,
 * five presses select `2x+` plus the `\pi` of the numerator, and copying gives
 * `2x+\pi`. MathQuill treated a fraction (root, superscript...) as one unit,
 * which is what authors expect.
 *
 * The tree is recovered from MathLive's public `getElementInfo(offset)`, where
 * offset `i` describes the atom ending at caret position `i`:
 *
 *  - a composite atom (fraction, root, script) owns the offset right *after*
 *    its children; the children are one level deeper;
 *  - each branch (numerator, denominator, radicand) opens with an empty-latex
 *    "start" atom.
 *
 * The rule: find the shallowest depth the selection touches, counting the caret
 * it starts from. If the range crosses into a sibling branch at that depth, the
 * real common parent is one level up. Then push both ends out of anything
 * deeper. A script atom (`^2`) is kept with its base, since MathLive stores
 * `x^2` as `x` followed by a separate `^2` atom.
 *
 * Pure, so it can be tested without a browser.
 *
 * @param {number} start
 * @param {number} end
 * @param {function(number): {depth?: number, latex?: string}} info
 * @param {number} lastOffset
 * @returns {[number, number]} the widened range, start <= end
 */
export const expandRange = (start, end, info, lastOffset) => {
  const at = (i) => info(i) || {};
  const depth = (i) => at(i).depth || 0;
  const isBranchStart = (i) => depth(i) > 0 && at(i).latex === '';

  if (end < start) {
    [start, end] = [end, start];
  }

  if (end - start < 1) {
    return [start, end];
  }

  let target = Infinity;

  for (let i = start; i <= end; i++) {
    target = Math.min(target, depth(i));
  }

  for (let i = start + 1; i <= end; i++) {
    if (depth(i) === target && isBranchStart(i)) {
      target -= 1;
      break;
    }
  }

  target = Math.max(target, 0);

  while (start > 0 && depth(start) > target) {
    start -= 1;
  }

  while (end < lastOffset && depth(end) > target) {
    end += 1;
  }

  // Keep a superscript / subscript with its base.
  let first = start + 1;

  while (first <= end && depth(first) > target) {
    first += 1;
  }

  if (start > 0 && first <= end && /^[\^_]/.test(at(first).latex || '') && depth(start) === target) {
    start -= 1;
  }

  return [start, end];
};

/**
 * Keep a mathfield's selection snapped to whole atoms (see {@link expandRange}).
 *
 * This fixes both what the user sees highlighted and what copy/cut put on the
 * clipboard, since both come from the selection. The selection direction is
 * preserved, so further Shift+Arrow presses keep extending the same end.
 *
 * @param {HTMLElement} mathField a MathLive `<math-field>`
 * @returns {function|undefined} teardown, to call on unmount
 */
export const trackWholeAtomSelection = (mathField) => {
  if (!mathField || typeof mathField.addEventListener !== 'function') {
    return undefined;
  }

  let applying = false;

  const update = () => {
    if (applying) {
      return;
    }

    try {
      if (mathField.selectionIsCollapsed || typeof mathField.getElementInfo !== 'function') {
        return;
      }

      const selection = mathField.selection;
      const range = selection && selection.ranges && selection.ranges[0];

      if (!range) {
        return;
      }

      const [start, end] = range;
      const lo = Math.min(start, end);
      const hi = Math.max(start, end);
      const [nextStart, nextEnd] = expandRange(lo, hi, (i) => mathField.getElementInfo(i), mathField.lastOffset);

      if (nextStart === lo && nextEnd === hi) {
        return;
      }

      applying = true;
      mathField.selection = { ranges: [[nextStart, nextEnd]], direction: selection.direction };
    } catch (e) {
      log('could not normalise the selection: %s', e && e.message);
    } finally {
      applying = false;
    }
  };

  mathField.addEventListener('selection-change', update);

  return () => mathField.removeEventListener('selection-change', update);
};
