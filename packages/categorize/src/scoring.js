import debug from 'debug';

const log = debug('@pie-lib:categorize:scoring');

const getWeightingRules = (scoring) => {
  if (!scoring || !scoring.weighting) {
    return [];
  } else {
    if (!scoring.weighting.enabled) {
      return [];
    } else {
      const rules = scoring.weighting ? scoring.weighting.rules || [] : [];

      return rules;
    }
  }
};

const getPartialRulesForCategory = (partial, categoryId) => {
  log('partial? ', partial);

  if (!partial || !partial.enabled) {
    return;
  } else {
    const pr = partial.rules.find((pr) => pr.category === categoryId);

    return pr ? pr.rules || [] : [];
  }
};

/**
 *
 * Calculate score based on the categories model generated from `buildState` and the partial scoring rules.
 * @param {*} categories - this is the categories that you get from `buildState`.
 * @param {*} scoring  - scoring config.
 * @see ../index#buildState
 */

export const score = (categories, scoring) =>
  new Promise((resolve) => {
    log('categories: ', categories, 'scoring: ', scoring);

    const weightingRules = getWeightingRules(scoring);

    const weights = categories.map((c) => {
      const r = weightingRules.find((r) => r.category === c.id) || { points: 1 };

      return { ...r, category: c.id };
    });

    log('weights: ', weights);

    const weightTotal = categories.reduce((total, c) => {
      const r = weights.find((r) => r.category === c.id);

      return (total += r.points);
    }, 0);

    log('total: ', weightTotal);

    const withScore = categories.map((c) => {
      const w = weights.find((r) => r.category === c.id).points;

      log('category: ', c);
      if (c.correct === true) {
        return { category: c.id, score: w, points: w };
      } else {
        const rules = getPartialRulesForCategory(scoring.partial, c.id);

        log('partial rules for category: ', rules);

        if (!rules) {
          return { category: c.id, score: 0, points: w };
        } else {
          const correctCount = (c.choices || []).filter((h) => h.correct).length;

          log('correctCount: ', correctCount);

          let rule = rules.find((u) => u.count === correctCount);

          log('rule: ', rule);

          rule = rule || { percent: 0, count: correctCount };

          const score = w * (rule.percent / 100);

          return {
            category: c.id,
            score,
            points: w,
            partial: {
              correctChoices: correctCount,
              rule: rule,
            },
          };
        }
      }
    });

    const weightedScore = withScore.reduce((sum, c) => {
      return (sum += c.score);
    }, 0);

    log('weightedScore: ', weightedScore);

    const score = parseFloat((weightedScore / weightTotal).toFixed(2), 10);

    resolve({
      score,
      details: {
        weighted: {
          total: weightTotal,
          score: weightedScore,
        },
        categories: withScore,
      },
    });
  });
