import * as pkg from '../index';

describe('@pie-lib/math-input-mathlive index', () => {
  it('exports mq', () => expect(pkg.mq).toBeDefined());
  it('exports keys', () => expect(pkg.keys).toBeDefined());
  it('exports keysForGrade', () => expect(typeof pkg.keysForGrade).toBe('function'));
  it('exports HorizontalKeypad', () => expect(pkg.HorizontalKeypad).toBeDefined());
});
