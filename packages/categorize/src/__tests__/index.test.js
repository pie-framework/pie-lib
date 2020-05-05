import {
  countChosen,
  buildState,
  moveChoiceToCategory,
  removeChoiceFromCategory,
  ensureNoExtraChoicesInAnswer,
  limitInArray,
  limitInArrays,
  removeAllChoices,
  buildCategories,
  buildChoices,
  getAllPossibleResponses
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

      it(`${JSON.stringify(choice)} + ${JSON.stringify(l)} = ${expected}`, () => {
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
    assert('1', [undefined, [], null], 2, [[], [], []]);
    assert('1', undefined, 2, []);
    assert('1', null, 2, []);
    assert('1', [], 2, []);
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
      expect(limitInArray('1', undefined, 1)).toEqual({
        array: [],
        count: 0
      });
      expect(limitInArray('1', null, 1)).toEqual({
        array: [],
        count: 0
      });
      expect(limitInArray('1', [], 1)).toEqual({
        array: [],
        count: 0
      });
    });
  });

  describe('removeAllChoices', () => {
    it('strips if there is no category id', () => {
      const result = removeAllChoices('1', [{ choices: ['1'] }]);
      expect(result).toEqual([{ choices: [] }]);
    });

    it('strips if the category id matches', () => {
      const result = removeAllChoices('1', [{ category: '2', choices: ['1'] }], '2');
      expect(result).toEqual([{ category: '2', choices: [] }]);
    });

    it('doesnt strip if the category id does not match', () => {
      const result = removeAllChoices('1', [{ category: '3', choices: ['1'] }], '2');
      expect(result).toEqual([{ category: '3', choices: ['1'] }]);
    });
  });

  describe('ensureNoExtraChoicesInAnswer', () => {
    const _assert = only => (answer, choices, expected) => {
      const fn = only ? it.only : it;
      fn(`${inspect(answer)} + ${inspect(choices)} == ${inspect(expected)}`, () => {
        const result = ensureNoExtraChoicesInAnswer(answer, choices);
        log('result: ', result);
        expect(result).toEqual(expected);
      });
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
    assert([answer('1', ['1', '2', '1'])], [choice('1')], [answer('1', ['1', '2', '1'])]);
    assert([answer('1', ['1', '2', '1'])], [choice('1', 1)], [answer('1', ['1', '2'])]);
    assert(
      [answer('1', ['3', '3', '1', '2', '1', '2', '3'])],
      [choice('1'), choice('2', 1), choice('3', 2)],
      [answer('1', ['3', '3', '1', '2', '1'])]
    );

    assert([answer('1', ['1', '1'])], [choice('1', 0)], [answer('1', ['1', '1'])]);

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

    assert([answer('1', ['1', '1', '1'])], [choice('1', 2)], [answer('1', ['1', '1'])]);

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

    assert(
      [answer('1', ['1', '1', '1'])],
      [],
      [answer('1', ['1', '1', '1'])]);

    assert(
      [answer('1', ['1', '1', '1'])],
      undefined,
      [answer('1', ['1', '1', '1'])]);

    assert(
      [answer('1', ['1', '1', '1'])],
      null,
      [answer('1', ['1', '1', '1'])]);
  });

  describe('countChosen', () => {
    const assert = (choice, categories, expected) => {
      const l = (categories || []).map(c => c.choices || []);

      it(`${JSON.stringify(choice)} + ${JSON.stringify(l)} = ${expected}`, () => {
        expect(countChosen(choice, categories)).toEqual(expected);
      });
    };

    assert(null, undefined, 0);
    assert(null, [], 0);
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
      it(`remove choice:${choiceId} from category:${categoryId} == ${util.inspect(expected, {
        colors: true
      })}`, () => {
        const result = removeChoiceFromCategory(choiceId, categoryId, choiceIndex, answers);
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

    assert('1', '1', 3, [answer('1', ['1', '2', '3', '1'])], [answer('1', ['1', '2', '3'])]);
  });

  describe('moveChoiceToCategory', () => {
    const assert = (choiceId, from, to, choiceIndex, answers, expected) => {
      it(`move choice:${choiceId} from category:${from} -> category:${to} == ${util.inspect(
        expected,
        { colors: true }
      )}`, () => {
        const result = moveChoiceToCategory(choiceId, from, to, choiceIndex, answers);
        expect(result).toEqual(expected);
      });
    };
    assert('1', '1', '2', 0, [answer('1', ['1'])], [answer('1', []), answer('2', ['1'])]);
    assert('1', undefined, '2', 0, [answer('1', ['1'])], [answer('1', ['1']), answer('2', ['1'])]);
  });

  describe('buildState', () => {
    const _a = (only, label, categories, choices, answers, correctResponse, expected) => {
      const fn = only ? it.only : it;
      fn(label, () => {
        const result = buildState(categories, choices, answers, correctResponse);
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
        categories: [{ ...cat('1'), choices: [choice('1')] }],
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

    assert(
      '1 cat, 2 choices, 1 answer, 1 correct response, 1 alternate response',
      [cat('1')],
      [choice('1', 0), choice('2', 0)],
      [answer('1', ['2'])],
      [answer('1', ['1'], [['2']])],
      {
        correct: true,
        categories: [
          {
            ...cat('1'),
            choices: [choice('2', 0, true)],
            correct: true
          }
        ],
        choices: [{ ...choice('1', 0) }, { ...choice('2', 0) }]
      }
    );
  });

  // new tests

  const baseCategories = [
    { id: 's10', label: 'SUM=10' },
    { id: 's11', label: 'SUM=11' },
  ];
  const baseChoices = [
    { id: '3', content: '3' },
    { id: '4', content: '4' },
    { id: '5', content: '5' },
    { id: '6', content: '6', categoryCount: 1 },
    { id: '7', content: '7', categoryCount: 2 },
  ];
  const correctResponseNoAlternates = [
    { category: 's10', choices: ['3', '7'] },
    { category: 's11', choices: ['4', '7'] },
  ];
  const correctResponseWithAlternates = [
    {
      category: 's10',
      choices: ['3', '7'],
      alternateResponses: [['4', '6'], ['5', '5']]
    },
    {
      category: 's11',
      choices: ['4', '7'],
      alternateResponses: [['3', '3', '5'], ['5', '6']]
    },
  ];

  describe('buildState', () => {
    // main response selections
    const aC1 = [{ category: 's10', choices: ['3', '7'] }, { category: 's11', choices: ['4', '7'] }];
    const aC1BestResponse = { s10: ['3', '7'], s11: ['4', '7'] };
    const aC1BuiltCategories = [
      {
        id: 's10',
        label: 'SUM=10',
        correct: true,
        choices: [{ ...baseChoices[0], correct: true }, { ...baseChoices[4], correct: true }]
      },
      {
        id: 's11',
        label: 'SUM=11',
        correct: true,
        choices: [{ ...baseChoices[1], correct: true }, { ...baseChoices[4], correct: true }]
      },
    ];

    // alternate 1 response
    const aC2 = [{ category: 's10', choices: ['4', '6'] }, { category: 's11', choices: ['3', '3', '5'] }];
    const aC2BestResponse = { s10: ['4', '6'], s11: ['3', '3', '5'] };
    const aC2BuiltCategories = [
      {
        id: 's10',
        label: 'SUM=10',
        correct: true,
        choices: [{ ...baseChoices[1], correct: true }, { ...baseChoices[3], correct: true }]
      },
      {
        id: 's11',
        label: 'SUM=11',
        correct: true,
        choices: [{ ...baseChoices[0], correct: true }, { ...baseChoices[0], correct: true }, {
          ...baseChoices[2],
          correct: true
        }]
      },
    ];
    const aC2BuiltCategoriesNoAlt = [
      {
        id: 's10',
        label: 'SUM=10',
        correct: false,
        choices: [{ ...baseChoices[1], correct: false }, { ...baseChoices[3], correct: false }]
      },
      {
        id: 's11',
        label: 'SUM=11',
        correct: false,
        choices: [{ ...baseChoices[0], correct: false }, { ...baseChoices[0], correct: false }, {
          ...baseChoices[2],
          correct: false
        }]
      },
    ];

    // alternate 2 response
    const aC3 = [{ category: 's10', choices: ['5', '5'] }, { category: 's11', choices: ['5', '6'] }];
    const aC3BestResponse = { s10: ['5', '5'], s11: ['5', '6'] };
    const aC3BuiltCategories = [
      {
        id: 's10',
        label: 'SUM=10',
        correct: true,
        choices: [{ ...baseChoices[2], correct: true }, { ...baseChoices[2], correct: true }]
      },
      {
        id: 's11',
        label: 'SUM=11',
        correct: true,
        choices: [{ ...baseChoices[2], correct: true }, { ...baseChoices[3], correct: true }]
      },
    ];
    const aC3BuiltCategoriesNoAlt = [
      {
        id: 's10',
        label: 'SUM=10',
        correct: false,
        choices: [{ ...baseChoices[2], correct: false }, { ...baseChoices[2], correct: false }]
      },
      {
        id: 's11',
        label: 'SUM=11',
        correct: false,
        choices: [{ ...baseChoices[2], correct: false }, { ...baseChoices[3], correct: false }]
      },
    ];

    // alternate 1 response mixed with main response
    const aM1 = [{ category: 's10', choices: ['4', '6'] }, { category: 's11', choices: ['4', '7'] }];
    const aM1BestResponse = { s10: ['3', '7'], s11: ['4', '7'] };
    const aM1BuiltCategories = [
      {
        id: 's10',
        label: 'SUM=10',
        correct: false,
        choices: [{ ...baseChoices[1], correct: false }, { ...baseChoices[3], correct: false }]
      },
      {
        id: 's11',
        label: 'SUM=11',
        correct: true,
        choices: [{ ...baseChoices[1], correct: true }, { ...baseChoices[4], correct: true }]
      },
    ];
    const aM1BuiltCategoriesNoAlt = [
      {
        id: 's10',
        label: 'SUM=10',
        correct: false,
        choices: [{ ...baseChoices[1], correct: false }, { ...baseChoices[3], correct: false }]
      },
      {
        id: 's11',
        label: 'SUM=11',
        correct: true,
        choices: [{ ...baseChoices[1], correct: true }, { ...baseChoices[4], correct: true }]
      },
    ];

    // alternate 1 response mixed with alternate 2 response
    const aM2 = [{ category: 's10', choices: ['4', '6'] }, { category: 's11', choices: ['5', '6'] }];
    const aM2BestResponse = { s10: ['3', '7'], s11: ['4', '7'] };
    const aM2BuiltCategories = [
      {
        id: 's10',
        label: 'SUM=10',
        correct: false,
        choices: [{ ...baseChoices[1], correct: false }, { ...baseChoices[3], correct: false }]
      },
      {
        id: 's11',
        label: 'SUM=11',
        correct: false,
        choices: [{ ...baseChoices[2], correct: false }, { ...baseChoices[3], correct: false }]
      },
    ];
    const aM2BuiltCategoriesNoAlt = [
      {
        id: 's10',
        label: 'SUM=10',
        correct: false,
        choices: [{ ...baseChoices[1], correct: false }, { ...baseChoices[3], correct: false }]
      },
      {
        id: 's11',
        label: 'SUM=11',
        correct: false,
        choices: [{ ...baseChoices[2], correct: false }, { ...baseChoices[3], correct: false }]
      },
    ];

    // main response selections Incorrect
    const aI1 = [{ category: 's10', choices: ['3', '6'] }, { category: 's11', choices: ['4', '4'] }];
    const aI1BestResponse = { s10: ['3', '7'], s11: ['4', '7'] };
    const aI1BuiltCategories = [
      {
        id: 's10',
        label: 'SUM=10',
        correct: false,
        choices: [{ ...baseChoices[0], correct: true }, { ...baseChoices[3], correct: false }]
      },
      {
        id: 's11',
        label: 'SUM=11',
        correct: false,
        choices: [{ ...baseChoices[1], correct: true }, { ...baseChoices[1], correct: false }]
      },
    ];


    // if there are alternates, looks for the best response
    it.each`
    label        |   answers    |   correctExpected   |   bestResponseExpected   |   builtCategories       |   builtChoices
    ${'correct'} |   ${aC1}     |   ${true}           |   ${aC1BestResponse}     |   ${aC1BuiltCategories} |   ${[...baseChoices.slice(0, 4), { empty: true }]}
    ${'correct'} |   ${aC2}     |   ${true}           |   ${aC2BestResponse}     |   ${aC2BuiltCategories} |   ${[...baseChoices.slice(0, 3), { empty: true }, baseChoices[4]]}
    ${'correct'} |   ${aC3}     |   ${true}           |   ${aC3BestResponse}     |   ${aC3BuiltCategories} |   ${[...baseChoices.slice(0, 3), { empty: true }, baseChoices[4]]}
    ${'incorrect'}|  ${aI1}     |   ${false}          |   ${aI1BestResponse}     |   ${aI1BuiltCategories} |   ${[...baseChoices.slice(0, 3), { empty: true }, baseChoices[4]]}
    ${'mixed'}   |   ${aM1}     |   ${false}          |   ${aM1BestResponse}     |   ${aM1BuiltCategories} |   ${[...baseChoices.slice(0, 3), { empty: true }, baseChoices[4]]}
    ${'mixed'}   |   ${aM2}     |   ${false}          |   ${aM2BestResponse}     |   ${aM2BuiltCategories} |   ${[...baseChoices.slice(0, 3), { empty: true }, baseChoices[4]]}
    `('With Alternates, $label -> dychotomous: correct = correctExpected',
      ({ answers, correctExpected, bestResponseExpected, builtCategories, builtChoices }) => {
        const { choices, categories, correct, bestResponse } = buildState(baseCategories, baseChoices, answers, correctResponseWithAlternates);

        expect(choices).toEqual(builtChoices);
        expect(categories).toEqual(builtCategories);
        expect(correctExpected).toEqual(correct);
        expect(bestResponseExpected).toEqual(bestResponse);
      });

    // if there are no alternates, the best response is always the main one
    it.each`
    label        |   answers    |   correctExpected   |   bestResponseExpected   |   builtCategories            |   builtChoices
    ${'correct'} |   ${aC1}     |   ${true}           |   ${aC1BestResponse}     |   ${aC1BuiltCategories}      |   ${[...baseChoices.slice(0, 4), { empty: true }]}
    ${'correct'} |   ${aC2}     |   ${false}          |   ${aC1BestResponse}     |   ${aC2BuiltCategoriesNoAlt} |   ${[...baseChoices.slice(0, 3), { empty: true }, baseChoices[4]]}
    ${'correct'} |   ${aC3}     |   ${false}          |   ${aC1BestResponse}     |   ${aC3BuiltCategoriesNoAlt} |   ${[...baseChoices.slice(0, 3), { empty: true }, baseChoices[4]]}
    ${'correct'} |   ${aI1}     |   ${false}          |   ${aI1BestResponse}     |   ${aI1BuiltCategories}      |   ${[...baseChoices.slice(0, 3), { empty: true }, baseChoices[4]]}
    ${'correct'} |   ${aM1}     |   ${false}          |   ${aC1BestResponse}     |   ${aM1BuiltCategoriesNoAlt} |   ${[...baseChoices.slice(0, 3), { empty: true }, baseChoices[4]]}
    ${'correct'} |   ${aM2}     |   ${false}          |   ${aC1BestResponse}     |   ${aM2BuiltCategoriesNoAlt} |   ${[...baseChoices.slice(0, 3), { empty: true }, baseChoices[4]]}
    `('Without Alternates, $label -> dychotomous: correct = correctExpected',
      ({ answers, correctExpected, bestResponseExpected, builtCategories, builtChoices }) => {
        const { choices, categories, correct, bestResponse } = buildState(baseCategories, baseChoices, answers, correctResponseNoAlternates);

        expect(choices).toEqual(builtChoices);
        expect(categories).toEqual(builtCategories);
        expect(correctExpected).toEqual(correct);
        expect(bestResponseExpected).toEqual(bestResponse);
      });
  });

  describe('buildCategories', () => {
    it.each`
    categories       |     choices     |     answers     |     builtCategories
    ${null}          |     ${null}     |     ${null}     |     ${[]}
    ${undefined}     |     ${undefined}|     ${undefined}|     ${[]}
    ${[]}            |     ${[]}       |     ${[]}       |     ${[]}
    ${baseCategories}|  ${baseChoices} |     ${[]}       |     ${[{
      id: 's10',
      label: 'SUM=10',
      choices: []
    }, { id: 's11', label: 'SUM=11', choices: [] },]}
    `('builtCategories = $builtCategories', ({ categories, choices, answers, builtCategories }) => {
      expect(buildCategories(categories, choices, answers)).toEqual(builtCategories);
    });
  });

  describe('buildChoices', () => {
    const pRCA = ['3', '7'];
    const pRCB = ['3', '3', '7'];

    const bCC1 = [baseChoices[0], baseChoices[0]];
    const bC1A = [{ ...baseChoices[0], correct: true }, {...baseChoices[0], correct: false}];
    const bC1B = [{ ...baseChoices[0], correct: true }, {...baseChoices[0], correct: true}];

    const bCC2 = [baseChoices[0], baseChoices[0], baseChoices[4]];
    const bC2A = [{ ...baseChoices[0], correct: true }, {...baseChoices[0], correct: false}, {...baseChoices[4], correct: true}];
    const bC2B = [{ ...baseChoices[0], correct: true }, {...baseChoices[0], correct: true}, {...baseChoices[4], correct: true}];

    const bCC3 = baseChoices;
    const bC3A = [{ ...baseChoices[0], correct: true }, {...baseChoices[1], correct: false}, {...baseChoices[2], correct: false}, {...baseChoices[3], correct: false}, {...baseChoices[4], correct: true}];

    const bCC4 = [baseChoices[0], baseChoices[0], baseChoices[4], baseChoices[4]];
    const bC4A = [{ ...baseChoices[0], correct: true }, {...baseChoices[0], correct: false}, {...baseChoices[4], correct: true}, {...baseChoices[4], correct: false}];
    const bC4B = [{ ...baseChoices[0], correct: true }, {...baseChoices[0], correct: true}, {...baseChoices[4], correct: true}, {...baseChoices[4], correct: false}];

    it.each`
    possibleResponseChoices |    builtCategoryChoices    |      builtChoices
    ${pRCA}                 |    ${[]}                   |      ${[]}       
    ${pRCA}                 |    ${bCC1}                 |      ${bC1A}       
    ${pRCB}                 |    ${bCC1}                 |      ${bC1B}       
    ${pRCA}                 |    ${bCC2}                 |      ${bC2A}       
    ${pRCB}                 |    ${bCC2}                 |      ${bC2B}       
    ${pRCA}                 |    ${bCC3}                 |      ${bC3A}       
    ${pRCB}                 |    ${bCC3}                 |      ${bC3A}       
    ${pRCA}                 |    ${bCC4}                 |      ${bC4A}       
    ${pRCB}                 |    ${bCC4}                 |      ${bC4B}       
    `('builtChoices = builtChoices, correct = $correct', ({ possibleResponseChoices, builtCategoryChoices, builtChoices }) => {
      const { builtChoices: builtChoicesResult } = buildChoices(possibleResponseChoices, builtCategoryChoices);

      expect(builtChoicesResult).toEqual(builtChoices);
    });
  });

  describe('getAllPossibleResponses', () => {
    it.each`
    correctResponse                 |     allResponses
    ${correctResponseNoAlternates}  |     ${[{ s10: ['3', '7'], s11: ['4', '7'] }]}
    ${correctResponseWithAlternates}|     ${[{ s10: ['3', '7'], s11: ['4', '7'] }, {
      s10: ['4', '6'],
      s11: ['3', '3', '5']
    }, { s10: ['5', '5'], s11: ['5', '6'] }]}
    `('allResponses = allResponses', ({ correctResponse, allResponses }) => {
      expect(getAllPossibleResponses(correctResponse)).toEqual(allResponses);
    });
  });
});
