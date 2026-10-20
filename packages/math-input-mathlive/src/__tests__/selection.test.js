import { expandRange, trackWholeAtomSelection } from '../selection';

/**
 * Offset tables captured from MathLive 0.110.0 `getElementInfo(i)` in Chrome,
 * as [depth, latex] per offset. Offset `i` is the atom ending at caret `i`.
 */
const table = (rows) => (i) => (rows[i] ? { depth: rows[i][0], latex: rows[i][1] } : undefined);

// 5x^2+2x+\frac{\pi}{2}-4
const POLY = table([
  [0, ''],
  [0, '5'],
  [0, 'x'],
  [1, ''],
  [1, '2'],
  [0, '^2'],
  [0, '+'],
  [0, '2'],
  [0, 'x'],
  [0, '+'],
  [1, ''],
  [1, '\\pi'],
  [1, ''],
  [1, '2'],
  [0, '\\frac{\\pi}{2}'],
  [0, '-'],
  [0, '4'],
]);
const POLY_LAST = 16;

// a+\sqrt{x+1}+b
const ROOT = table([
  [0, ''],
  [0, 'a'],
  [0, '+'],
  [1, ''],
  [1, 'x'],
  [1, '+'],
  [1, '1'],
  [0, '\\sqrt{x+1}'],
  [0, '+'],
  [0, 'b'],
]);

// \frac{\frac{a}{b}}{c}
const NESTED = table([
  [0, ''],
  [1, ''],
  [2, ''],
  [2, 'a'],
  [2, ''],
  [2, 'b'],
  [1, '\\frac{a}{b}'],
  [1, ''],
  [1, 'c'],
  [0, '\\frac{\\frac{a}{b}}{c}'],
]);

describe('expandRange', () => {
  const poly = (a, b) => expandRange(a, b, POLY, POLY_LAST);

  it('leaves a selection of whole sibling atoms alone', () => {
    expect(poly(6, 7)).toEqual([6, 7]); // 2
    expect(poly(6, 9)).toEqual([6, 9]); // 2x+
    expect(poly(6, 15)).toEqual([6, 15]); // 2x+\frac{\pi}{2}-
    expect(poly(0, 16)).toEqual([0, 16]);
  });

  // The reported case: five Shift+Right presses from before `2x` gave `2x+\pi`.
  it('takes the whole fraction when the selection reaches into it', () => {
    expect(poly(6, 10)).toEqual([6, 14]);
    expect(poly(6, 11)).toEqual([6, 14]);
    expect(poly(6, 13)).toEqual([6, 14]);
  });

  it('takes the whole fraction when the selection leaves it', () => {
    expect(poly(11, 15)).toEqual([9, 15]); // from the pi to after the minus
  });

  it('crossing from numerator to denominator selects the fraction', () => {
    expect(poly(11, 13)).toEqual([9, 14]);
    expect(poly(11, 12)).toEqual([9, 14]);
  });

  it('a selection inside one branch stays inside it', () => {
    expect(poly(10, 11)).toEqual([10, 11]); // \pi
    expect(poly(12, 13)).toEqual([12, 13]); // the 2 of the denominator
  });

  // MathLive stores x^2 as `x` then a separate `^2` atom.
  it('keeps a superscript with its base', () => {
    expect(poly(3, 7)).toEqual([1, 7]); // x^2+2, not ^2+2
    expect(poly(4, 6)).toEqual([1, 6]); // x^2+
  });

  it('accepts a reversed range', () => {
    expect(poly(11, 6)).toEqual([6, 14]);
  });

  it('leaves a collapsed range alone', () => {
    expect(poly(11, 11)).toEqual([11, 11]);
  });

  it('handles roots the same way', () => {
    expect(expandRange(2, 4, ROOT, 9)).toEqual([2, 7]);
    expect(expandRange(4, 6, ROOT, 9)).toEqual([4, 6]); // +1 inside the radicand
  });

  it('climbs as many levels as needed in nested fractions', () => {
    expect(expandRange(2, 3, NESTED, 9)).toEqual([2, 3]); // a
    expect(expandRange(3, 5, NESTED, 9)).toEqual([1, 6]); // a/b crossing -> inner fraction
    expect(expandRange(6, 7, NESTED, 9)).toEqual([0, 9]); // inner -> outer denominator
  });

  it('tolerates missing info', () => {
    expect(expandRange(1, 3, () => undefined, 5)).toEqual([1, 3]);
  });
});

describe('trackWholeAtomSelection', () => {
  const stubField = (range, direction = 'forward') => {
    const listeners = {};

    return {
      selection: { ranges: [range], direction },
      get selectionIsCollapsed() {
        return this.selection.ranges[0][0] === this.selection.ranges[0][1];
      },
      lastOffset: POLY_LAST,
      getElementInfo: POLY,
      sets: 0,
      addEventListener(type, fn) {
        listeners[type] = fn;
      },
      removeEventListener(type, fn) {
        if (listeners[type] === fn) {
          delete listeners[type];
        }
      },
      fire(type) {
        if (listeners[type]) {
          listeners[type]();
        }
      },
      has(type) {
        return !!listeners[type];
      },
    };
  };

  const track = (field) => {
    // count assignments without breaking the getter
    let current = field.selection;

    Object.defineProperty(field, 'selection', {
      get: () => current,
      set: (v) => {
        field.sets += 1;
        current = v;
      },
    });

    return trackWholeAtomSelection(field);
  };

  it('widens the selection on selection-change', () => {
    const field = stubField([6, 11]);

    track(field);
    field.fire('selection-change');

    expect(field.selection.ranges).toEqual([[6, 14]]);
  });

  it('preserves the direction, so Shift+Arrow keeps extending the same end', () => {
    const field = stubField([11, 16], 'backward');

    track(field);
    field.fire('selection-change');

    expect(field.selection).toEqual({ ranges: [[9, 16]], direction: 'backward' });
  });

  it('does not touch a selection that is already whole', () => {
    const field = stubField([6, 9]);

    track(field);
    field.fire('selection-change');

    expect(field.sets).toBe(0);
  });

  it('ignores a collapsed caret', () => {
    const field = stubField([11, 11]);

    track(field);
    field.fire('selection-change');

    expect(field.sets).toBe(0);
  });

  it('does not recurse when its own assignment fires selection-change', () => {
    const field = stubField([6, 11]);
    let current = field.selection;

    Object.defineProperty(field, 'selection', {
      get: () => current,
      set: (v) => {
        field.sets += 1;
        current = v;
        field.fire('selection-change');
      },
    });

    trackWholeAtomSelection(field);
    field.fire('selection-change');

    expect(field.sets).toBe(1);
    expect(field.selection.ranges).toEqual([[6, 14]]);
  });

  it('survives a field that throws', () => {
    const field = stubField([6, 11]);

    field.getElementInfo = () => {
      throw new Error('boom');
    };

    track(field);

    expect(() => field.fire('selection-change')).not.toThrow();
  });

  it('tears down its listener', () => {
    const field = stubField([6, 11]);
    const untrack = track(field);

    expect(field.has('selection-change')).toBe(true);
    untrack();
    expect(field.has('selection-change')).toBe(false);
  });

  it('is a no-op without a field', () => {
    expect(trackWholeAtomSelection(undefined)).toBeUndefined();
    expect(trackWholeAtomSelection({})).toBeUndefined();
  });
});
