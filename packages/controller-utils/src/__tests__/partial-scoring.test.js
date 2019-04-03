import { enabled } from '../partial-scoring';

describe('enabled', () => {
  const assertEnabled = (config, env, expected) => {
    it(`returns ${expected} for: config: ${config.partialScoring}, env:${
      env.partialScoring
    }`, () => {
      const result = enabled(config, env);
      expect(result).toEqual(expected);
    });
  };

  const config = v => ({ partialScoring: v });
  const env = v => ({ partialScoring: v });
  assertEnabled(config(undefined), env(undefined), true);
  assertEnabled(config(false), env(undefined), false);
  assertEnabled(config(true), env(undefined), true);
  assertEnabled(config(undefined), env(false), false);
  assertEnabled(config(undefined), env(true), true);
  assertEnabled(config(false), env(true), true);
  assertEnabled(config(true), env(false), false);
  assertEnabled(config(true), env(true), true);
  assertEnabled(config(false), env(false), false);
});
