import {
  toMathLive,
  fromMathLive,
  fieldIds,
  keyToAction,
  toNativeCommands,
  NEWLINE_EMBED,
  DEFAULT_FIELD_ID,
} from '../latex-bridge';

describe('latex-bridge', () => {
  describe('toMathLive', () => {
    it('passes plain latex through', () => {
      expect(toMathLive('\\frac{1}{2}')).toEqual('\\frac{1}{2}');
    });

    it('handles empty/nullish', () => {
      expect(toMathLive('')).toEqual('');
      expect(toMathLive(undefined)).toEqual('');
      expect(toMathLive(null)).toEqual('');
    });

    it('converts a newLine embed to a multiline environment', () => {
      expect(toMathLive(`a${NEWLINE_EMBED}b`)).toEqual('\\displaylines{a \\\\ b}');
    });

    it('converts multiple newLine embeds', () => {
      expect(toMathLive(`a${NEWLINE_EMBED}b${NEWLINE_EMBED}c`)).toEqual('\\displaylines{a \\\\ b \\\\ c}');
    });

    it('converts MathQuill answer blocks to placeholders', () => {
      expect(toMathLive('x=\\MathQuillMathField[r1]{}')).toEqual('x=\\placeholder[r1]{}');
    });

    it('preserves answer block content', () => {
      expect(toMathLive('\\MathQuillMathField[r2]{7}')).toEqual('\\placeholder[r2]{7}');
    });

    it('defaults an unnamed answer block id', () => {
      expect(toMathLive('\\MathQuillMathField[]{}')).toEqual(`\\placeholder[${DEFAULT_FIELD_ID}]{}`);
    });

    it('handles answer blocks and newlines together', () => {
      expect(toMathLive(`\\MathQuillMathField[r1]{}${NEWLINE_EMBED}x`)).toEqual(
        '\\displaylines{\\placeholder[r1]{} \\\\ x}',
      );
    });
  });

  describe('fromMathLive', () => {
    it('passes plain latex through', () => {
      expect(fromMathLive('\\frac{1}{2}')).toEqual('\\frac{1}{2}');
    });

    it('unwraps displaylines back to newLine embeds', () => {
      expect(fromMathLive('\\displaylines{a \\\\ b}')).toEqual(`a${NEWLINE_EMBED}b`);
    });

    it('converts placeholders back to MathQuill answer blocks', () => {
      expect(fromMathLive('x=\\placeholder[r1]{}')).toEqual('x=\\MathQuillMathField[r1]{}');
    });

    it('round-trips a newline document', () => {
      const stored = `a${NEWLINE_EMBED}b${NEWLINE_EMBED}c`;

      expect(fromMathLive(toMathLive(stored))).toEqual(stored);
    });

    it('round-trips an answer-block document', () => {
      const stored = 'x=\\MathQuillMathField[r1]{}+\\MathQuillMathField[r2]{3}';

      expect(fromMathLive(toMathLive(stored))).toEqual(stored);
    });

    // MathLive serialises empty slots as \placeholder{}, which MathJax (used by
    // @pie-lib/math-rendering for prompts/previews) renders as red error text.
    it('strips unnamed placeholders that MathLive adds', () => {
      expect(fromMathLive('\\longdiv{\\placeholder{}}')).toEqual('\\longdiv{}');
      expect(fromMathLive('\\frac{\\placeholder{}}{\\placeholder{}}')).toEqual('\\frac{}{}');
    });

    it('keeps content inside an unnamed placeholder', () => {
      expect(fromMathLive('\\sqrt{\\placeholder{7}}')).toEqual('\\sqrt{7}');
    });

    it('handles a bare \\placeholder with no argument', () => {
      expect(fromMathLive('\\longdiv{\\placeholder}')).toEqual('\\longdiv{}');
    });

    it('never leaks the token \\placeholder', () => {
      ['\\longdiv{\\placeholder{}}', '\\frac{\\placeholder{}}{x}', '\\placeholder{}'].forEach((l) => {
        expect(fromMathLive(l)).not.toContain('\\placeholder');
      });
    });

    it('still maps NAMED placeholders to answer blocks', () => {
      // named ones are answer blocks and must survive
      expect(fromMathLive('\\placeholder[r1]{}')).toEqual('\\MathQuillMathField[r1]{}');
    });

    it('round-trips answer blocks combined with newlines', () => {
      const stored = `\\MathQuillMathField[r1]{}${NEWLINE_EMBED}y`;

      expect(fromMathLive(toMathLive(stored))).toEqual(stored);
    });
  });

  // A MathLive macro serialises from the arguments it was created with, so text
  // typed inside its expansion never comes back out of getValue('latex').
  // Argument-taking pie commands must therefore become native constructs before
  // they reach a mathfield.
  describe('toNativeCommands', () => {
    it('expands \\longdiv to native \\enclose', () => {
      expect(toNativeCommands('\\longdiv{1234}')).toEqual('\\enclose{longdiv}{1234}');
      expect(toNativeCommands('\\longdiv{}')).toEqual('\\enclose{longdiv}{}');
    });

    it('expands \\overarc to native \\overparen', () => {
      expect(toNativeCommands('\\overarc{AB}')).toEqual('\\overparen{AB}');
    });

    it('expands \\abs to native \\left|..\\right|', () => {
      expect(toNativeCommands('\\abs{x}')).toEqual('\\left|x\\right|');
      expect(toNativeCommands('\\abs{}')).toEqual('\\left|\\right|');
    });

    it('handles nested braces inside \\abs', () => {
      expect(toNativeCommands('\\abs{\\frac{1}{2}}')).toEqual('\\left|\\frac{1}{2}\\right|');
    });

    it('handles several occurrences', () => {
      expect(toNativeCommands('\\abs{a}+\\abs{b}')).toEqual('\\left|a\\right|+\\left|b\\right|');
      expect(toNativeCommands('\\longdiv{1}\\longdiv{2}')).toEqual('\\enclose{longdiv}{1}\\enclose{longdiv}{2}');
    });

    it('leaves other latex untouched', () => {
      ['\\frac{1}{2}', '\\pi', '\\sqrt{x}', '\\overline{AB}'].forEach((l) => {
        expect(toNativeCommands(l)).toEqual(l);
      });
    });

    it('handles nullish input', () => {
      expect(toNativeCommands(undefined)).toEqual('');
      expect(toNativeCommands('')).toEqual('');
    });

    it('is applied by toMathLive', () => {
      expect(toMathLive('\\longdiv{5}')).toEqual('\\enclose{longdiv}{5}');
    });

    it('does not leave a pie macro in what reaches the field', () => {
      ['\\longdiv{7}', '\\abs{7}', '\\overarc{7}'].forEach((l) => {
        const out = toMathLive(l);

        expect(out).not.toMatch(/\\longdiv|\\abs|\\overarc/);
      });
    });
  });

  describe('fieldIds', () => {
    it('returns ids in document order', () => {
      expect(fieldIds('\\MathQuillMathField[r1]{}+\\MathQuillMathField[r2]{}')).toEqual(['r1', 'r2']);
    });

    it('returns [] when there are none', () => {
      expect(fieldIds('x+y')).toEqual([]);
      expect(fieldIds(undefined)).toEqual([]);
    });

    it('is repeatable (regex lastIndex is reset)', () => {
      const latex = '\\MathQuillMathField[r1]{}';

      expect(fieldIds(latex)).toEqual(['r1']);
      expect(fieldIds(latex)).toEqual(['r1']);
    });
  });

  describe('keyToAction', () => {
    it('prefers latex when there is no command', () => {
      expect(keyToAction({ latex: '\\pi', write: 'p' })).toEqual({ type: 'insert', value: '\\pi' });
    });

    it('uses write', () => {
      expect(keyToAction({ write: 'x' })).toEqual({ type: 'insert', value: 'x' });
    });

    it('expands commands that take arguments into placeholders', () => {
      expect(keyToAction({ command: '\\frac' })).toEqual({ type: 'insert', value: '\\frac{#?}{#?}' });
      expect(keyToAction({ command: '\\sqrt' })).toEqual({ type: 'insert', value: '\\sqrt{#?}' });
      expect(keyToAction({ command: '^' })).toEqual({ type: 'insert', value: '^{#?}' });
    });

    it('passes argument-less commands through', () => {
      expect(keyToAction({ command: '\\pi' })).toEqual({ type: 'insert', value: '\\pi' });
    });

    it('concatenates array commands (MathQuill cmd() applied them in sequence)', () => {
      // Measured Angle
      expect(keyToAction({ command: ['m', '\\angle'] })).toEqual({ type: 'insert', value: 'm\\angle' });
      // log base n - the `_` part must still expand to a placeholder
      expect(keyToAction({ command: ['\\log', '_'] })).toEqual({ type: 'insert', value: '\\log_{#?}' });
    });

    it('always returns a string value for insert actions', () => {
      [{ command: ['m', '\\angle'] }, { command: '\\frac' }, { write: 'x' }, { latex: '\\pi' }].forEach((k) => {
        expect(typeof keyToAction(k).value).toBe('string');
      });
    });

    it('maps keystrokes to MathLive selectors', () => {
      expect(keyToAction({ keystroke: 'Left' })).toEqual({ type: 'command', value: 'moveToPreviousChar' });
      expect(keyToAction({ keystroke: 'Right' })).toEqual({ type: 'command', value: 'moveToNextChar' });
      expect(keyToAction({ keystroke: 'Backspace' })).toEqual({ type: 'command', value: 'deleteBackward' });
    });

    it('returns undefined for unknown/empty input', () => {
      expect(keyToAction(undefined)).toBeUndefined();
      expect(keyToAction({})).toBeUndefined();
      expect(keyToAction({ keystroke: 'Nope' })).toBeUndefined();
    });

    it('latex wins over command only when command is absent', () => {
      // a key with both should use the command path (matches MathInput.keypadPress)
      expect(keyToAction({ latex: '\\frac{}{}', command: '\\frac' })).toEqual({
        type: 'insert',
        value: '\\frac{#?}{#?}',
      });
    });
  });
});
