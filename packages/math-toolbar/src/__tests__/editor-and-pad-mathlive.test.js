import { EditorAndPad } from '../editor-and-pad';

/**
 * Covers the call sites that changed when this package moved from
 * @pie-lib/math-input (MathQuill) to @pie-lib/math-input-mathlive.
 *
 * All three were MathQuill-shaped and silently changed meaning:
 *  - shouldComponentUpdate read `this.input.mathField.latex()`, which throws now
 *    (and the field loads asynchronously, so `this.input` can be null)
 *  - the mixed-number workaround poked `__controller.cursor`, a MathQuill
 *    internal with no MathLive equivalent
 *  - onClick routes keypad presses through the imperative field API
 */
describe('EditorAndPad after the MathLive migration', () => {
  const props = (over = {}) => ({ classes: {}, classNames: {}, onChange: jest.fn(), ...over });

  describe('shouldComponentUpdate', () => {
    it('treats a missing input ref as different, so the first render is not skipped', () => {
      const c = new EditorAndPad(props({ latex: 'x' }));

      c.input = null;

      expect(c.shouldComponentUpdate({ latex: 'x' }, {})).toBe(true);
    });

    it('does not throw when the math engine has not loaded yet', () => {
      const c = new EditorAndPad(props({ latex: 'x' }));

      // latex() returns '' until MathLive is ready
      c.input = { latex: () => '' };

      expect(() => c.shouldComponentUpdate({ latex: 'x' }, {})).not.toThrow();
      expect(c.shouldComponentUpdate({ latex: 'x' }, {})).toBe(true);
    });

    it('skips the update when the field already holds the incoming latex', () => {
      const c = new EditorAndPad(props({ latex: 'x', keypadMode: 'a', noDecimal: false }));

      c.input = { latex: () => 'x' };
      c.state = { equationEditor: 'geometry' };

      expect(c.shouldComponentUpdate({ latex: 'x', keypadMode: 'a', noDecimal: false }, c.state)).toBe(false);
    });

    it('re-renders when the field differs from the incoming latex', () => {
      const c = new EditorAndPad(props({ latex: 'y' }));

      c.input = { latex: () => 'x' };

      expect(c.shouldComponentUpdate({ latex: 'y' }, {})).toBe(true);
    });

    it('uses input.latex(), never input.mathField.latex()', () => {
      const c = new EditorAndPad(props({ latex: 'x' }));
      const latex = jest.fn(() => 'x');

      // deliberately no `mathField` - the old code would have thrown here
      c.input = { latex };
      c.state = { equationEditor: 'geometry' };
      c.shouldComponentUpdate({ latex: 'x' }, c.state);

      expect(latex).toHaveBeenCalled();
    });
  });

  describe('onClick key routing', () => {
    const withInput = (over = {}) => {
      const c = new EditorAndPad(props(over));
      const calls = { write: [], command: [], keystroke: [], clear: 0 };

      c.input = {
        write: (v) => calls.write.push(v),
        command: (v) => calls.command.push(v),
        keystroke: (v) => calls.keystroke.push(v),
        clear: () => calls.clear++,
      };
      c.updateDisable = () => {};

      return { c, calls };
    };

    // toNodeData keys this off `value === 'clear'`, not `type`
    it('clear', () => {
      const { c, calls } = withInput();

      c.onClick({ value: 'clear' });
      expect(calls.clear).toBe(1);
    });

    it('command', () => {
      const { c, calls } = withInput();

      c.onClick({ type: 'command', value: '\\frac' });
      expect(calls.command).toEqual(['\\frac']);
    });

    it('cursor keystroke', () => {
      const { c, calls } = withInput();

      c.onClick({ type: 'cursor', value: 'Left' });
      expect(calls.keystroke).toEqual(['Left']);
    });

    it('answer block writes the response token', () => {
      const { c, calls } = withInput();

      c.onClick({ type: 'answer' });
      expect(calls.write).toEqual(['%response%']);
    });

    it('plain value', () => {
      const { c, calls } = withInput();

      c.onClick({ value: 'x' });
      expect(calls.write).toEqual(['x']);
    });

    it('ignores a nullish key', () => {
      const { c, calls } = withInput();

      expect(() => c.onClick(null)).not.toThrow();
      expect(calls.write).toEqual([]);
    });
  });

  describe('onEditorChange', () => {
    const withInput = (over = {}) => {
      const onChange = jest.fn();
      const c = new EditorAndPad(props({ onChange, ...over }));
      const calls = { keystroke: [], clear: 0, write: [] };

      c.input = {
        keystroke: (v) => calls.keystroke.push(v),
        clear: () => calls.clear++,
        write: (v) => calls.write.push(v),
      };
      c.updateDisable = () => {};

      return { c, onChange, calls };
    };

    it('propagates ordinary latex to onChange', () => {
      const { c, onChange } = withInput();

      c.onEditorChange('\\frac{1}{2}');
      expect(onChange).toHaveBeenCalledWith('\\frac{1}{2}');
    });

    it('strips decimals when noDecimal is set', () => {
      const { c, onChange, calls } = withInput({ noDecimal: true });

      c.onEditorChange('1.5');

      expect(calls.clear).toBe(1);
      expect(calls.write).toEqual(['15']);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('undoes the empty fraction after a digit with a public delete, not MathQuill internals', () => {
      const { c, onChange, calls } = withInput();

      // the shape the old __controller hack targeted
      c.onEditorChange('2\\ \\frac{1}{ }');

      expect(calls.keystroke).toEqual(['Backspace']);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not treat normal fractions as the mixed-number case', () => {
      const { c, onChange, calls } = withInput();

      c.onEditorChange('\\frac{1}{2}');

      expect(calls.keystroke).toEqual([]);
      expect(onChange).toHaveBeenCalled();
    });
  });
});
