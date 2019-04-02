import _ from 'lodash';

export const enabled = (config, env, defaultValue) => {
  if (env.partialScoring === true) {
    return true;
  }
  if (env.partialScoring === false) {
    return false;
  }

  if (config.partialScoring === false) {
    return false;
  }

  return _.isBoolean(defaultValue) ? defaultValue : true;
};
