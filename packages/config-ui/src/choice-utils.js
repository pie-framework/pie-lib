import includes from 'lodash/includes';

/**
 * Add value to every model.choices.
 * @param {Object} model the model to normalize
 * @return {Object} the updated model
 */
export const normalizeChoices = model => {
  const choices = model.choices.map((c, index) => {
    if (!c.value) {
      c.value = `${index}`;
    }
    return c;
  });
  return { ...model, choices };
};

/**
 * Find the first available index.
 * @param {string[]} values
 * @param {number} index
 * @return {string}
 */
export const firstAvailableIndex = (values, index) => {
  if (includes(values, `${index}`)) {
    return firstAvailableIndex(values, index + 1);
  } else {
    return `${index}`;
  }
};
