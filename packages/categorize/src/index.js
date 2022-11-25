import compact from 'lodash/compact';
import debug from 'debug';
import clone from 'lodash/clone';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import every from 'lodash/every';
import isEqual from 'lodash/isEqual';
import isUndefined from 'lodash/isUndefined';
import { score } from './scoring';

export { score };

export const FooTwo = 'foo-two';

const log = debug('@pie-lib:categorize');
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
    { choices: [] },
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
  arrays = arrays || [];

  const result = arrays.reduce(
    (acc, array) => {
      const l = limit - acc.count;
      const result = limitInArray(id, array, l);
      acc.out.push(result.array);
      acc.count = acc.count + (result.count || 0);
      return acc;
    },
    { out: [], count: 0 },
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
  arr = arr || [];

  if (limit === 0) {
    const stripped = arr.filter((v) => v !== id);
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
      { out: [], count: 0 },
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
  choices = choices || [];

  const out = choices.reduce((answerArray, choice) => {
    log('choice: ----> ', choice.id, 'categoryCount: ', choice.categoryCount);
    // log('answer array: ', answerArray);
    if (choice.categoryCount === undefined || choice.categoryCount === 0) {
      return answerArray;
    } else {
      const choices = answerArray.map((a) => a.choices);
      const result = limitInArrays(choice.id, choices, choice.categoryCount);
      const updatedArray = result.map((r, index) => {
        return {
          category: answerArray[index].category,
          alternateResponses: answerArray[index].alternateResponses,
          choices: r,
        };
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
  const out = answer.reduce((acc, a) => acc + countInChoices(choiceId, a.choices), 0);
  log('[countInAnswer] choiceId:', choiceId, answer);
  return out;
};

export const countInChoices = (choiceId, choices) => (choices || []).filter((c) => c === choiceId).length;

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
    const count = (c.choices || []).filter((h) => h.id === choice.id).length;
    return acc + count;
  }, 0);
};

/**
 * @param {string?} categoryId
 * @param {{category:string, choices: string[]}} answers
 */
export const removeCategory = (categoryId, answers) => answers.filter((a) => a.category !== categoryId);

/**
 * @param {string} choiceId
 * @param {{category:string, choices: string[]}} answers
 * @param {string?} categoryId - optional categegory id
 */
export const removeAllChoices = (choiceId, answers, categoryId) => {
  return answers.map((a) => {
    if (!categoryId || a.category === categoryId) {
      const cloned = clone(a.choices);
      remove(cloned, (v) => v === choiceId);
      return { ...a, choices: cloned };
    } else {
      return a;
    }
  });
};

export const removeChoiceFromCategory = (choiceId, categoryId, choiceIndex, answers) => {
  log('[removeChoiceFromCategory] choiceIndex:', choiceIndex);

  return answers.map((a) => {
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

export const moveChoiceToCategory = (choiceId, from, to, choiceIndex, answers) => {
  log('[moveChoiceToCategory] choice: ', choiceId, 'from: ', from, 'to: ', to, 'answers: ', answers);

  if (from === to) {
    return answers;
  }

  if (from) {
    answers = removeChoiceFromCategory(choiceId, from, choiceIndex, answers);
  }

  const index = answers.findIndex((a) => a.category === to);
  if (index === -1) {
    answers.push({ category: to, choices: [choiceId] });
    return answers;
  } else {
    return answers.map((a) => {
      if (a.category === to) {
        a.choices = a.choices || [];
        a.choices.push(choiceId);
        return a;
      }
      return a;
    });
  }
};

export const stillSelectable = (h, builtCategories) => {
  if (h.categoryCount > 0) {
    const count = countChosen(h, builtCategories);
    return count < h.categoryCount;
  } else {
    return true;
  }
};

/**
 * returns all choices with property 'correct' set to boolean
 * @param {string[]} possibleResponseChoices
 * @param {Object[]} builtCategoryChoices
 *
 * @returns {Object}, returns builtChoices: BuiltChoice[] and allChoicesAreCorrect: boolean
 * BuiltChoice = { id: choiceId, content: choiceContent, correct: boolean }
 */
export const buildChoices = (possibleResponseChoices, builtCategoryChoices) => {
  return builtCategoryChoices.reduce(
    (acc, builtChoice) => {
      // set correct value on each choice that was selected by user
      const index = acc.copyOfPossibleResponse.findIndex((cRC) => cRC === builtChoice.id);
      // if the choice exists in the correct response
      // set the correct: true
      if (index >= 0) {
        acc.builtChoices.push({
          ...builtChoice,
          correct: true,
        });
        acc.copyOfPossibleResponse = [
          ...acc.copyOfPossibleResponse.slice(0, index),
          ...acc.copyOfPossibleResponse.slice(index + 1),
        ];
      } else {
        acc.builtChoices.push({
          ...builtChoice,
          correct: false,
        });
        acc.allChoicesAreCorrect = false;
      }

      return acc;
    },
    {
      builtChoices: [],
      copyOfPossibleResponse: [...possibleResponseChoices],
      allChoicesAreCorrect: true,
    },
  );
};

/**
 * returns corrected answer using this possible correct response
 * @param {Object} possibleResponse, has form: { CategoryId: ChoiceId[] }
 * @param {Object[]} builtCategories
 *
 * @returns {Object}, returns builtCategories: BuiltCategory[] and correct: boolean
 * BuiltCategory = { id: categoryId, label: categoryLabel, correct: boolean, choices: BuiltChoice[] }
 * BuiltChoice = { id: choiceId, content: choiceContent, correct: boolean }
 */
export const getBuiltCategories = (possibleResponse, builtCategories) =>
  builtCategories.reduce(
    (acc, builtCategory) => {
      const possibleResponseChoices = possibleResponse[builtCategory.id] || []; // the correct choices for this category
      const builtCategoryChoices = builtCategory.choices || []; // the choices in the answer

      const { builtChoices, allChoicesAreCorrect } = buildChoices(possibleResponseChoices, builtCategoryChoices);
      const allChoicesAreInAnswer = builtCategoryChoices.length === possibleResponseChoices.length;

      acc.builtCategories.push({
        ...builtCategory,
        correct: allChoicesAreCorrect && allChoicesAreInAnswer,
        choices: builtChoices,
      });
      acc.correct = acc.correct && allChoicesAreCorrect && allChoicesAreInAnswer;

      return acc;
    },
    { builtCategories: [], correct: true },
  );

/**
 * returns all the possible responses by combining the proper alternate responses
 * @param {Object[]} correctResponse
 *
 * @returns {Object[]}, returns Response[]
 * Response = { CategoryId: ChoiceId[] },
 */
export const getAllPossibleResponses = (correctResponse) => {
  if (!correctResponse) {
    return [];
  }

  return correctResponse.reduce((acc, cR) => {
    // main response
    if (acc[0]) {
      acc[0][cR.category] = cR.choices;
    } else {
      acc.push({ [cR.category]: cR.choices });
    }

    // alternate responses
    if (cR.alternateResponses) {
      cR.alternateResponses.forEach((aR, index) => {
        if (acc[index + 1]) {
          acc[index + 1][cR.category] = aR;
        } else {
          acc.push({ [cR.category]: aR });
        }
      });
    }

    return acc;
  }, []);
};

/**
 * build the categories to be displayed, where each category has its own list of choices
 * @param {Object[]} categories
 * @param {{id:string}[]} choices
 * @param {{category: string, choices:string[]}[]} answers
 *
 * @returns {Object[]}, returns BuiltCategory[]
 * BuiltCategory = { id: categoryId, label: categoryLabel, choices: BuiltChoice[]},
 * BuiltChoice = { id: choiceId, content: choiceContent }
 */
export const buildCategories = (categories, choices, answers) => {
  categories = categories || [];
  answers = answers || [];
  choices = choices || [];

  return categories.map((category) => {
    const answer = answers.find((answer) => answer.category === category.id);
    const { choices: answerChoices = [] } = answer || {};

    return {
      ...category,
      choices: answerChoices.map((chId) => choices.find((ch) => ch.id === chId)),
    };
  });
};

/**
 * build the choice and category state
 * @param {Object[]} categories
 * @param {{id:string}[]} choices
 * @param {{category: string, choices:string[]}[]} answers
 *
 * @param correctResponse
 * @returns { categories: Category[], choices: Choice[], correct: boolean, bestResponse: Response }, where Response: { categoryId: choiceId[] }
 */
export const buildState = (categories, choices, answers, correctResponse) => {
  categories = categories || [];
  choices = choices || [];
  answers = answers || [];

  const allResponses = getAllPossibleResponses(correctResponse) || [];

  let builtCategories = buildCategories(categories, choices, answers);
  let bestResponse;
  let entirelyCorrect;

  // at least one defined correct response
  if (allResponses.length) {
    const builtData = allResponses.reduce(
      (acc, possibleResponse) => {
        // set correctness for each possible response
        const { builtCategories: categoriesWithChoices, correct } = getBuiltCategories(
          possibleResponse,
          builtCategories,
        );

        // if bestResponse not found yet OR no correct response found yet and this one is the correct one
        if (acc.bestResponse === null || (!acc.entirelyCorrect && correct)) {
          return {
            bestResponse: possibleResponse,
            builtCategories: categoriesWithChoices,
            entirelyCorrect: correct,
          };
        }

        return acc;
      },
      {
        bestResponse: null,
        builtCategories: [],
        entirelyCorrect: false,
      },
    );

    builtCategories = builtData.builtCategories;
    bestResponse = builtData.bestResponse;
    entirelyCorrect = builtData.entirelyCorrect;
  }

  const filteredChoices = choices.map((ch) => (stillSelectable(ch, builtCategories) ? ch : { empty: true }));

  return {
    choices: filteredChoices,
    categories: builtCategories,
    correct: entirelyCorrect,
    bestResponse,
  };
};
