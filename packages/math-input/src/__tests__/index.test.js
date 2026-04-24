import { addBrackets, removeBrackets, registerEmbed, applyStaticMath } from '../index';

describe('math-input index', () => {
  it('exports registerEmbed and applyStaticMath', () => {
    expect(typeof registerEmbed).toBe('function');
    expect(typeof applyStaticMath).toBe('function');
  });

  describe('addBrackets', () => {
    it('should add both brackets to a plain string', () => {
      expect(addBrackets('x^2')).toBe('\\(x^2\\)');
    });

    it('should not add left bracket if already present', () => {
      expect(addBrackets('\\(x^2')).toBe('\\(x^2\\)');
    });

    it('should not add right bracket if already present', () => {
      expect(addBrackets('x^2\\)')).toBe('\\(x^2\\)');
    });

    it('should not add brackets if both are already present', () => {
      expect(addBrackets('\\(x^2\\)')).toBe('\\(x^2\\)');
    });

    it('should handle empty string', () => {
      expect(addBrackets('')).toBe('\\(\\)');
    });

    it('should handle complex latex expressions', () => {
      expect(addBrackets('\\frac{1}{2}')).toBe('\\(\\frac{1}{2}\\)');
    });

    it('should handle expressions with parentheses', () => {
      expect(addBrackets('(x+y)')).toBe('\\((x+y)\\)');
    });

    it('should not confuse regular parentheses with latex brackets', () => {
      expect(addBrackets('(x)')).toBe('\\((x)\\)');
    });

    it('should handle expressions with backslashes', () => {
      expect(addBrackets('\\sin(x)')).toBe('\\(\\sin(x)\\)');
    });
  });

  describe('removeBrackets', () => {
    it('should remove both brackets from a bracketed string', () => {
      expect(removeBrackets('\\(x^2\\)')).toBe('x^2');
    });

    it('should not remove left bracket if not present', () => {
      expect(removeBrackets('x^2\\)')).toBe('x^2');
    });

    it('should not remove right bracket if not present', () => {
      expect(removeBrackets('\\(x^2')).toBe('x^2');
    });

    it('should not remove brackets if none are present', () => {
      expect(removeBrackets('x^2')).toBe('x^2');
    });

    it('should handle empty bracketed string', () => {
      expect(removeBrackets('\\(\\)')).toBe('');
    });

    it('should handle complex latex expressions', () => {
      expect(removeBrackets('\\(\\frac{1}{2}\\)')).toBe('\\frac{1}{2}');
    });

    it('should handle expressions with parentheses', () => {
      expect(removeBrackets('\\((x+y)\\)')).toBe('(x+y)');
    });

    it('should only remove latex brackets, not regular parentheses', () => {
      expect(removeBrackets('\\((x)\\)')).toBe('(x)');
    });

    it('should handle nested latex commands', () => {
      expect(removeBrackets('\\(\\sqrt{x^2+y^2}\\)')).toBe('\\sqrt{x^2+y^2}');
    });

    it('should handle multiple backslashes', () => {
      expect(removeBrackets('\\(\\\\text{hello}\\)')).toBe('\\\\text{hello}');
    });
  });

  describe('addBrackets and removeBrackets symmetry', () => {
    it('should be inverse operations for plain strings', () => {
      const original = 'x^2+y^2';
      expect(removeBrackets(addBrackets(original))).toBe(original);
    });

    it('should be inverse operations for latex expressions', () => {
      const original = '\\frac{a}{b}';
      expect(removeBrackets(addBrackets(original))).toBe(original);
    });

    it('should be inverse operations for complex expressions', () => {
      const original = '\\sqrt{\\frac{x^2+y^2}{z}}';
      expect(removeBrackets(addBrackets(original))).toBe(original);
    });

    it('should handle idempotency - adding brackets twice', () => {
      const original = 'x+y';
      const once = addBrackets(original);
      const twice = addBrackets(once);
      expect(once).toBe(twice);
      expect(once).toBe('\\(x+y\\)');
    });

    it('should handle idempotency - removing brackets twice', () => {
      const original = '\\(x+y\\)';
      const once = removeBrackets(original);
      const twice = removeBrackets(once);
      expect(once).toBe(twice);
      expect(once).toBe('x+y');
    });
  });

  describe('edge cases', () => {
    describe('addBrackets edge cases', () => {
      it('should handle string with only left bracket', () => {
        expect(addBrackets('\\(')).toBe('\\(\\)');
      });

      it('should handle string with only right bracket', () => {
        expect(addBrackets('\\)')).toBe('\\(\\)');
      });

      it('should handle string that starts with \\( in the middle', () => {
        expect(addBrackets('x\\(y')).toBe('\\(x\\(y\\)');
      });

      it('should handle string that ends with \\) in the middle', () => {
        expect(addBrackets('x\\)y')).toBe('\\(x\\)y\\)');
      });

      it('should handle very long latex expressions', () => {
        const long = '\\frac{1}{2}+\\frac{3}{4}+\\frac{5}{6}+\\frac{7}{8}';
        expect(addBrackets(long)).toBe(`\\(${long}\\)`);
      });
    });

    describe('removeBrackets edge cases', () => {
      it('should handle string with only left bracket', () => {
        expect(removeBrackets('\\(')).toBe('');
      });

      it('should handle string with only right bracket', () => {
        expect(removeBrackets('\\)')).toBe('');
      });

      it('should not remove brackets in the middle of string', () => {
        expect(removeBrackets('x\\(middle\\)y')).toBe('x\\(middle\\)y');
      });
    });
  });

  describe('special characters and unicode', () => {
    it('should handle expressions with special math symbols', () => {
      expect(addBrackets('π')).toBe('\\(π\\)');
      expect(removeBrackets('\\(π\\)')).toBe('π');
    });

    it('should handle expressions with greek letters', () => {
      expect(addBrackets('\\alpha+\\beta')).toBe('\\(\\alpha+\\beta\\)');
      expect(removeBrackets('\\(\\alpha+\\beta\\)')).toBe('\\alpha+\\beta');
    });

    it('should handle expressions with subscripts and superscripts', () => {
      expect(addBrackets('x_1^2')).toBe('\\(x_1^2\\)');
      expect(removeBrackets('\\(x_1^2\\)')).toBe('x_1^2');
    });
  });

  describe('whitespace handling', () => {
    it('should preserve whitespace in addBrackets', () => {
      expect(addBrackets(' x + y ')).toBe('\\( x + y \\)');
    });

    it('should preserve whitespace in removeBrackets', () => {
      expect(removeBrackets('\\( x + y \\)')).toBe(' x + y ');
    });

    it('should handle strings with only whitespace', () => {
      expect(addBrackets('   ')).toBe('\\(   \\)');
      expect(removeBrackets('\\(   \\)')).toBe('   ');
    });

    it('should handle newlines', () => {
      expect(addBrackets('x\ny')).toBe('\\(x\ny\\)');
      expect(removeBrackets('\\(x\ny\\)')).toBe('x\ny');
    });

    it('should handle tabs', () => {
      expect(addBrackets('x\ty')).toBe('\\(x\ty\\)');
      expect(removeBrackets('\\(x\ty\\)')).toBe('x\ty');
    });
  });

  describe('real-world latex examples', () => {
    const examples = [
      '\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}',
      '\\int_{0}^{\\infty} e^{-x^2} dx',
      '\\sum_{n=1}^{\\infty} \\frac{1}{n^2}',
      '\\lim_{x\\to\\infty} \\frac{1}{x}',
      '\\begin{matrix}a&b\\\\c&d\\end{matrix}',
      '\\sqrt[3]{x^3+y^3}',
      'f(x)=\\begin{cases}x^2&x\\geq0\\\\-x^2&x<0\\end{cases}',
    ];

    examples.forEach((latex, index) => {
      it(`should handle complex latex example ${index + 1}`, () => {
        const withBrackets = addBrackets(latex);
        expect(withBrackets).toBe(`\\(${latex}\\)`);
        expect(removeBrackets(withBrackets)).toBe(latex);
      });
    });
  });

  describe('boundary conditions', () => {
    it('should handle very short strings', () => {
      expect(addBrackets('x')).toBe('\\(x\\)');
      expect(removeBrackets('\\(x\\)')).toBe('x');
    });

    it('should handle single character', () => {
      expect(addBrackets('a')).toBe('\\(a\\)');
      expect(removeBrackets('\\(a\\)')).toBe('a');
    });

    it('should handle string that is exactly "\\(\\)"', () => {
      expect(addBrackets('\\(\\)')).toBe('\\(\\)');
      expect(removeBrackets('\\(\\)')).toBe('');
    });

    it('should handle string with length exactly 2', () => {
      expect(addBrackets('xy')).toBe('\\(xy\\)');
    });

    it('should handle string with length exactly 3', () => {
      expect(addBrackets('xyz')).toBe('\\(xyz\\)');
    });
  });
});
