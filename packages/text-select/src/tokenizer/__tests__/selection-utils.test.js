import {
  clearSelection,
  getCaretCharacterOffsetWithin
} from '../selection-utils';

describe('selection-utils', () => {
  let selection;
  let range;
  beforeEach(() => {
    selection = {
      removeAllRanges: jest.fn(),
      addRange: jest.fn(),
      getRangeAt: jest.fn().mockReturnValue(range)
    };
    global.document.getSelection = jest.fn().mockReturnValue(selection);
    global.document.createRange = jest.fn();
  });

  describe('clearSelection', () => {
    it('calls removeAllRanges', () => {
      clearSelection();
      expect(selection.removeAllRanges).toBeCalled();
    });
  });

  xdescribe('getCaretCharacterOffsetWithin', () => {
    it('TODO', () => {});
  });
});
