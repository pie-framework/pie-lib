import { Tokenizer } from '../index';
import React from 'react';
import { shallow } from 'enzyme';
import { words, sentences, paragraphs } from '../builder';

const tokens = () => [
  {
    start: 0,
    end: 1,
    text: 'f'
  }
];

const eff = () => tokens()[0];

jest.mock('../builder', () => ({
  words: jest.fn().mockReturnValue([{ start: 0, end: 3, text: 'foo' }]),
  sentences: jest.fn().mockReturnValue([{ start: 0, end: 3, text: 'foo' }]),
  paragraphs: jest.fn().mockReturnValue([{ start: 0, end: 3, text: 'foo' }])
}));
describe('tokenizer', () => {
  describe('snapshot', () => {
    it('renders', () => {
      const w = shallow(
        <Tokenizer
          text="foo"
          classes={{}}
          onChange={jest.fn()}
          tokens={tokens()}
        />
      );
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let w;
    let onChange;

    beforeEach(() => {
      onChange = jest.fn();
      w = shallow(
        <Tokenizer
          text="foo"
          classes={{}}
          onChange={onChange}
          tokens={tokens()}
        />
      );
    });
    describe('tokenIndex', () => {
      it('returns 0', () => {
        const index = w.instance().tokenIndex(eff());
        expect(index).toEqual(0);
      });

      it('returns -1', () => {
        const index = w.instance().tokenIndex({ start: 2, end: 3, text: 'f' });
        expect(index).toEqual(-1);
      });
    });

    describe('tokenClick', () => {
      let i;

      beforeEach(() => {
        i = w.instance();
        i.setCorrect = jest.fn();
        i.removeToken = jest.fn();
      });

      it('calls removeToken if setCorrectMode == false', () => {
        i.tokenClick(eff());
        expect(i.setCorrect).not.toBeCalled();
        expect(i.removeToken).toBeCalled();
      });

      it('calls setCorrect if setCorrectMode == true', () => {
        i.setState({ setCorrectMode: true });
        i.tokenClick(eff());
        expect(i.setCorrect).toBeCalled();
        expect(i.removeToken).not.toBeCalled();
      });
    });

    describe('selectToken', () => {
      it('calls onChange', () => {
        w
          .instance()
          .selectToken({ start: 1, end: 3, text: 'oo' }, [
            { start: 0, end: 1, text: 'f' }
          ]);
        expect(onChange).toBeCalledWith([{ start: 1, end: 3, text: 'oo' }], '');
      });
    });

    describe('buildParagraphsTokens', () => {
      it('calls paragraphs', () => {
        w.instance().buildTokens('paragraph', paragraphs);
        expect(paragraphs).toBeCalledWith('foo');
      });
    });

    describe('buildSentenceTokens', () => {
      it('calls sentences', () => {
        w.instance().buildTokens('sentence', sentences);
        expect(sentences).toBeCalledWith('foo');
      });
    });

    describe('buildWordTokens', () => {
      it('calls words', () => {
        w.instance().buildTokens('word', words);
        expect(words).toBeCalledWith('foo');
      });
    });

    describe('clear', () => {
      it('calls onChange with an empty array', () => {
        w.instance().clear();
        expect(onChange).toBeCalledWith([], '');
      });
    });

    describe('toggleCorrectMode', () => {
      it('set state', () => {
        w.setState({ setCorrectMode: true });
        w.instance().toggleCorrectMode();
        expect(w.state('setCorrectMode')).toEqual(false);
      });
    });

    describe('setCorrect', () => {
      it('calls onChange', () => {
        w.instance().setCorrect({ start: 0, end: 1, text: 'f' });
        expect(onChange).toBeCalledWith([
          { start: 0, end: 1, text: 'f', correct: true }
        ], '');
      });
      it('calls onChange w/ correct: false', () => {
        w.setProps({
          tokens: [{ start: 0, end: 1, text: 'f', correct: true }]
        });
        w.instance().setCorrect({ start: 0, end: 1, text: 'f' });
        expect(onChange).toBeCalledWith([
          { start: 0, end: 1, text: 'f', correct: false }
        ], '');
      });
    });

    describe('removeToken', () => {
      it('calls onChange', () => {
        w.instance().removeToken({ start: 0, end: 1, text: 'f' });
        expect(onChange).toBeCalledWith([], '');
      });
      it('does not call onChange if it cant find the token', () => {
        w.instance().removeToken({ start: 2, end: 3, text: 'a' });
        expect(onChange).not.toBeCalled();
      });
    });
  });
});
