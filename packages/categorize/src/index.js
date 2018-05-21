import compact from 'lodash/compact';
import debug from 'debug';
import clone from 'lodash/clone';
import remove from 'lodash/remove';
import isEqual from 'lodash/isEqual';
import every from 'lodash/every';

const log = debug('@pie-lib:drag:categorize');

export const limitChoices = (choiceId, count, choices) => {
  const out = choices.reduce(
    (acc, id) => {
      const foundCount = countInChoices(choiceId, acc.choices);
      // log('[limitChoices] choiceId: ', choiceId, '  foundCount: ', foundCount);
      if (id !== choiceId || foundCount < count) {
        acc.choices.push(id);
      }
      return acc;
    },
    { choices: [] }
  );

  return out.choices;
};

/**
 * Limit in an array of arrays.
 * So for an array with [[1,1],[1,1]] if you call limitInArray(1, arr, 3) you'll get: [[1,1], [1]]
 * @param {*} id
 * @param {*} arrays
 * @param {*} limit
 */
export const limitInArrays = (id, arrays, limit) => {
  const result = arrays.reduce(
    (acc, array) => {
      const l = limit - acc.count;
      const result = limitInArray(id, array, l);
      acc.out.push(result.array);
      acc.count = acc.count + (result.count || 0);
      return acc;
    },
    { out: [], count: 0 }
  );

  return result.out;
};

/**
 * Limit the id in the array to the limit set.
 * So for an array with [1,1,1,1] if you call limitInArray(1, arr, 2) you'll get: [1,1]
 * @param {string} id
 * @param {string[]} arr
 * @param {number} limit
 */
export const limitInArray = (id, arr, limit) => {
  if (limit === 0) {
    const stripped = arr.filter(v => v !== id);
    return { array: stripped, count: arr.length - stripped.length };
  } else {
    const result = arr.reduce(
      (acc, v) => {
        if (v === id) {
          if (acc.count < limit) {
            acc.count += 1;
            acc.out.push(v);
          }
        } else {
          acc.out.push(v);
        }
        return acc;
      },
      { out: [], count: 0 }
    );

    return { array: result.out, count: result.count };
  }
};

/**
 * Ensure that there are no extra choices in answer, if a choice.categoryCount is > 0.
 * @param {{category: string, choices: string[]}[]} answer
 * @param {{id:string,categoryCount:number}} choices
 */
export const ensureNoExtraChoicesInAnswer = (answer, choices) => {
  const out = choices.reduce((answerArray, choice) => {
    log('choice: ----> ', choice.id, 'categoryCount: ', choice.categoryCount);
    // log('answer array: ', answerArray);
    if (choice.categoryCount === undefined || choice.categoryCount === 0) {
      return answerArray;
    } else {
      const choices = answerArray.map(a => a.choices);
      const result = limitInArrays(choice.id, choices, choice.categoryCount);
      const updatedArray = result.map((r, index) => {
        return { category: answerArray[index].category, choices: r };
      });
      return updatedArray;
    }
  }, answer);
  return out;
};

/**
 * Count the number of choice ids in a given answer array
 * @param {string} choiceId
 * @param {{category: string, choices: string[]}[]} answer
 */
export const countInAnswer = (choiceId, answer) => {
  const out = answer.reduce(
    (acc, a) => acc + countInChoices(choiceId, a.choices),
    0
  );
  log('[countInAnswer] choiceId:', choiceId, answer);
  return out;
};

export const countInChoices = (choiceId, choices) =>
  (choices || []).filter(c => c === choiceId).length;

/**
 * Count the number of times a choice has been selected in categories.
 * @param {*} choice
 * @param {*} categories
 */
export const countChosen = (choice, categories) => {
  if (!choice || !choice.id) {
    return 0;
  }

  if (!Array.isArray(categories)) {
    return 0;
  }

  return categories.reduce((acc, c) => {
    const count = (c.choices || []).filter(h => h.id === choice.id).length;
    return acc + count;
  }, 0);
};

/**
 * @param {string?} categoryId
 * @param {{category:string, choices: string[]}} answers
 */
export const removeCategory = (categoryId, answers) =>
  answers.filter(a => a.category !== categoryId);

/**
 * @param {string} choiceId
 * @param {{category:string, choices: string[]}} answers
 * @param {string?} categoryId - optional categegory id
 */
export const removeAllChoices = (choiceId, answers, categoryId) => {
  return answers.map(a => {
    if (!categoryId || a.category === categoryId) {
      const cloned = clone(a.choices);
      remove(cloned, v => v === choiceId);
      return { ...a, choices: cloned };
    } else {
      return a;
    }
  });
};

export const removeChoiceFromCategory = (
  choiceId,
  categoryId,
  choiceIndex,
  answers
) => {
  log('[removeChoiceFromCategory] choiceIndex:', choiceIndex);

  return answers.map(a => {
    if (a.category === categoryId) {
      const cloned = clone(a.choices);
      const index = cloned.findIndex((v, index) => {
        return v === choiceId && index >= choiceIndex;
      });
      if (index !== -1) {
        cloned.splice(index, 1);
      }
      return { ...a, choices: cloned };
    } else {
      return a;
    }
  });
};

export const moveChoiceToCategory = (
  choiceId,
  from,
  to,
  choiceIndex,
  answers
) => {
  log(
    '[moveChoiceToCategory] choice: ',
    choiceId,
    'from: ',
    from,
    'to: ',
    to,
    'answers: ',
    answers
  );

  if (from === to) {
    return answers;
  }

  if (from) {
    answers = removeChoiceFromCategory(choiceId, from, choiceIndex, answers);
  }

  const index = answers.findIndex(a => a.category === to);
  if (index === -1) {
    answers.push({ category: to, choices: [choiceId] });
    return answers;
  } else {
    return answers.map(a => {
      if (a.category === to) {
        a.choices = a.choices || [];
        a.choices.push(choiceId);
        return a;
      }
      return a;
    });
  }
};

/**
 *
 * build the choice and category state
 * @param {Object[]} categories
 * @param {{id:string}[]} choices
 * @param {{category: string, choices:string[]}[]} answers
 *
 * @returns {categories: Category[], choices: Choice[]}
 */
export const buildState = (
  categories,
  choices,
  answers = [],
  correctResponse
) => {
  const addChoices = category => {
    const answer = answers.find(a => a.category === category.id);

    const hasCorrectResponse =
      Array.isArray(correctResponse) && correctResponse.length > 0;

    const cr = hasCorrectResponse
      ? correctResponse.find(r => r.category === category.id)
      : undefined;
    const correctChoices = clone(cr ? cr.choices || [] : undefined);

    if (answer) {
      const mappedChoices = compact(
        (answer.choices || []).map(id => choices.find(c => c.id === id))
      );

      const out = mappedChoices.reduce(
        (acc, choice) => {
          if (!acc.correct) {
            acc.choices.push({ ...choice, correct: undefined });
          } else {
            const index = acc.correct.findIndex(id => id === choice.id);
            acc.choices.push({ ...choice, correct: index !== -1 });
            if (index !== -1) {
              acc.correct.splice(index, 1);
            }
          }
          return acc;
        },
        {
          choices: [],
          correct: hasCorrectResponse ? correctChoices || [] : undefined
        }
      );

      const ids = out.choices.map(c => c.id).sort();
      const correctIds = clone(cr ? cr.choices : []).sort();

      log('ids: ', ids, 'correctIds: ', correctIds);
      const correct = hasCorrectResponse ? isEqual(ids, correctIds) : undefined;
      return {
        ...category,
        choices: out.choices,
        correct
      };
    } else {
      const correct =
        correctChoices === undefined ? true : correctChoices.length === 0;
      log('empty choices is that correct?', correctChoices);
      return {
        ...category,
        choices: [],
        correct
      };
    }
  };

  const withChoices = categories.map(addChoices);

  const correct = correctResponse
    ? every(withChoices, category => category.correct)
    : undefined;

  const stillSelectable = h => {
    if (h.categoryCount > 0) {
      const count = countChosen(h, withChoices);
      return count < h.categoryCount;
    } else {
      return true;
    }
  };

  const filteredChoices = choices.map(h => {
    if (stillSelectable(h)) {
      return h;
    } else {
      return { empty: true };
    }
  });

  return { choices: filteredChoices, categories: withChoices, correct };
};
