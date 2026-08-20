/**
 * MathLive loads asynchronously, so `componentDidMount` resumes after an await
 * before appending a <math-field>. Two orderings must both hold:
 *
 *  - StrictMode dev double-mount (mount -> unmount -> mount on the SAME
 *    instance) must end up with exactly ONE field. A boolean "unmounted" flag
 *    latches here and blocks the remount entirely - which is why this uses a
 *    generation counter.
 *  - A genuine unmount while the load is in flight must append nothing.
 *
 * MathLive cannot load under jsdom, so it is mocked with a minimal stub in
 * order to actually count appended fields.
 */
jest.mock('../mathlive-instance', () => {
  // Must be a real DOM node: the component uses replaceChildren(), which
  // rejects anything that is not a Node. Returning an element from the
  // constructor replaces `this`, so callers get a genuine <math-field>.
  class FakeMathfieldElement {
    constructor() {
      // `global` rather than `document`: jest forbids out-of-scope variables in
      // a mock factory, and `global` is on its allow-list.
      const el = global.document.createElement('math-field');

      el.value = '';
      el.getValue = () => el.value;

      return el;
    }
  }

  return {
    loadMathLive: () => Promise.resolve({ MathfieldElement: FakeMathfieldElement }),
    getMacros: () => ({}),
    // must mirror the real export, otherwise the component sets `undefined`
    MATH_MODE_SPACE: '\\ ',
    latexToMarkup: (l) => `<span>${l}</span>`,
  };
});

// eslint-disable-next-line import/first
import Input from '../mf/input';

const holderFor = (cmp) => {
  const el = document.createElement('span');

  cmp.holderRef = { current: el };

  return el;
};

const fieldCount = (el) => Array.from(el.childNodes).filter((n) => n.tagName === 'MATH-FIELD').length;

describe('async mount race', () => {
  it('StrictMode mount -> unmount -> mount yields exactly one field', async () => {
    const input = new Input({});
    const el = holderFor(input);

    const first = input.componentDidMount();

    input.componentWillUnmount();

    const second = input.componentDidMount();

    await Promise.all([first, second]);

    expect(fieldCount(el)).toBe(1);
    expect(input.mathField).toBeDefined();
  });

  it('appends nothing when unmounted while the load is in flight', async () => {
    const input = new Input({});
    const el = holderFor(input);

    const pending = input.componentDidMount();

    input.componentWillUnmount();

    await pending;

    expect(fieldCount(el)).toBe(0);
    expect(input.mathField).toBeUndefined();
  });

  it('a normal single mount creates the field', async () => {
    const input = new Input({});
    const el = holderFor(input);

    await input.componentDidMount();

    expect(fieldCount(el)).toBe(1);
  });

  it('repeated mounts never accumulate fields', async () => {
    const input = new Input({});
    const el = holderFor(input);

    await input.componentDidMount();
    await input.componentDidMount();
    await input.componentDidMount();

    expect(fieldCount(el)).toBe(1);
  });

  // MathLive's mathModeSpace defaults to '', which makes the spacebar a no-op.
  it('configures the spacebar so a space can be typed', async () => {
    const input = new Input({});

    holderFor(input);
    await input.componentDidMount();

    // a LaTeX control space - what MathQuill produced, and MathJax understands
    expect(input.mathField.mathModeSpace).toEqual('\\ ');
    expect(input.mathField.mathModeSpace).not.toEqual('');
  });

  it('reports itself through innerRef on mount and clears it on unmount', async () => {
    const innerRef = jest.fn();
    const input = new Input({ innerRef });

    holderFor(input);
    await input.componentDidMount();

    expect(innerRef).toHaveBeenCalledWith(input);

    input.componentWillUnmount();

    expect(innerRef).toHaveBeenLastCalledWith(null);
  });
});
