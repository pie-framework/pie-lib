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
export const getFeedbackForCorrectness = (correctness, feedback) =>
  new Promise(resolve => {
    const fb = feedback[correctness] || defaults[correctness] || {};
    const d = defaults[correctness] || {};
    getFeedback(fb, d[fb.type || 'default']).then(result => resolve(result));
  });

/**
 * Get the feedback from a {FeedbackConfig}
 *
 * @param {FeedbackConfig} feedback
 * @param {string} fallback
 */
export const getFeedback = (feedback, fallback) =>
  new Promise(resolve => {
    if (!feedback || feedback.type === 'none') {
      resolve(undefined);
      return;
    }
    feedback = feedback || {};
    const out = feedback[feedback.type] || fallback;
    resolve(out);
  });
