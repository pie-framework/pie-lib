import { score } from '../scoring';
import util from 'util';

describe('scoring', () => {
  describe('score', () => {
    const _assert = only => (label, categories, scoring, expected) => {
      const fn = only ? it.only : it;
      fn(label, async () => {
        const result = await score(categories, scoring);

        expect(result).toMatchObject(expected);
      });
    };

    const assert = _assert(false);
    assert.only = _assert(true);

    describe('w/ partial rules', () => {
      assert(
        '1 category w/ 1 correct, partial rule for it @ 20%',
        [
          {
            id: '1',
            correct: false,
            choices: [{ correct: true }]
          }
        ],
        {
          partial: {
            enabled: true,
            rules: [
              {
                category: '1',
                rules: [{ count: 1, percent: 20 }]
              }
            ]
          }
        },
        {
          score: 0.2
        }
      );

      assert(
        '2 categories equal weights, 1 correct@20%, 2 correct@85% ',
        [
          {
            id: '1',
            correct: false,
            choices: [{ correct: true }]
          },
          {
            id: '2',
            correct: false,
            choices: [{ correct: true }, { correct: true }]
          }
        ],
        {
          partial: {
            enabled: true,
            rules: [
              {
                category: '1',
                rules: [{ count: 1, percent: 20 }]
              },
              {
                category: '2',
                rules: [{ count: 2, percent: 85 }]
              }
            ]
          }
        },
        {
          score: 0.53
        }
      );

      assert(
        '2 categories, weights 1 + 3, 1 correct@20% 2 correct@85%',
        [
          {
            id: '1',
            correct: false,
            choices: [{ correct: true }]
          },
          {
            id: '2',
            correct: false,
            choices: [{ correct: true }, { correct: true }]
          }
        ],
        {
          weighting: {
            enabled: true,
            rules: [{ category: '2', points: 3 }]
          },
          partial: {
            enabled: true,
            rules: [
              {
                category: '1',
                rules: [{ count: 1, percent: 20 }]
              },
              {
                category: '2',
                rules: [{ count: 2, percent: 85 }]
              }
            ]
          }
        },
        {
          score: 0.69
        }
      );

      assert(
        '2 categories, weights 1 + 3, 1 correct@20% only',
        [
          {
            id: '1',
            correct: false,
            choices: [{ correct: true }]
          },
          {
            id: '2',
            correct: false,
            choices: [{ correct: true }, { correct: true }]
          }
        ],
        {
          weighting: {
            enabled: true,
            rules: [{ category: '2', points: 3 }]
          },
          partial: {
            enabled: true,
            rules: [
              {
                category: '1',
                rules: [{ count: 1, percent: 20 }]
              }
            ]
          }
        },
        {
          score: 0.05
        }
      );
    });

    describe('2 equal weights', () => {
      const a = (categories, expected) =>
        assert(
          '2 equal weights',
          categories,
          {
            weighting: {
              rules: [
                { category: '1', points: 1 },
                { category: '2', points: 1 }
              ]
            }
          },
          expected
        );

      a([{ id: '1', correct: true }, { id: '2', correct: true }], {
        score: 1.0
      });
      a([{ id: '1', correct: false }, { id: '2', correct: true }], {
        score: 0.5
      });
      a([{ id: '1', correct: false }, { id: '2', correct: false }], {
        score: 0.0
      });
    });

    describe('2 unequal weights', () => {
      const a = (categories, expected) =>
        assert(
          '2 unequal weights',
          categories,
          {
            weighting: {
              enabled: true,
              rules: [
                { category: '1', points: 3 },
                { category: '2', points: 1 }
              ]
            }
          },
          expected
        );

      a([{ id: '1', correct: true }, { id: '2', correct: true }], {
        score: 1.0
      });
      a([{ id: '1', correct: false }, { id: '2', correct: true }], {
        score: 0.25
      });

      a([{ id: '1', correct: true }, { id: '2', correct: false }], {
        score: 0.75
      });

      a([{ id: '1', correct: false }, { id: '2', correct: false }], {
        score: 0.0
      });
    });

    describe('2 unequal weights with recurring number', () => {
      const a = (categories, expected) =>
        assert(
          '2 unequal weights with recurring number',
          categories,
          // [{ id: '1', correct: true }, { id: '2', correct: true }],
          {
            weighting: {
              enabled: true,
              rules: [
                { category: '1', points: 2 },
                { category: '2', points: 1 }
              ]
            }
          },
          expected
        );

      a([{ id: '1', correct: false }, { id: '2', correct: true }], {
        score: 0.33
      });
    });
  });
});
