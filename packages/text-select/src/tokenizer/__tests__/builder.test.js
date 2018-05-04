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
      const out = words('foo. bar');
      expect(out).toEqual([
        {
          text: 'foo.',
          start: 0,
          end: 4
        },
        {
          text: 'bar',
          start: 5,
          end: 8
        }
      ]);
    });
  });

  describe('sentenences', () => {
    it('foobar', () => {
      const text = 'This is foo. This is bar.';
      const out = sentences(text);
      expect(out[0]).toEqual({ text: 'This is foo.', start: 0, end: 12 });
      expect(out[1]).toEqual({ text: 'This is bar.', start: 13, end: 25 });
    });
    it('works', () => {
      const text =
        'On Jan. 20, former Sen. Barack Obama became the 44th President of the USA. Millions attended the Inauguration.';

      const out = sentences(text);
      expect(out.length).toEqual(2);
    });
  });
});
