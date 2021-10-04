import { shallow } from 'enzyme';
import React from 'react';
import TokenText from '../token-text';
import { intersection } from '../builder';
import { clearSelection, getCaretCharacterOffsetWithin } from '../selection-utils';

jest.mock('../selection-utils', () => ({
  clearSelection: jest.fn(),
  getCaretCharacterOffsetWithin: jest.fn().mockReturnValue(10)
}));

jest.mock('../builder', () => ({
  intersection: jest.fn().mockReturnValue({
    hasOverlap: jest.fn().mockReturnValue(false),
    surroundedTokens: jest.fn().mockReturnValue([])
  }),
  normalize: jest.fn().mockReturnValue([
    {
      text: `lorem\nfoo bar`,
      start: 0,
      end: 13,
      predefined: true
    }
  ])
}));

const tokens = () => [
  {
    start: 0,
    end: 7,
    text: `lorem\nfoo bar`
  }
];

const mkEvent = () => ({
  preventDefault: jest.fn()
});

describe('token-text', () => {
  describe('snapshot', () => {
    it('renders', () => {
      const w = shallow(
        <TokenText
          onTokenClick={jest.fn()}
          onSelectToken={jest.fn()}
          text={`lorem\nfoo bar`}
          tokens={tokens()}
        />
      );
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let w;
    let onSelectToken;
    let onTokenClick;
    beforeEach(() => {
      global.window.getSelection = jest.fn().mockReturnValue({
        toString: () => 'bar'
      });

      onSelectToken = jest.fn();
      onTokenClick = jest.fn();

      w = shallow(
        <TokenText
          onTokenClick={onTokenClick}
          onSelectToken={onSelectToken}
          text={`lorem\nfoo bar`}
          tokens={tokens()}
        />
      );
    });

    describe('mouseup', () => {
      it('calls event.preventDefault', () => {
        const event = mkEvent();
        w.instance().onClick(event);
        expect(event.preventDefault).toBeCalled();
      });

      it('calls getCaretCharacterOffsetWithin', () => {
        const event = mkEvent();
        w.instance().root = {};
        w.instance().onClick(event);
        expect(getCaretCharacterOffsetWithin).toBeCalledWith({});
      });

      it('calls clear selection if there is an overlap', () => {
        intersection.mockReturnValue({
          hasOverlap: true
        });
        const event = mkEvent();
        w.instance().root = {};
        w.instance().onClick(event);
        expect(clearSelection).toBeCalled();
        expect(onSelectToken).not.toBeCalled();
      });

      it('calls onSelectToken', () => {
        const event = mkEvent();
        intersection.mockReturnValue({
          hasOverlap: false,
          surroundedTokens: []
        });
        w.instance().root = {};
        w.instance().onClick(event);
        expect(onSelectToken).toBeCalledWith({ text: 'bar', start: 10, end: 13 }, []);
      });

      it('does not call onSelectToken for ["\n", " ", "\t"]', () => {
        const event = mkEvent();

        intersection.mockReturnValue({
          hasOverlap: false,
          surroundedTokens: []
        });
        w.instance().root = {};

        global.window.getSelection = jest.fn().mockReturnValue({
          toString: () => '\n'
        });
        w.instance().onClick(event);
        expect(onSelectToken).not.toBeCalled();

        global.window.getSelection = jest.fn().mockReturnValue({
          toString: () => ' '
        });
        w.instance().onClick(event);
        expect(onSelectToken).not.toBeCalled();

        global.window.getSelection = jest.fn().mockReturnValue({
          toString: () => '\t'
        });
        w.instance().onClick(event);
        expect(onSelectToken).not.toBeCalled();
      });
    });
  });
});
