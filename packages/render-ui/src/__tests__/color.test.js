import { v } from '../color';
describe('v', () => {
  it.each`
    args                                 | expected
    ${['text', 'black']}                 | ${'var(--pie-text, black)'}
    ${['primary-text', 'text', 'black']} | ${'var(--pie-primary-text, var(--pie-text, black))'}
    ${['black']}                         | ${'black'}
    ${['#00ff00']}                       | ${'#00ff00'}
  `('$args => $expected', ({ args, expected }) => {
    expect(v('pie')(...args)).toEqual(expected);
  });
});
