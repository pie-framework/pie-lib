export const defaults = {
  correct: { type: 'default', default: 'Correct', custom: 'Correct' },
  incorrect: { type: 'default', default: 'Incorrect', custom: 'Incorrect' },
  partial: { type: 'default', default: 'Nearly', custom: 'Nearly' },
  unanswered: {
    type: 'default',
    default: 'You have not entered a response',
    custom: 'You have not entered a response',
  },
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

const normalizeCorrectness = (c) => {
  if (c === 'partially-correct') {
    return 'partial';
  }
  return c;
};

/**
 * Get the feedback for the correctness
 *
 * @param {'correct'|'incorrect'|'partial'} correctness
 * @param {Feedback} feedback
 */
export const getFeedbackForCorrectness = (correctness, feedback) =>
  new Promise((resolve) => {
    feedback = { ...defaults, ...feedback };
    correctness = normalizeCorrectness(correctness);
    const fb = feedback[correctness] || defaults[correctness] || {};
    const d = defaults[correctness] || {};
    getFeedback(fb, d[fb.type || 'default']).then((result) => resolve(result));
  });

/**
 * Get the feedback from a {FeedbackConfig}
 *
 * @param {FeedbackConfig} feedback
 * @param {string} fallback
 */
export const getFeedback = (feedback, fallback) =>
  new Promise((resolve) => {
    if (!feedback || feedback.type === 'none') {
      resolve(undefined);
      return;
    }
    feedback = feedback || {};
    const out = feedback[feedback.type] || fallback;
    resolve(out);
  });

// TODO: should replace getFeedbackForCorrectness
/**
 * Get feedback for correctness
 * @param {'correct'|'incorrect'|'partial'} correctness
 * @param {Feedback} feedback
 */
export const getActualFeedbackForCorrectness = (correctness, feedback) => {
  feedback = { ...defaults, ...feedback };

  // normalize correctness
  correctness = correctness === 'partially-correct' ? 'partial' : correctness;

  const defaultFeedback = defaults[correctness] || {};
  const fb = feedback[correctness] || defaultFeedback;

  return getActualFeedback(fb, defaultFeedback[fb.type || 'default']);
};

// TODO: should replace getFeedback
/**
 * Get the feedback from a {FeedbackConfig}
 * @param {FeedbackConfig} feedback
 * @param {string} fallback
 */
export const getActualFeedback = (feedback, fallback) => {
  if (!feedback || feedback.type === 'none') {
    return undefined;
  }

  return feedback[feedback.type] || fallback;
};
