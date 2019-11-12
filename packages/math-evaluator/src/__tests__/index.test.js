import areValuesEqual from '../index';
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

  it.skip('??', () => {
    areValuesEqual('1', '\\odot', {
      isLatex: true,
      allowDecimals: true
    });
  });
  it.skip('overleftrightarrow', () => {
    areValuesEqual('1', '\\overleftrightarrow{1234}', { isLatex: true, allowDecimals: true });
  });

  describe('PIE-188-math-expressions', () => {
    it('parses expressions correctly', async () => {
      // comparisons

      expect(mathExpressions.fromLatex('1 \\lt 2').toString()).toEqual('1 < 2');

      expect(mathExpressions.fromLatex('1 \\gt 2').toString()).toEqual('1 > 2');

      expect(mathExpressions.fromLatex('1 \\le 2').toString()).toEqual('1 ≤ 2');

      expect(mathExpressions.fromLatex('1 \\ge 2').toString()).toEqual('1 ≥ 2');

      // exponents

      expect(mathExpressions.fromLatex('2^2').toString()).toEqual('2^2');

      expect(mathExpressions.fromLatex('2^{3}').toString()).toEqual('2^3');

      // roots

      expect(mathExpressions.fromLatex('\\sqrt{2}').toString()).toEqual('sqrt(2)');

      expect(mathExpressions.fromLatex('\\sqrt[{3}]{3}').toString()).toEqual('3^(1/3)');

      // fractions

      expect(mathExpressions.fromLatex('\\frac{3}{3}').toString()).toEqual('3/3');

      expect(mathExpressions.fromLatex('\\frac{x}{3}').toString()).toEqual('x/3');

      expect(mathExpressions.fromLatex('x\\frac{5}{3}').toString()).toEqual('x (5/3)');

      // geometry

      // MULTIPLY WITH VARIABLE BASED
      // expect(mathExpressions.fromLatex('\\parallel').toString()).toEqual('x');
      // expect(mathExpressions.fromLatex('\\nparallel').toString()).toEqual('x');
      // expect(mathExpressions.fromLatex('\\overrightarrow{x}').toString()).toEqual('x');
      // expect(mathExpressions.fromLatex('\\overleftrightarrow{x}').toString()).toEqual('x');
      // expect(mathExpressions.fromLatex('\\perp').toString()).toEqual('x');
      // expect(mathExpressions.fromLatex('\\angle').toString()).toEqual('x');
      // expect(mathExpressions.fromLatex('\\overarc').toString()).toEqual('x');
      // expect(mathExpressions.fromLatex('\\measuredangle').toString()).toEqual('x');
      // expect(mathExpressions.fromLatex('\\triangle').toString()).toEqual('x');
      // expect(mathExpressions.fromLatex('\\parallelogram').toString()).toEqual('x');
      // expect(mathExpressions.fromLatex('\\odot').toString()).toEqual('x');
      // expect(mathExpressions.fromLatex('\\degree').toString()).toEqual('x');
      // expect(mathExpressions.fromLatex('\\sim').toString()).toEqual('x');
      // expect(mathExpressions.fromLatex('\\cong').toString()).toEqual('x');
      // expect(mathExpressions.fromLatex('\\ncong').toString()).toEqual('x');
      // expect(mathExpressions.fromLatex('\\napprox').toString()).toEqual('x'); // UNRECOGNIZED BY LEARNOSITY
      // expect(mathExpressions.fromLatex('\\nim').toString()).toEqual('4%'); // UNRECOGNIZED BY LEARNOSITY
      // expect(mathExpressions.fromLatex('\\sim').toString()).toEqual('4%');

      // ACTUAL OPERATOR BASED
      // expect(mathExpressions.fromLatex('\\overline{}').toString()).toEqual('x');
      // expect(mathExpressions.fromLatex('\\pm').toString()).toEqual('+-');
      // expect(mathExpressions.fromLatex('4%').toString()).toEqual('4%');
      // expect(mathExpressions.fromLatex('\\approx').toString()).toEqual('x');
      // expect(mathExpressions.fromLatex('\\neq').toString()).toEqual('4%');
      // expect(mathExpressions.fromLatex('\\overline{x}').toString()).toEqual('4');
      // expect(mathExpressions.fromLatex('\\overline').toString()).toEqual('4');

      // logarithms

      expect(mathExpressions.fromLatex("4'").toString()).toEqual("4'");
      expect(mathExpressions.fromLatex('\\log 4').toString()).toEqual('log(4)');
      expect(mathExpressions.fromLatex('\\log(4x)').toString()).toEqual('log(4 x)');
      expect(mathExpressions.fromLatex('\\ln 4').toString()).toEqual('ln(4)');

      expect(mathExpressions.fromLatex('|4|').toString()).toEqual('|4|');
      expect(mathExpressions.fromLatex('(4)').toString()).toEqual('4');
      expect(mathExpressions.fromLatex('(4 + x) * 5').toString()).toEqual('(4 + x) * 5');
      expect(mathExpressions.fromLatex('[4]').toString()).toEqual('4');
      expect(mathExpressions.fromLatex('\\mu').toString()).toEqual('μ');
      expect(mathExpressions.fromLatex('\\Sigma').toString()).toEqual('Σ');
      expect(mathExpressions.fromLatex('x^{15}').toString()).toEqual('x^15');
      expect(mathExpressions.fromLatex('x_{15}').toString()).toEqual('x_15');

      // Trigo

      expect(mathExpressions.fromLatex('\\sin(x)').toString()).toEqual('sin(x)');
      expect(mathExpressions.fromLatex('\\cos(x)').toString()).toEqual('cos(x)');
      expect(mathExpressions.fromLatex('\\tan(x)').toString()).toEqual('tan(x)');
      expect(mathExpressions.fromLatex('\\sec(x)').toString()).toEqual('sec(x)');
      expect(mathExpressions.fromLatex('\\csc(x)').toString()).toEqual('csc(x)');
      expect(mathExpressions.fromLatex('\\cot(x)').toString()).toEqual('cot(x)');
    });
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
