import {
  countChosen,
  buildState,
  moveChoiceToCategory,
  removeChoiceFromCategory,
  ensureNoExtraChoicesInAnswer,
  limitInArray,
  limitInArrays,
  removeAllChoices
} from '../index';
import range from 'lodash/range';
import util from 'util';
import debug from 'debug';
import { cat, cats, choice, answer } from './utils';

const log = debug('@pie-lib:drag:test');

const inspect = o => util.inspect(o, { color: true });

describe('categorize', () => {
  describe('countChosen', () => {
    const assert = (choice, categories, expected) => {
      const l = (categories || []).map(c => c.choices || []);

      it(`${JSON.stringify(choice)} + ${JSON.stringify(
        l
      )} = ${expected}`, () => {
        expect(countChosen(choice, categories)).toEqual(expected);
      });
    };

    assert(null, null, 0);
    assert({}, null, 0);
    assert({ id: '1' }, [], 0);
    assert({ id: '1' }, [{ choices: undefined }], 0);
    assert({ id: '1' }, [cats(['1'])], 1);
    assert({ id: '1' }, [cats(['1', '1'])], 2);
    assert({ id: '1' }, [cats(['1', '2'])], 1);
    assert({ id: '1' }, [cats(['1']), cats(['1'])], 2);
  });

  describe('limitInArrays', () => {
    const assert = (id, arrays, limit, expected) => {
      it(`${id}, ${inspect(arrays)} -> ${inspect(expected)}`, () => {
        const result = limitInArrays(id, arrays, limit);
        expect(result).toEqual(expected);
      });
    };
    assert('1', [['1'], ['1']], 1, [['1'], []]);
    assert('1', [['1'], ['1']], 2, [['1'], ['1']]);
    assert('1', [['1'], ['1'], ['1', '2']], 2, [['1'], ['1'], ['2']]);
  });

  describe('limitInArray', () => {
    it('', () => {
      expect(limitInArray('1', ['1', '1'], 1)).toEqual({
        array: ['1'],
        count: 1
      });
      expect(limitInArray('1', ['1', '1'], 0)).toEqual({
        array: [],
        count: 2
      });
      expect(limitInArray('1', ['1', '2', '1'], 1)).toEqual({
        array: ['1', '2'],
        count: 1
      });
    });
  });

  describe('removeAllChoices', () => {
    it('strips if there is no category id', () => {
      const result = removeAllChoices('1', [{ choices: ['1'] }]);
      expect(result).toEqual([{ choices: [] }]);
    });

    it('strips if the category id matches', () => {
      const result = removeAllChoices(
        '1',
        [{ category: '2', choices: ['1'] }],
        '2'
      );
      expect(result).toEqual([{ category: '2', choices: [] }]);
    });

    it('doesnt strip if the category id does not match', () => {
      const result = removeAllChoices(
        '1',
        [{ category: '3', choices: ['1'] }],
        '2'
      );
      expect(result).toEqual([{ category: '3', choices: ['1'] }]);
    });
  });

  describe('ensureNoExtraChoicesInAnswer', () => {
    const _assert = only => (answer, choices, expected) => {
      const fn = only ? it.only : it;
      fn(
        `${inspect(answer)} + ${inspect(choices)} == ${inspect(expected)}`,
        () => {
          const result = ensureNoExtraChoicesInAnswer(answer, choices);
          log('result: ', result);
          expect(result).toEqual(expected);
        }
      );
    };
    const assert = _assert(false);
    assert.only = _assert(true);

    assert(
      [answer('1', ['1', '2', '1'])],
      [{ id: '1' }, { id: '2' }],
      [answer('1', ['1', '2', '1'])]
    );

    assert(
      [answer('1', ['1', '2', '1'])],
      [{ id: '1', categoryCount: 1 }, { id: '2' }],
      [answer('1', ['1', '2'])]
    );

    assert(
      [answer('1', ['1', '2', '1', '2'])],
      [{ id: '1', categoryCount: 0 }, { id: '2', categoryCount: 1 }],
      [answer('1', ['1', '2', '1'])]
    );
    assert(
      [answer('1', ['1', '2', '1', '2'])],
      [choice('1'), choice('2', 1)],
      [answer('1', ['1', '2', '1'])]
    );
    assert(
      [answer('1', ['1', '2', '1'])],
      [choice('1')],
      [answer('1', ['1', '2', '1'])]
    );
    assert(
      [answer('1', ['1', '2', '1'])],
      [choice('1', 1)],
      [answer('1', ['1', '2'])]
    );
    assert(
      [answer('1', ['3', '3', '1', '2', '1', '2', '3'])],
      [choice('1'), choice('2', 1), choice('3', 2)],
      [answer('1', ['3', '3', '1', '2', '1'])]
    );

    assert(
      [answer('1', ['1', '1'])],
      [choice('1', 0)],
      [answer('1', ['1', '1'])]
    );

    assert(
      [answer('1', range(0, 10).map(r => '1'))],
      [choice('1', 0)],
      [answer('1', range(0, 10).map(r => '1'))]
    );
    assert([answer('1', ['1', '1'])], [choice('1', 1)], [answer('1', ['1'])]);

    assert(
      [answer('1', ['1']), answer('2', ['1'])],
      [choice('1', 1)],
      [answer('1', ['1']), answer('2', [])]
    );

    assert(
      [answer('1', ['1', '1', '1'])],
      [choice('1', 2)],
      [answer('1', ['1', '1'])]
    );

    assert(
      [answer('1', ['1']), answer('2', ['1', '1'])],
      [choice('1', 2)],
      [answer('1', ['1']), answer('2', ['1'])]
    );

    assert(
      [answer('1', ['1']), answer('2', ['1', '1']), answer('3', ['1'])],
      [choice('1', 2)],
      [answer('1', ['1']), answer('2', ['1']), answer('3', [])]
    );
  });

  describe('countChosen', () => {
    const assert = (choice, categories, expected) => {
      const l = (categories || []).map(c => c.choices || []);

      it(`${JSON.stringify(choice)} + ${JSON.stringify(
        l
      )} = ${expected}`, () => {
        expect(countChosen(choice, categories)).toEqual(expected);
      });
    };

    assert(null, null, 0);
    assert({}, null, 0);
    assert({ id: '1' }, [], 0);
    assert({ id: '1' }, [{ choices: undefined }], 0);
    assert({ id: '1' }, [cats(['1'])], 1);
    assert({ id: '1' }, [cats(['1', '1'])], 2);
    assert({ id: '1' }, [cats(['1', '2'])], 1);
    assert({ id: '1' }, [cats(['1']), cats(['1'])], 2);
  });

  describe('removeChoiceFromCategory', () => {
    const assert = (choiceId, categoryId, choiceIndex, answers, expected) => {
      it(`remove choice:${choiceId} from category:${categoryId} == ${util.inspect(
        expected,
        { colors: true }
      )}`, () => {
        const result = removeChoiceFromCategory(
          choiceId,
          categoryId,
          choiceIndex,
          answers
        );
        expect(result).toEqual(expected);
      });
    };
    assert('1', '1', 0, [answer('1', ['1'])], [answer('1', [])]);

    assert(
      '1',
      '1',
      0,
      [answer('1', ['1']), answer('2', ['1', '1'])],
      [answer('1', []), answer('2', ['1', '1'])]
    );

    assert(
      '1',
      '1',
      3,
      [answer('1', ['1', '2', '3', '1'])],
      [answer('1', ['1', '2', '3'])]
    );
  });

  describe('moveChoiceToCategory', () => {
    const assert = (choiceId, from, to, choiceIndex, answers, expected) => {
      it(`move choice:${choiceId} from category:${from} -> category:${to} == ${util.inspect(
        expected,
        { colors: true }
      )}`, () => {
        const result = moveChoiceToCategory(
          choiceId,
          from,
          to,
          choiceIndex,
          answers
        );
        expect(result).toEqual(expected);
      });
    };
    assert(
      '1',
      '1',
      '2',
      0,
      [answer('1', ['1'])],
      [answer('1', []), answer('2', ['1'])]
    );
    assert(
      '1',
      undefined,
      '2',
      0,
      [answer('1', ['1'])],
      [answer('1', ['1']), answer('2', ['1'])]
    );
  });

  describe('buildState', () => {
    const _a = (
      only,
      label,
      categories,
      choices,
      answers,
      correctResponse,
      expected
    ) => {
      const fn = only ? it.only : it;
      fn(label, () => {
        const result = buildState(
          categories,
          choices,
          answers,
          correctResponse
        );
        expect(result).toMatchObject(expected);
      });
    };
    const assert = _a.bind(_a, false);
    assert.only = _a.bind(_a, true);

    assert(
      '1 category, 1 choice, 1 answer, no correct response',
      [cat('1')],
      [choice('1')],
      [answer('1', '1')],
      [],
      {
        categories: [
          { ...cat('1'), choices: [choice('1')], correct: undefined }
        ],
        choices: [choice('1')]
      }
    );

    assert(
      '1 category, 1 unlimited choice, no answer, no correct response',
      [cat('1')],
      [choice('2')],
      [],
      [],
      {
        categories: [{ ...cat('1'), choices: [] }],
        choices: [choice('2')]
      }
    );

    assert(
      '2 categories, 1 unlimited choice, 2 answers, no correct response',
      [cat('1'), cat('2')],
      [choice('1', 0)],
      [answer('1', ['1']), answer('2', ['1'])],
      [],
      {
        categories: [
          { ...cat('1'), choices: [choice('1', 0)] },
          { ...cat('2'), choices: [choice('1', 0)] }
        ],
        choices: [choice('1', 0)]
      }
    );

    assert(
      '2 categories, 1 choice, 1 answer, no correct response',
      [cat('1'), cat('2')],
      [choice('1', 0)],
      [answer('1', ['1'])],
      [],
      {
        categories: [
          { ...cat('1'), choices: [choice('1', 0)] },
          {
            ...cat('2'),
            choices: []
          }
        ],
        choices: [{ ...choice('1', 0) }]
      }
    );

    assert(
      '2 categories, 1 choices, 1 incorrect answer, 1 correct response',
      [cat('1'), cat('2')],
      [choice('1', 0)],
      [answer('1', ['1'])],
      [answer('2', ['1'])],
      {
        correct: false,
        categories: [
          { ...cat('1'), choices: [choice('1', 0, false)], correct: false },
          {
            ...cat('2'),
            choices: []
          }
        ],
        choices: [{ ...choice('1', 0) }]
      }
    );

    assert(
      '1 cat, 1 choice, 1 answer, 1 correct response',
      [cat('1')],
      [choice('1', 0)],
      [answer('1', ['1'])],
      [answer('1', ['1'])],
      {
        correct: true,
        categories: [
          {
            ...cat('1'),
            choices: [choice('1', 0, true)],
            correct: true
          }
        ],
        choices: [{ ...choice('1', 0) }]
      }
    );

    assert(
      '1 cat, 1 choice, 2 same answers (correct), 2 correct responses',
      [cat('1')],
      [choice('1', 0)],
      [answer('1', ['1', '1'])],
      [answer('1', ['1', '1'])],
      {
        correct: true,
        categories: [
          {
            ...cat('1'),
            choices: [choice('1', 0, true), choice('1', 0, true)],
            correct: true
          }
        ],
        choices: [{ ...choice('1', 0) }]
      }
    );

    assert(
      '1 cat, 1 choice, 2 same answers (1 correct, 1 incorrect), correct response',
      [cat('1')],
      [choice('1', 0)],
      [answer('1', ['1', '1'])],
      [answer('1', ['1'])],
      {
        correct: false,
        categories: [
          {
            ...cat('1'),
            choices: [choice('1', 0, true), choice('1', 0, false)],
            correct: false
          }
        ],
        choices: [{ ...choice('1', 0) }]
      }
    );

    assert(
      '2 categories, 1 limited choice , 1 correct answer, correct response',
      [cat('1'), cat('2')],
      [choice('1', 1)],
      [answer('1', ['1'])],
      [answer('1', ['1'])],
      {
        correct: true,
        categories: [
          { ...cat('1'), choices: [choice('1', 1, true)], correct: true },
          { ...cat('2'), correct: true }
        ],
        choices: [{ empty: true }]
      }
    );

    assert(
      '2 categories, 1 limited choice , empty answer, correct response',
      [cat('1'), cat('2')],
      [choice('1', 1)],
      [],
      [answer('1', ['1'])],
      {
        correct: false,
        categories: [
          { ...cat('1'), choices: [], correct: false },
          { ...cat('2'), choices: [], correct: true }
        ],
        choices: [choice('1', 1)]
      }
    );
  });
});
