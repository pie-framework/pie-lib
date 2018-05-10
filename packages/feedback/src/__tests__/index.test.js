import { getFeedback } from '../index';
describe('feedback', () => {
  describe('getFeedback', () => {
    const assert = (correctness, config, expected) => {
      it(`${correctness} + ${JSON.stringify(
        config
      )} -> ${expected}`, async () => {
        const result = await getFeedback(correctness, config);
        expect(result).toEqual(expected);
      });
    };

    describe('correct', () => {
      assert('correct', {}, 'Correct');
      assert('correct', { correct: { type: 'default' } }, 'Correct');
      assert('correct', { correct: { type: 'default', default: 'C' } }, 'C');
      assert('correct', { correct: { type: 'none', default: 'C' } }, undefined);
      assert(
        'correct',
        { correct: { type: 'custom', custom: 'Custom' } },
        'Custom'
      );
    });

    describe('incorrect', () => {
      assert('incorrect', {}, 'Incorrect');
      assert('incorrect', { incorrect: { type: 'default' } }, 'Incorrect');
      assert(
        'incorrect',
        { incorrect: { type: 'default', default: 'I' } },
        'I'
      );
      assert(
        'incorrect',
        { incorrect: { type: 'none', default: 'C' } },
        undefined
      );
      assert(
        'incorrect',
        { incorrect: { type: 'custom', custom: 'Custom' } },
        'Custom'
      );
    });

    describe('unknown', () => {
      assert('unknown', {}, undefined);
    });

    describe('partial', () => {
      assert('partial', {}, 'Nearly');
      assert('partial', { partial: { type: 'default' } }, 'Nearly');
      assert('partial', { partial: { type: 'default', default: 'I' } }, 'I');
      assert('partial', { partial: { type: 'none', default: 'C' } }, undefined);
      assert(
        'partial',
        { partial: { type: 'custom', custom: 'Custom' } },
        'Custom'
      );
    });
  });
});
