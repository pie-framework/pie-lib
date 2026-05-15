import { normalizeLatex, convertLatexToMarkup } from '../mathlive-instance';

describe('normalizeLatex', () => {
  it('replaces \\embed{newLine}[] with \\\\', () => {
    expect(normalizeLatex('a\\embed{newLine}[]b')).toBe('a\\\\b');
  });

  it('replaces \\MathQuillMathField[r1]{} with \\placeholder[r1]{}', () => {
    expect(normalizeLatex('\\MathQuillMathField[r1]{}')).toBe('\\placeholder[r1]{}');
  });

  it('handles null/undefined gracefully', () => {
    expect(normalizeLatex(null)).toBeNull();
    expect(normalizeLatex(undefined)).toBeUndefined();
  });
});

describe('convertLatexToMarkup', () => {
  it('returns markup string', () => {
    const result = convertLatexToMarkup('\\frac{1}{2}');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
