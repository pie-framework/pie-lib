import areValuesEqual, { ave } from '../index';
import mathExpressions from 'math-expressions';
import _ from 'lodash';

describe('math-evaluator', () => {
  const assert = isEqual => label =>
    function() {
      const args = Array.from(arguments);
      const pairs = _.chunk(args, 2);

      describe(label, () => {
        pairs.forEach(([a, b]) => {
          it(`${a} === ${b} ? ${isEqual}`, () => {
            expect(areValuesEqual(a, b)).toBe(isEqual);
          });
        });
      });
    };

  const assertEqual = assert(true);
  const assertNotEqual = assert(false);

  // it.skip('??', () => {
  //   areValuesEqual('1', '\\odot', {
  //     isLatex: true,
  //     allowDecimals: true
  //   });
  // });
  // it.skip('overleftrightarrow', () => {
  //   areValuesEqual('1', '\\overleftrightarrow{1234}', { isLatex: true, allowDecimals: true });
  // });

  function fromLatexToString(latex, { unknownCommands = 'passthrough' } = {}) {
    return mathExpressions.fromLatex(latex, { unknownCommands }).toString();
  }

  // itify = (fn) => {

  //   const root = fn;
  //   root.only =
  // }

  // const ii = itify( it('a', () => {}))

  const _amjs = only => (a, b, equal) => {
    const fn = only ? it.only : it;
    fn(`${a} === ${b} => ${equal}`, () => {
      const as = fromLatexToString(a);
      const bs = fromLatexToString(b);
      expect(ave(as, bs)).toEqual(equal);
    });
  };

  const assertThroughMathJs = _amjs(false);
  assertThroughMathJs.only = _amjs(true);

  const _als = only => (input, expected) => {
    const fn = only ? it.only : it;
    fn(`${input} => ${expected}`, () => {
      expect(fromLatexToString(input)).toEqual(expected);
    });
  };

  const assertLatextFromString = _als(false);
  assertLatextFromString.only = _als(true);
  describe('PIE-188-math-expressions', () => {
    // it('parses expressions correctly', async () => {

    // geometry

    // MULTIPLY WITH VARIABLE BASED
    // assertLatextFromString.only('\\parallel x', 'parallel x');
    assertThroughMathJs('\\parallel x', '\\parallel x', true);
    assertThroughMathJs('\\parallel x', '\\parallel   x', true);
    assertThroughMathJs('\\parallel x', '\\parallel   0', false);
    assertThroughMathJs('\\overrightarrow{x + 4}', '\\overrightarrow {4 + x}', true);
    assertThroughMathJs('\\overrightarrow{4x^2 + 4}', '\\overrightarrow {4x^2 + 8 - 4}', true);
    assertThroughMathJs('\\overrightarrow{21*2*x}', '\\overrightarrow {42x}', true);
    assertLatextFromString('\\nparallel x', 'nparallel x');
    assertLatextFromString('\\overrightarrow{x}', 'overrightarrow x');
    assertLatextFromString('\\overleftrightarrow{x}', 'overleftrightarrow x');
    assertLatextFromString('\\perp x', 'perp x');
    assertLatextFromString('\\angle x', 'angle x');
    assertLatextFromString('\\overarc x', 'overarc x');
    assertLatextFromString('\\measuredangle x', 'measuredangle x');
    assertLatextFromString('\\triangle x', 'triangle x');
    assertLatextFromString('\\parallelogram x', 'parallelogram x');
    assertLatextFromString('\\odot x', 'odot x');
    assertLatextFromString('\\degree x', 'degree x');
    assertLatextFromString('\\sim x', 'sim x');
    assertLatextFromString('\\cong x', 'cong x');
    assertLatextFromString('\\ncong x', 'ncong x');
    assertLatextFromString('\\napprox x', 'napprox x'); // UNRECOGNIZED BY LEARNOSITY
    assertLatextFromString('\\nim x', 'nim x'); // UNRECOGNIZED BY LEARNOSITY
    assertLatextFromString('\\sim x', 'sim x');
    expect(() => fromLatexToString('\\sim 4', { unknownCommands: 'error' })).toThrow();

    // comparisons

    assertLatextFromString('1 \\lt 2', '1 < 2');

    assertLatextFromString('1 \\gt 2', '1 > 2');

    assertLatextFromString('1 \\le 2', '1 ≤ 2');

    assertLatextFromString('1 \\ge 2', '1 ≥ 2');

    // exponents

    assertLatextFromString('2^2', '2^2');

    assertLatextFromString('2^{3}', '2^3');

    // roots

    assertLatextFromString('\\sqrt{2}', 'sqrt(2)');

    assertLatextFromString('\\sqrt[{3}]{3}', '3^(1/3)');

    // fractions

    assertLatextFromString('\\frac{3}{3}', '3/3');

    assertLatextFromString('\\frac{x}{3}', 'x/3');

    assertLatextFromString('x\\frac{5}{3}', 'x (5/3)');

    // ACTUAL OPERATOR BASED
    assertLatextFromString('\\overline{x}', 'overline x');
    assertLatextFromString('\\pm', 'pm');
    assertLatextFromString('\\approx x', 'approx x');
    // assertLatextFromString('3%', '3%');
    // assertLatextFromString('\\neq{x}', 'neq x');

    // logarithms

    assertLatextFromString("4'", "4'");
    assertLatextFromString('\\log 4', 'log(4)');
    assertLatextFromString('\\log(4x)', 'log(4 x)');
    assertLatextFromString('\\ln 4', 'ln(4)');

    assertLatextFromString('|4|', '|4|');
    assertLatextFromString('(4)', '4');
    assertLatextFromString('(4 + x) * 5', '(4 + x) * 5');
    assertLatextFromString('[4]', '4');
    assertLatextFromString('\\mu', 'μ');
    assertLatextFromString('\\Sigma', 'Σ');
    assertLatextFromString('x^{15}', 'x^15');
    assertLatextFromString('x_{15}', 'x_15');

    // Trigo

    assertLatextFromString('\\sin(x)', 'sin(x)');
    assertLatextFromString('\\cos(x)', 'cos(x)');
    assertLatextFromString('\\tan(x)', 'tan(x)');
    assertLatextFromString('\\sec(x)', 'sec(x)');
    assertLatextFromString('\\csc(x)', 'csc(x)');
    assertLatextFromString('\\cot(x)', 'cot(x)');
  });

  // assertEqual('custom latex')('1530', `\\odot`);
  //   assertNotEqual('evaluates simple expressions correctly')('0', 'x', '3x', '4x');

  //   assertEqual('evaluates simple expressions correctly')('x', 'x', '2x', '2x');

  //   assertEqual('evaluates simple expressions correctly 2')(
  //     '100',
  //     '100',
  //     '50 + 50',
  //     '25 * 4',
  //     '200 / 2',
  //     '20 * 5',
  //     '2.5 * 40',
  //     '10 * 10'
  //   );

  //   assertNotEqual('evaluates simple expressions correctly 2')(
  //     '100',
  //     '0',
  //     '0',
  //     '50 * 2',
  //     '44 + 57',
  //     '100',
  //     '44 + 57',
  //     '50 * 3'
  //   );

  //   assertEqual('evaluates simple expressions correctly 3')(
  //     '50 + 50',
  //     '100',
  //     '100 / 2 + 50',
  //     '100',
  //     '2 + 2',
  //     '4',
  //     '1/2 + .5',
  //     '1'
  //   );

  //   assertNotEqual('evaluates simple expressions correctly 3')(
  //     '50 + 51',
  //     '100',
  //     '25 * 2 + 51',
  //     '100',
  //     '1/2 + .5',
  //     '1.9',
  //     '1/2 + .5',
  //     '1.1'
  //   );

  //   assertEqual('evaluates simple expressions correctly 4')(
  //     '50 + 50',
  //     '100',
  //     '100 / 2 + 50',
  //     '100',
  //     '2 + 2',
  //     '4',
  //     '1/2 + .5',
  //     '1',
  //     '13/2',
  //     '13/2',
  //     '26/4',
  //     '13/2',
  //     '6 + 1/2',
  //     '13/2',
  //     '6.5',
  //     '13/2'
  //   );

  //   assertNotEqual('evaluates simple expressions correctly 4')(
  //     '50 + 51',
  //     '100',
  //     '25 * 2 + 51',
  //     '100',
  //     '1/2 + .5',
  //     '1.9',
  //     '1/2 + .5',
  //     '1.1',
  //     '14/2',
  //     '13/2',
  //     '6.6',
  //     '13/2'
  //   );

  //   assertEqual('evaluates simple variable expressions correctly')(
  //     'x',
  //     'x',
  //     'x + 0',
  //     'x',
  //     '(x-2) + 2',
  //     'x',
  //     '((x^2 + x) / x) - 1',
  //     'x',
  //     '2x/2',
  //     'x',
  //     '(x + 2)^2',
  //     '(x + 2)^2',
  //     'x^2 + 4x + 4',
  //     '(x + 2)^2',
  //     'x^2 + 4(x+1)',
  //     '(x + 2)^2',
  //     'x^2 + 8 ((x+1) / 2)',
  //     '(x + 2)^2'
  //   );

  //   assertNotEqual('evaluates simple variable expressions correctly')(
  //     'y',
  //     'x',
  //     'x + 1',
  //     'x',
  //     'x^3 + 4x + 4',
  //     '(x + 2)^2',
  //     'x^2 + 4(x+2)',
  //     '(x + 2)^2'
  //   );

  //   assertEqual('evaluates simple variable expressions correctly 2')(
  //     '(2 + x)^2',
  //     '(x + 2)^2',
  //     'x^2 + 4x + 4',
  //     '(x + 2)^2',
  //     'x^2 + 4(x+1)',
  //     '(x + 2)^2',
  //     'x^2 + 8 ((x+1) / 2)',
  //     '(x + 2)^2'
  //   );

  //   assertEqual('evaluates expressions correctly with variable exponents')(
  //     '(2 + x)^2x',
  //     '(x + 2)^2x',
  //     'y^(2 x)',
  //     'y^(x+x)'
  //   );

  //   assertEqual('evaluates function expressions correctly with variable parameters')(
  //     'sqrt(4x)',
  //     'sqrt(2x+2x)',
  //     'sqrt(x^2)',
  //     'sqrt(((x+1)^2) - ((x+1)^2) + x^2)'
  //   );

  //   assertNotEqual('evaluates simple variable expressions correctly 2')(
  //     'x^3 + 4x + 4',
  //     '(x + 2)^2',
  //     'x^2 + 4(x+2)',
  //     '(x + 2)^2'
  //   );

  //   it('correctly consumes allowDecimals option', () => {
  //     expect(areValuesEqual('123', '123', { allowDecimals: true })).toEqual(true);
  //     expect(areValuesEqual('123', '123.0', { allowDecimals: true })).toEqual(true);
  //     expect(areValuesEqual('123,0', '123.0', { allowDecimals: true })).toEqual(true);
  //     expect(areValuesEqual('123,0', '123.0', { allowDecimals: false })).toEqual(false);
  //     expect(areValuesEqual('123', '123.0', { allowDecimals: false })).toEqual(false);
  //     expect(areValuesEqual('123', '123,0', { allowDecimals: false })).toEqual(false);
  //   });

  //   it('correctly consumes allowDecimals option for complex examples too', () => {
  //     expect(areValuesEqual('1500000', '1500000', { allowDecimals: true })).toEqual(true);
  //     expect(areValuesEqual('1,500,000', '1,500,000', { allowDecimals: true })).toEqual(true);
  //     expect(areValuesEqual('1500000', '1,500,000', { allowDecimals: true })).toEqual(true);
  //     expect(areValuesEqual('1500000', '1,500,000.00', { allowDecimals: true })).toEqual(true);
  //     expect(areValuesEqual('1500000', '1,500,000.0', { allowDecimals: true })).toEqual(true);
  //     expect(areValuesEqual('1,500,000.0', '1,500,000.00', { allowDecimals: true })).toEqual(true);
  //     expect(areValuesEqual('1500000', '1,500000', { allowDecimals: true })).toEqual(false);
  //     expect(areValuesEqual('1500000', '1500,000', { allowDecimals: true })).toEqual(false);
  //     expect(areValuesEqual('1500000', '1,500,000.01', { allowDecimals: true })).toEqual(false);
  //     expect(areValuesEqual('1500000', '1,500,00,0', { allowDecimals: true })).toEqual(false);
  //     expect(areValuesEqual('1500000', '1500,000', { allowDecimals: true })).toEqual(false);
  //     expect(areValuesEqual('1500000', ',1500,000', { allowDecimals: true })).toEqual(false);
  //   });

  //   it('evaluates simple trigo expressions correctly', () => {
  //     expect(areValuesEqual('sin(x)', 'sin(x)')).toEqual(true);
  //     expect(areValuesEqual('tan(x)', 'tan(x)')).toEqual(true);
  //   });

  //   it('correctly creates math expressions 1', () => {
  //     expect(
  //       areValuesEqual(
  //         'f^{-1}\\left(x\\right)=\\sqrt{x-1}+3',
  //         'f^{-1}\\left(x\\right)=\\sqrt{x-1}+3',
  //         { allowDecimals: true, isLatex: true }
  //       )
  //     ).toEqual(true);
  //   });

  //   it.skip('correctly creates math expressions 2', () => {
  //     expect(
  //       areValuesEqual('72\\div12=6\\text{eggs}', '72\\div12=6\\text{eggs}', {
  //         allowDecimals: true,
  //         isLatex: true
  //       })
  //     ).toEqual(true);
  //   });
});
