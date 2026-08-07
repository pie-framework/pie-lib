import { KEYSTROKES, keyToAction } from '../latex-bridge';
import Input from '../mf/input';

/**
 * The imperative surface that @pie-lib/math-toolbar drives
 * (editor-and-pad.jsx: clear/command/keystroke/write/latex).
 *
 * These call the methods against a stub mathfield, because a real
 * <math-field> needs a browser. What matters here is the *translation*:
 * MathQuill-era arguments must become valid MathLive operations.
 */
const stubField = () => {
  const calls = { insert: [], executeCommand: [], focus: 0 };

  return {
    calls,
    value: '',
    getValue: () => '',
    insert(v) {
      calls.insert.push(v);
    },
    executeCommand(v) {
      calls.executeCommand.push(v);
    },
    focus() {
      calls.focus++;
    },
    blur() {},
  };
};

const withField = () => {
  const input = new Input({});
  const f = stubField();

  input.mathField = f;

  return { input, f };
};

describe('Input imperative API (drives math-toolbar)', () => {
  describe('keystroke', () => {
    it('maps MathQuill keystroke names to MathLive selectors', () => {
      const { input, f } = withField();

      input.keystroke('Left');
      input.keystroke('Right');
      input.keystroke('Backspace');

      expect(f.calls.executeCommand).toEqual(['moveToPreviousChar', 'moveToNextChar', 'deleteBackward']);
    });

    it('passes an unknown value through as a selector', () => {
      const { input, f } = withField();

      input.keystroke('deleteForward');

      expect(f.calls.executeCommand).toEqual(['deleteForward']);
    });

    it('does not throw when the engine rejects the selector', () => {
      const { input } = withField();

      input.mathField.executeCommand = () => {
        throw new Error('unknown command');
      };

      expect(() => input.keystroke('Nonsense')).not.toThrow();
    });

    it('covers every keystroke the keypad emits', () => {
      // navigation.js / edit.js only produce these three
      ['Left', 'Right', 'Backspace'].forEach((k) => expect(KEYSTROKES[k]).toBeDefined());
    });
  });

  describe('command', () => {
    it('expands argument-taking commands into placeholders', () => {
      const { input, f } = withField();

      input.command('\\frac');

      // a bare \frac would give no editable slots
      expect(f.calls.insert).toEqual(['\\frac{#?}{#?}']);
    });

    it('handles array commands', () => {
      const { input, f } = withField();

      input.command(['\\log', '_']);

      expect(f.calls.insert).toEqual(['\\log_{#?}']);
    });

    it('passes argument-less commands through', () => {
      const { input, f } = withField();

      input.command('\\pi');

      expect(f.calls.insert).toEqual(['\\pi']);
    });

    it('agrees with keyToAction', () => {
      expect(keyToAction({ command: '\\sqrt' }).value).toEqual('\\sqrt{#?}');
    });
  });

  describe('safety before MathLive loads', () => {
    it('every method is a no-op rather than a crash', () => {
      const input = new Input({});

      // mathField is undefined until loadMathLive() resolves
      expect(input.latex()).toEqual('');
      expect(input.clear()).toEqual('');
      expect(input.command('\\frac')).toEqual('');
      expect(input.keystroke('Left')).toEqual('');
      expect(input.write('x')).toEqual('');
      expect(() => input.focus()).not.toThrow();
      expect(() => input.blur()).not.toThrow();
      expect(() => input.setLatex('x')).not.toThrow();
      expect(input.element).toBeUndefined();
    });
  });

  describe('mqCompat facade', () => {
    // math-toolbar used to call this.input.mathField.latex(); external
    // consumers may still do the same.
    it('exposes latex() as a getter', () => {
      const { input } = withField();

      input.mathField.getValue = () => '\\frac{1}{2}';

      expect(input.mqCompat.latex()).toEqual('\\frac{1}{2}');
    });

    it('exposes latex(v) as a setter and el()', () => {
      const { input, f } = withField();

      input.mqCompat.latex('x+1');
      expect(f.value).toEqual('x+1');
      expect(input.mqCompat.el()).toBe(f);
    });
  });
});
