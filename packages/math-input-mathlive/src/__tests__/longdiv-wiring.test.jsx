/**
 * Every place that draws MathLive output must apply the long-division
 * correction (see longdiv.js): live fields after every render, static markup
 * after it is written into the DOM.
 */
jest.mock('../mathlive-instance', () => {
  class FakeMathfieldElement {
    constructor() {
      const el = global.document.createElement('math-field');

      el.value = '';
      el.getValue = () => el.value;

      return el;
    }
  }

  return {
    loadMathLive: () => Promise.resolve({ MathfieldElement: FakeMathfieldElement }),
    getMacros: () => ({}),
    MATH_MODE_SPACE: '\\ ',
    applyShadowStyles: () => {},
    trackPlaceholderCaret: () => () => {},
    latexToMarkup: (l) => `<span>${l}</span>`,
  };
});

const mockUntrack = jest.fn();

jest.mock('../longdiv', () => ({
  trackLongDivision: jest.fn(() => mockUntrack),
  fixLongDivisionWhenReady: jest.fn(),
  fixLongDivision: jest.fn(),
}));

/* eslint-disable import/first */
import Input from '../mf/input';
import Static from '../mf/static';
import { LatexLabel } from '../keypad';
import { trackLongDivision, fixLongDivisionWhenReady } from '../longdiv';
/* eslint-enable import/first */

beforeEach(() => {
  trackLongDivision.mockClear();
  fixLongDivisionWhenReady.mockClear();
  mockUntrack.mockClear();
});

describe('Input (the editor)', () => {
  it('tracks the mathfield on mount and stops on unmount', async () => {
    const input = new Input({});

    input.holderRef = { current: document.createElement('span') };
    await input.componentDidMount();

    expect(trackLongDivision).toHaveBeenCalledWith(input.mathField);

    input.componentWillUnmount();

    expect(mockUntrack).toHaveBeenCalledTimes(1);
    expect(input.untrackLongDivision).toBeUndefined();
  });
});

describe('Static', () => {
  it('tracks the answer-block field on mount and stops on unmount', async () => {
    const s = new Static({ latex: 'x=\\MathQuillMathField[r1]{}' });

    s.holderRef = { current: document.createElement('span') };
    s.createLiveRegion = () => {};
    await s.componentDidMount();

    expect(trackLongDivision).toHaveBeenCalledWith(s.mathField);

    s.componentWillUnmount();

    expect(mockUntrack).toHaveBeenCalledTimes(1);
  });

  // Display mode: the markup reaches the DOM through state, so it is corrected
  // once React has written it.
  it('corrects static markup after it is rendered', () => {
    const s = new Static({ latex: '5\\longdiv{144}' });
    const holder = document.createElement('span');

    s.holderRef = { current: holder };
    s.state = { markup: '<span>new</span>' };
    s.componentDidUpdate({ latex: '5\\longdiv{144}' }, { markup: '' });

    expect(fixLongDivisionWhenReady).toHaveBeenCalledWith(holder);
  });

  it('does not redo it when the markup did not change', () => {
    const s = new Static({ latex: 'x' });

    s.holderRef = { current: document.createElement('span') };
    s.state = { markup: '<span>same</span>' };
    s.componentDidUpdate({ latex: 'x' }, { markup: '<span>same</span>' });

    expect(fixLongDivisionWhenReady).not.toHaveBeenCalled();
  });

  it('leaves a live field to the tracker', () => {
    const s = new Static({ latex: 'x' });

    s.holderRef = { current: document.createElement('span') };
    s.mathField = document.createElement('math-field');
    s.state = { markup: '<span>new</span>' };
    s.componentDidUpdate({ latex: 'x' }, { markup: '' });

    expect(fixLongDivisionWhenReady).not.toHaveBeenCalled();
  });
});

describe('keypad label', () => {
  it('corrects the label once mounted', async () => {
    const label = new LatexLabel({ latex: '\\longdiv{}' });
    const el = document.createElement('span');

    label.labelRef = { current: el };
    await label.componentDidMount();

    expect(fixLongDivisionWhenReady).toHaveBeenCalledWith(el);
  });

  it('corrects it again when the label changes', () => {
    const label = new LatexLabel({ latex: '\\longdiv{}' });
    const el = document.createElement('span');

    label.labelRef = { current: el };
    label.setState = () => {};
    label.state = { markup: '<span>other</span>' };
    label.componentDidUpdate({ latex: '\\longdiv{}' }, { markup: '<span>first</span>' });

    expect(fixLongDivisionWhenReady).toHaveBeenCalledWith(el);
  });
});
