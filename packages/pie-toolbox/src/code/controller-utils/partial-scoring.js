export const enabled = (config, env, defaultValue) => {
  // if model.partialScoring = false
  //  - if env.partialScoring = false || env.partialScoring = true => use dichotomous scoring
  // else if model.partialScoring = true || undefined
  //  - if env.partialScoring = false, use dichotomous scoring
  //  - else if env.partialScoring = true, use partial scoring
  config = config || {};
  env = env || {};

  if (config.partialScoring === false) {
    return false;
  }

  if (env.partialScoring === false) {
    return false;
  }

  return typeof defaultValue === 'boolean' ? defaultValue : true;
};
