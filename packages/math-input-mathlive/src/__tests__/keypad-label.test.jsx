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
    expect(out).toContain('25AB'); // white small square
    expect(out).toContain('pie-empty');
  });

  it('handles every empty-group key shape', () => {
    ['\\frac{}{}', '\\overline{}', 'x^{}', 'x_{}', '\\sqrt{}', '\\sqrt[{}]{}', '\\abs{}', '\\log_{}', '\\longdiv{}'].forEach(
      (latex) => {
        expect(latexForDisplay(latex)).not.toContain('{}');
      },
    );
  });

  it('treats a whitespace-only group as empty', () => {
    // e.g. \frac{x}{ }
    expect(latexForDisplay('\\frac{x}{ }')).toContain('pie-empty');
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
