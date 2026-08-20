import Static from '../mf/static';

/**
 * The answer-block contract: `\MathQuillMathField[id]{}` in stored latex becomes
 * a MathLive prompt, and sub-field values/focus are surfaced through the same
 * callbacks @pie-lib/math-input exposed (`onSubFieldChange`, `onSubFieldFocus`,
 * `getFieldName`, `setInput`).
 *
 * Driven against a stub mathfield: a real <math-field> needs a browser, and what
 * matters here is the mapping, not MathLive's rendering.
 */
const stubField = (values = {}, selection = null) => ({
  values: { ...values },
  getPrompts() {
    return Object.keys(this.values);
  },
  getPromptValue(id) {
    return this.values[id];
  },
  setPromptValue(id, v) {
    this.values[id] = v;
  },
  getPromptRange(id) {
    const i = Object.keys(this.values).indexOf(id);

    return [i * 10, i * 10 + 5];
  },
  selection,
  addEventListener() {},
  removeEventListener() {},
  focus() {
    this.focused = true;
  },
  blur() {
    this.blurred = true;
  },
  remove() {},
});

const make = (props = {}) => new Static({ latex: 'x=\\MathQuillMathField[r1]{}', getFieldName: () => {}, ...props });

describe('Static: answer blocks / prompts', () => {
  describe('isInteractive', () => {
    it('is interactive when the latex has answer blocks', () => {
      expect(make({ latex: 'x=\\MathQuillMathField[r1]{}' }).isInteractive()).toBe(true);
      expect(make({ latex: 'x=\\placeholder[r1]{}' }).isInteractive()).toBe(true);
    });

    it('is display-only for plain latex', () => {
      expect(make({ latex: '\\frac{1}{2}' }).isInteractive()).toBe(false);
      expect(make({ latex: '' }).isInteractive()).toBe(false);
    });
  });

  describe('values', () => {
    it('returns {} before the field exists', () => {
      expect(make().values()).toEqual({});
    });

    it('maps each prompt id to its stored-form latex', () => {
      const s = make();

      s.mathField = stubField({ r1: '7', r2: '\\placeholder{}' });

      // \placeholder must not leak into stored values
      expect(s.values()).toEqual({ r1: '7', r2: '' });
    });
  });

  describe('promptHandle / innerFields', () => {
    it('exposes a MathQuill-field-like handle with get/set latex', () => {
      const s = make();

      s.mathField = stubField({ r1: '7' });

      const h = s.promptHandle('r1');

      expect(h.id).toEqual('r1');
      expect(h.latex()).toEqual('7');

      h.latex('9');
      expect(s.mathField.values.r1).toEqual('9');
    });

    it('handle latex() is safe with no field', () => {
      expect(make().promptHandle('r1').latex()).toEqual('');
    });

    it('innerFields returns one handle per prompt', () => {
      const s = make();

      s.mathField = stubField({ r1: '1', r2: '2' });

      expect(s.innerFields.map((f) => f.id)).toEqual(['r1', 'r2']);
      expect(make().innerFields).toEqual([]);
    });
  });

  describe('onSubFieldChange', () => {
    it('fires only for prompts whose value changed', () => {
      const onSubFieldChange = jest.fn();
      const s = make({ onSubFieldChange });

      s.mathField = stubField({ r1: '1', r2: '2' });
      s.promptValues = { r1: '1', r2: '2' };

      s.mathField.values.r2 = '5';
      s.onPromptInput();

      expect(onSubFieldChange).toHaveBeenCalledTimes(1);
      expect(onSubFieldChange).toHaveBeenCalledWith('r2', '5');
    });

    it('uses getFieldName when it returns a name', () => {
      const onSubFieldChange = jest.fn();
      const s = make({ onSubFieldChange, getFieldName: (handle) => 'named-' + handle.id });

      s.mathField = stubField({ r1: '1' });
      s.promptValues = {};

      s.onPromptInput();

      expect(onSubFieldChange).toHaveBeenCalledWith('named-r1', '1');
    });

    it('still tracks values when no callback is supplied', () => {
      const s = make();

      s.mathField = stubField({ r1: '3' });
      s.onPromptInput();

      expect(s.promptValues).toEqual({ r1: '3' });
    });
  });

  describe('onSubFieldFocus', () => {
    it('reports the prompt containing the selection, plus setInput', () => {
      const onSubFieldFocus = jest.fn();
      const setInput = jest.fn();
      const s = make({ onSubFieldFocus, setInput });

      // r2 occupies offsets 10..15
      s.mathField = stubField({ r1: '', r2: '' }, { ranges: [[11, 11]] });
      s.onPromptFocus();

      expect(onSubFieldFocus).toHaveBeenCalledTimes(1);
      expect(onSubFieldFocus.mock.calls[0][0]).toEqual('r2');
      expect(onSubFieldFocus.mock.calls[0][1].id).toEqual('r2');
      expect(setInput).toHaveBeenCalled();
    });

    it('does nothing without a selection', () => {
      const onSubFieldFocus = jest.fn();
      const s = make({ onSubFieldFocus });

      s.mathField = stubField({ r1: '' }, null);
      s.onPromptFocus();

      expect(onSubFieldFocus).not.toHaveBeenCalled();
    });

    it('does not throw when the field is missing', () => {
      const s = make({ onSubFieldFocus: jest.fn() });

      expect(() => s.onPromptFocus()).not.toThrow();
    });
  });

  describe('accessibility announcements', () => {
    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('creates a polite off-screen live region', () => {
      const s = make();

      s.createLiveRegion();

      expect(s.liveRegion.getAttribute('aria-live')).toEqual('polite');
      expect(s.liveRegion.getAttribute('aria-atomic')).toEqual('true');
      expect(document.body.contains(s.liveRegion)).toBe(true);

      s.removeLiveRegion();
      expect(s.liveRegion).toBeUndefined();
    });

    it('does not create a second region', () => {
      const s = make();

      s.createLiveRegion();
      const first = s.liveRegion;

      s.createLiveRegion();
      expect(s.liveRegion).toBe(first);
      s.removeLiveRegion();
    });

    it('announces when typed input expands into a command', () => {
      const s = make();

      s.createLiveRegion();
      s.promptValues = { r1: 'x' };
      // grew by more than one char AND gained a backslash => a conversion
      s.announceConversion({ r1: 'x\\frac{}{}' });

      expect(s.liveRegion.textContent).toEqual('Converted to math symbol');
      s.removeLiveRegion();
    });

    it('does not announce ordinary typing', () => {
      const s = make();

      s.createLiveRegion();
      s.promptValues = { r1: 'x' };
      s.announceConversion({ r1: 'xy' });

      expect(s.liveRegion.textContent).toEqual('');
      s.removeLiveRegion();
    });

    it('does not announce a deletion', () => {
      const s = make();

      s.createLiveRegion();
      s.promptValues = { r1: 'x\\frac{}{}' };
      s.onKeyDown({ key: 'Backspace' });
      s.announceConversion({ r1: 'x' });

      expect(s.liveRegion.textContent).toEqual('');
      s.removeLiveRegion();
    });
  });

  describe('focus / blur', () => {
    it('delegates to the field and is safe without one', () => {
      const s = make();

      expect(() => {
        s.focus();
        s.blur();
      }).not.toThrow();

      s.mathField = stubField();
      s.focus();
      s.blur();

      expect(s.mathField.focused).toBe(true);
      expect(s.mathField.blurred).toBe(true);
    });
  });
});
