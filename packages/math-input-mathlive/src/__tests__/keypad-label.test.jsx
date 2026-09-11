import { withVisibleEmptySlots as latexForDisplay } from '../latex-bridge';
import { keyToAction } from '../latex-bridge';

/**
 * Keys use empty groups to show a command's shape (`\frac{}{}`, `x^{}`).
 * MathLive renders `{}` as nothing, so labels need a visible stand-in - but the
 * value that gets *inserted* must stay untouched.
 */
describe('keypad label display normalisation', () => {
  it('gives empty groups a visible glyph', () => {
    const out = latexForDisplay('\\frac{}{}');

    expect(out).not.toEqual('\\frac{}{}');
    // a \rule, not a glyph: font metrics for a substituted glyph do not match
    // MathLive's, which left stretchy accents narrower than the box
    expect(out).toContain('\\rule');
    expect(out).toContain('pie-empty');
  });

  it('handles every empty-group key shape', () => {
    [
      '\\frac{}{}',
      '\\overline{}',
      'x^{}',
      'x_{}',
      '\\sqrt{}',
      '\\sqrt[{}]{}',
      '\\abs{}',
      '\\log_{}',
      '\\longdiv{}',
    ].forEach((latex) => {
      expect(latexForDisplay(latex)).not.toContain('{}');
    });
  });

  it('treats a whitespace-only group as empty', () => {
    // e.g. \frac{x}{ }
    expect(latexForDisplay('\\frac{x}{ }')).toContain('pie-empty');
  });

  // MathQuill needed a nested \overline{} to draw the empty box. MathLive
  // renders that as a real line, so those labels showed a spurious bar (a line
  // under the arrows, and a straight line instead of the arc).
  it('accent keys do not carry the nested-overline box hack', () => {
    // eslint-disable-next-line global-require
    const geometry = require('../keys/geometry');

    Object.values(geometry).forEach((key) => {
      if (key && typeof key.latex === 'string') {
        expect(key.latex).not.toContain('\\overline{}}');
      }
    });
  });

  it('an accent over an empty slot still gets a visible box', () => {
    ['\\overleftrightarrow{}', '\\overarc{}'].forEach((latex) => {
      const out = latexForDisplay(latex);

      expect(out).toContain('pie-empty');
      expect(out).not.toContain('\\overline');
    });
  });

  // A glyph's width comes from font metrics; U+25AB is not in the KaTeX fonts,
  // so the browser substituted a wider one and stretchy accents came out
  // narrower than the box. A rule has an explicit width.
  it('the empty slot has an explicit width, not font-dependent metrics', () => {
    const out = latexForDisplay('\\overarc{}');

    expect(out).toContain('\\rule');
    expect(out).toMatch(/rule\{[\d.]+em\}\{[\d.]+em\}/);
    expect(out).not.toContain('unicode');
  });

  // Measured in the browser: the accent's immediate wrapper computes to 0px
  // (its .ML__stretchy child is absolutely positioned), so the svg width has to
  // resolve against .ML__base - whose width equals the content. Without pinning
  // that, the arc collapsed to a spike and sat right of the box.
  it('pins the accent containing block and drops the centering shift', () => {
    // eslint-disable-next-line global-require
    const { placeholderStyles } = require('../mf/common-styles');

    expect(placeholderStyles['& .ML__base'].position).toEqual('relative');
    expect(placeholderStyles['& .ML__stretchy']).toEqual({ position: 'absolute', left: 0, width: '100%' });
    // must be !important: MathLive writes margin-left as an inline style, and a
    // class cannot override that. Leaving it un-important also halved the arc's
    // width, because .ML__center is the stretchy's containing block.
    expect(placeholderStyles['& .ML__center:has(.ML__stretchy)'].marginLeft).toEqual('0 !important');
  });

  it('applies those rules wherever static math renders', () => {
    // eslint-disable-next-line global-require
    const cs = require('../mf/common-styles');

    ['commonKeyboardStyles', 'commonMathLiveStyles'].forEach((name) => {
      expect(cs[name]['& .ML__stretchy']).toBeDefined();
      expect(cs[name]['& .ML__base']).toBeDefined();
    });
  });

  // A bare `& svg` rule re-parents every svg in the subtree; MathLive's own rule
  // is descendant-scoped to .ML__latex .ML__stretchy svg.
  it('does not use a blanket svg rule', () => {
    // eslint-disable-next-line global-require
    const cs = require('../mf/common-styles');

    Object.values(cs).forEach((style) => {
      if (style && typeof style === 'object') {
        expect(Object.keys(style)).not.toContain('& svg');
      }
    });
  });

  // The Percent key showed as a blank button on the Advanced Algebra keypad
  // (row 1, position 6). MathQuill defined `LatexCmds['%']` as a symbol that
  // serialised to `\\%`, so its bare `%` label parsed fine; MathLive parses real
  // LaTeX, where `%` opens a comment - the label rendered nothing, and pressing
  // the key inserted a comment that swallowed the rest of the expression.
  it('the percent key is escaped, not a latex comment', () => {
    // eslint-disable-next-line global-require
    const { percentage } = require('../keys/misc');

    expect(percentage.latex).toEqual('\\%');
    expect(keyToAction(percentage).value).toEqual('\\%');
  });

  // Any bare `%` in a key would fail the same way, silently.
  it('no keypad key carries an unescaped %', () => {
    // eslint-disable-next-line global-require
    const { baseSet } = require('../keys');
    // eslint-disable-next-line global-require
    const { gradeSets } = require('../keys/grades');

    const every = [...baseSet, ...gradeSets.map((g) => g.set)];

    const walk = (node) => {
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }

      if (!node) {
        return;
      }

      ['latex', 'write', 'command'].forEach((field) => {
        const value = node[field];

        if (typeof value === 'string') {
          // a `%` is only safe when preceded by an odd run of backslashes
          expect(value.replace(/\\./g, '')).not.toContain('%');
        }
      });
    };

    walk(every);
  });

  it('leaves latex without empty groups alone', () => {
    ['\\pi', '\\sin', 'x^2', '\\overline{AB}'].forEach((latex) => {
      expect(latexForDisplay(latex)).toEqual(latex);
    });
  });

  it('handles nullish input', () => {
    expect(latexForDisplay(undefined)).toEqual('');
    expect(latexForDisplay('')).toEqual('');
  });

  it('does NOT affect what gets inserted into the field', () => {
    // the action must use the key's own latex, never the display form
    const key = { name: 'frac', latex: '\\frac{}{}' };

    expect(keyToAction(key).value).toEqual('\\frac{}{}');
    expect(keyToAction(key).value).not.toContain('pie-empty');
  });
});
