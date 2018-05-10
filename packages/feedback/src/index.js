const defaults = {
  correct: { type: 'default', default: 'Correct', custom: 'Correct' },
  incorrect: { type: 'default', default: 'Incorrect', custom: 'Incorrect' },
  partial: { type: 'default', default: 'Nearly', custom: 'Nearly' }
};

/**
 * @typedef {Object} FeedbackConfig
 * @property {'default'|'none'|'custom'} type
 * @property {string} default
 * @property {string} custom
 *
 * @typedef {Object} Feedback
 *  @property {FeedbackConfig} correct
 *  @property {FeedbackConfig} incorrect
 *  @property {FeedbackConfig} partial
 */

/**
 * Get the feedback for the correctness
 *
 * @param {'correct'|'incorrect'|'partial'} correctness
 * @param {Feedback} feedback
 */
export const getFeedback = (correctness, feedback) =>
  new Promise(resolve => {
    const fb = feedback[correctness] || defaults[correctness] || {};

    if (fb.type === 'default') {
      resolve(fb.default || defaults[correctness].default);
    } else if (fb.type === 'custom') {
      resolve(fb.custom || defaults[correctness].custom);
    } else if (fb.type === 'none') {
      resolve(undefined);
    } else {
      resolve(undefined);
    }
  });
