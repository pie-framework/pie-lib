import { clearSelection, getCaretCharacterOffsetWithin } from '../selection-utils';

describe('selection-utils', () => {
  let selection;
  let range;

  beforeEach(() => {
    selection = {
      removeAllRanges: jest.fn(),
      addRange: jest.fn(),
      getRangeAt: jest.fn().mockReturnValue(range),
    };
    global.document.getSelection = jest.fn().mockReturnValue(selection);
    global.document.createRange = jest.fn();
  });

  describe('clearSelection', () => {
    it('calls removeAllRanges and addRange with document.getSelection', () => {
      const mockRange = {};
      global.document.createRange = jest.fn().mockReturnValue(mockRange);

      clearSelection();

      expect(selection.removeAllRanges).toBeCalled();
      expect(selection.addRange).toHaveBeenCalledWith(mockRange);
    });

    it('uses window.getSelection if document.getSelection is not available', () => {
      global.document.getSelection = undefined;
      const windowSelection = {
        removeAllRanges: jest.fn(),
        addRange: jest.fn(),
      };
      global.window.getSelection = jest.fn().mockReturnValue(windowSelection);
      const mockRange = {};
      global.document.createRange = jest.fn().mockReturnValue(mockRange);

      clearSelection();

      expect(windowSelection.removeAllRanges).toBeCalled();
      expect(windowSelection.addRange).toHaveBeenCalledWith(mockRange);
    });

    it('uses window.getSelection().empty() if removeAllRanges is not available', () => {
      global.document.getSelection = undefined;
      const windowSelection = {
        empty: jest.fn(),
      };
      global.window.getSelection = jest.fn().mockReturnValue(windowSelection);

      clearSelection();

      expect(windowSelection.empty).toBeCalled();
    });

    it('uses document.selection.empty() for IE8- compatibility', () => {
      global.document.getSelection = undefined;
      global.window.getSelection = undefined;
      const docSelection = {
        empty: jest.fn(),
      };
      global.document.selection = docSelection;

      clearSelection();

      expect(docSelection.empty).toBeCalled();

      delete global.document.selection;
    });
  });

  describe('getCaretCharacterOffsetWithin', () => {
    let element;
    let mockRange;
    let mockSelection;

    beforeEach(() => {
      element = {
        ownerDocument: global.document,
      };

      mockRange = {
        toString: jest.fn().mockReturnValue(''),
        cloneRange: jest.fn(),
        endContainer: {},
        endOffset: 0,
      };

      const clonedRange = {
        selectNodeContents: jest.fn(),
        setEnd: jest.fn(),
        toString: jest.fn().mockReturnValue('some text'),
      };

      mockRange.cloneRange.mockReturnValue(clonedRange);

      mockSelection = {
        rangeCount: 1,
        getRangeAt: jest.fn().mockReturnValue(mockRange),
      };

      global.window.getSelection = jest.fn().mockReturnValue(mockSelection);
    });

    it('returns 0 when rangeCount is 0', () => {
      mockSelection.rangeCount = 0;

      const offset = getCaretCharacterOffsetWithin(element);

      expect(offset).toBe(0);
    });

    it('returns caret offset for unselected text', () => {
      mockRange.toString.mockReturnValue('');
      const clonedRange = mockRange.cloneRange();
      clonedRange.toString.mockReturnValue('hello');

      const offset = getCaretCharacterOffsetWithin(element);

      expect(offset).toBe(5);
    });

    it('returns caret offset when text is selected', () => {
      mockRange.toString.mockReturnValue('world');
      const clonedRange = mockRange.cloneRange();
      clonedRange.toString.mockReturnValue('hello world');

      const offset = getCaretCharacterOffsetWithin(element);

      expect(offset).toBe(6); // 11 - 5 = 6
    });

    it('returns 0 when selection type is Control in IE', () => {
      global.window.getSelection = undefined;
      const docSelection = {
        type: 'Control',
      };
      element.ownerDocument.selection = docSelection;

      const offset = getCaretCharacterOffsetWithin(element);

      expect(offset).toBe(0);
    });
  });
});
