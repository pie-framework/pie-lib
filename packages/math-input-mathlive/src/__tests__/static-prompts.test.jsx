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
  // Caret bookkeeping: MathLive exposes the caret offset as `position`, and any
  // executeCommand triggers the render that reveals the caret.
  position: undefined,
  commands: [],
  executeCommand(name) {
    this.commands.push(name);
  },
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

  /**
   * MathLive shows the caret only while the field carries `ML__focused`, which
   * it adds during a render gated on `isSelectionEditable && hasFocus()`. In a
   * read-only field only prompt interiors are editable, so after a bare
   * `focus()` - whose selection sits outside every prompt - the answer block
   * looked focused but had no blinking cursor. Verified in Chromium: the caret
   * span goes from visibility:hidden to visible once the selection is inside a
   * prompt AND a render has run.
   */
  describe('caret placement', () => {
    it('puts a collapsed caret in the first prompt on focus', () => {
      const s = make();

      s.mathField = stubField({ r1: '', r2: '' });
      s.focus();

      // stub ranges are [0,5] for r1, [10,15] for r2
      expect(s.mathField.selection).toEqual({ ranges: [[0, 0]] });
    });

    it('forces the render that makes the caret visible', () => {
      const s = make();

      s.mathField = stubField({ r1: '' });
      s.focus();

      // assigning `selection` alone updates the model without re-rendering, so
      // ML__focused would never be added
      expect(s.mathField.commands).toEqual(['scrollIntoView']);
    });

    it('does not move a caret that is already inside a prompt', () => {
      const s = make();

      s.mathField = stubField({ r1: '', r2: '' });
      s.mathField.position = 12; // inside r2
      s.focus();

      expect(s.mathField.selection).toBe(null);
      expect(s.mathField.commands).toEqual([]);
    });

    it('targets a specific prompt', () => {
      const s = make();

      s.mathField = stubField({ r1: '', r2: '' });
      s.focusPrompt('r2');

      expect(s.mathField.selection).toEqual({ ranges: [[10, 10]] });
    });

    it('falls back to the first prompt for an unknown id', () => {
      const s = make();

      s.mathField = stubField({ r1: '', r2: '' });
      s.focusPrompt('nope');

      expect(s.mathField.selection).toEqual({ ranges: [[0, 0]] });
    });

    it('is a no-op when there are no prompts', () => {
      const s = make();

      s.mathField = stubField({});

      expect(() => s.focusPrompt()).not.toThrow();
      expect(s.mathField.selection).toBe(null);
    });

    it('is safe without a field', () => {
      expect(() => make().focusPrompt('r1')).not.toThrow();
    });

    describe('promptContaining', () => {
      it('finds the prompt whose range holds the offset, inclusive', () => {
        const s = make();

        s.mathField = stubField({ r1: '', r2: '' });

        expect(s.promptContaining(0)).toEqual('r1');
        expect(s.promptContaining(5)).toEqual('r1');
        expect(s.promptContaining(10)).toEqual('r2');
        expect(s.promptContaining(7)).toBeUndefined();
      });

      it('treats a missing position as outside', () => {
        const s = make();

        s.mathField = stubField({ r1: '' });

        expect(s.promptContaining(undefined)).toBeUndefined();
      });
    });

    // MathQuill's inner fields could be focused directly.
    it('promptHandle exposes focus() for its own prompt', () => {
      const s = make();

      s.mathField = stubField({ r1: '', r2: '' });
      s.promptHandle('r2').focus();

      expect(s.mathField.focused).toBe(true);
      expect(s.mathField.selection).toEqual({ ranges: [[10, 10]] });
    });
  });
});
