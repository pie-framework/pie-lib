/**
 * The editable Input keeps its selection snapped to whole atoms (see
 * selection.js). This checks the wiring: attached on mount, removed on unmount.
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

jest.mock('../selection', () => ({
  trackWholeAtomSelection: jest.fn(() => mockUntrack),
}));

// eslint-disable-next-line import/first
import Input from '../mf/input';
// eslint-disable-next-line import/first
import { trackWholeAtomSelection } from '../selection';

describe('Input: whole-atom selection', () => {
  beforeEach(() => {
    trackWholeAtomSelection.mockClear();
    mockUntrack.mockClear();
  });

  it('attaches the tracker to the mathfield on mount', async () => {
    const input = new Input({});

    input.holderRef = { current: document.createElement('span') };
    await input.componentDidMount();

    expect(trackWholeAtomSelection).toHaveBeenCalledTimes(1);
    expect(trackWholeAtomSelection).toHaveBeenCalledWith(input.mathField);
  });

  it('removes it on unmount', async () => {
    const input = new Input({});

    input.holderRef = { current: document.createElement('span') };
    await input.componentDidMount();
    input.componentWillUnmount();

    expect(mockUntrack).toHaveBeenCalledTimes(1);
    expect(input.untrackSelection).toBeUndefined();
  });
});
