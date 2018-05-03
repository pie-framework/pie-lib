import { normalize, sentences, words } from '../builder';

describe('builder', () => {
  describe('normalize', () => {
    const assert = (input, tokens, expected) => {
      it(`${input} + ${JSON.stringify(tokens)} -> ${JSON.stringify(
        expected
      )}`, () => {
        const out = normalize(input, tokens);
        expect(out).toEqual(expected);
      });
    };
    assert('fo', [], [{ text: 'fo', start: 0, end: 2 }]);

    assert(
      'fo',
      [{ start: 0, end: 1 }],
      [
        { text: 'f', start: 0, end: 1, predefined: true },
        { text: 'o', start: 1, end: 2 }
      ]
    );
  });

  describe('words', () => {
    it('works', () => {
      const out = words("he hasn't an apple");
      expect(out.length).toEqual(4);
    });
  });

  describe('sentenences', () => {
    it('works', () => {
      const text =
        'On Jan. 20, former Sen. Barack Obama became the 44th President of the U.S. Millions attended the Inauguration.';

      const out = sentences(text);
      expect(out.length).toEqual(2);
    });
  });
});
