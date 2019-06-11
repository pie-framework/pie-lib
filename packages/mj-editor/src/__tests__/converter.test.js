import { toMathMl } from '../converter';

describe('toMathMl', () => {
  it('converts', () => {
    const result = toMathMl('\\frac{1}{2}');
    expect(result).toContain(`<mn>1</mn>`);
  });
});
