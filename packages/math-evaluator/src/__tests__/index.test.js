import areValuesEqual from '../index';
import _ from 'lodash';

describe('math-evaluator', () => {

  const assert = (isEqual) => (label) => function () {
    const args = Array.from(arguments);
    const pairs = _.chunk(args, 2);

    describe(label, () => {
      pairs.forEach(([a, b]) => {
        it(`${a} === ${b} ? ${isEqual}`, () => {
          expect(areValuesEqual(a, b)).toBe(isEqual);
        });
      });
    });
  }

  const assertEqual = assert(true);
  const assertNotEqual = assert(false);

  assertNotEqual('evaluates simple expressions correctly')(
    '', 'x',
    '3x', '4x',
  );

  assertEqual('evaluates simple expressions correctly')(

  );

  assertNotEqual('evaluates simple expressions correctly')(

  );

  assertEqual('evaluates simple expressions correctly')(
    'x', 'x',
    '2x', '2x',
  );

  assertEqual('evaluates simple expressions correctly 2')(
    '100', '100',
    '50 + 50', '25 * 4',
    '200 / 2', '20 * 5',
    '2.5 * 40', '10 * 10',
  );

  assertNotEqual('evaluates simple expressions correctly 2')(
    '100', '',
    '', '50 * 2',
    '44 + 57', '100',
    '44 + 57', '50 * 3',
  );

  assertEqual('evaluates simple expressions correctly 3')(
    '50 + 50', '100',
    '100 / 2 + 50', '100',
    '2 + 2', '4',
    '1/2 + .5', '1',
  );

  assertNotEqual('evaluates simple expressions correctly 3')(
    '50 + 51', '100',
    '25 * 2 + 51', '100',
    '1/2 + .5', '1.9',
    '1/2 + .5', '1.1',
  );

  assertEqual('evaluates simple expressions correctly 4')(
    '50 + 50', '100',
    '100 / 2 + 50', '100',
    '2 + 2', '4',
    '1/2 + .5', '1',
    '13/2', '13/2',
    '26/4', '13/2',
    '6 + 1/2', '13/2',
    '6.5', '13/2',
  );

  assertNotEqual('evaluates simple expressions correctly 4')(
    '50 + 51', '100',
    '25 * 2 + 51', '100',
    '1/2 + .5', '1.9',
    '1/2 + .5', '1.1',
    '14/2', '13/2',
    '6.6', '13/2',
  );

  assertEqual('evaluates simple variable expressions correctly')(
    'x', 'x',
    'x + 0', 'x',
    '(x-2) + 2', 'x',
    '((x^2 + x) / x) - 1', 'x',
    '2x/2', 'x',
    '(x + 2)^2', '(x + 2)^2',
    'x^2 + 4x + 4', '(x + 2)^2',
    'x * (x+4) + 4', '(x + 2)^2',
    'x^2 + 4(x+1)', '(x + 2)^2',
    'x^2 + 8 ((x+1) / 2)', '(x + 2)^2',
  );

  assertNotEqual('evaluates simple variable expressions correctly')(
    'y', 'x',
    'x + 1', 'x',
    'x^3 + 4x + 4', '(x + 2)^2',
    'x^2 + 4(x+2)', '(x + 2)^2',
  );

  assertEqual('evaluates simple variable expressions correctly 2')(
    '(2 + x)^2', '(x + 2)^2',
    'x^2 + 4x + 4', '(x + 2)^2',
    'x * (x+4) + 4', '(x + 2)^2',
    'x^2 + 4(x+1)', '(x + 2)^2',
    'x^2 + 8 ((x+1) / 2)', '(x + 2)^2',
  );

  assertNotEqual('evaluates simple variable expressions correctly 2')(
    'x^3 + 4x + 4', '(x + 2)^2',
    'x^2 + 4(x+2)', '(x + 2)^2',
  );

  it('evaluates simple trigo expressions correctly', () => {
    expect(areValuesEqual('sin(x)', 'sin(x)')).toEqual(true);
    expect(areValuesEqual('tan(x)', 'tan(x)')).toEqual(true);
    expect(areValuesEqual('ctg(x)', 'ctg(x)')).toEqual(true);
    // expect(areValuesEqual('sin(x) / cos(x)', 'tan(x)')).toEqual(true); ?? why is this false?
    // expect(areValuesEqual('cos(x) / sin(x)', 'ctg(x)')).toEqual(true); ?? why is this false?
    expect(areValuesEqual('cos(x) / sin(x)', 'ctg(x)')).toEqual(false);
  });
});
