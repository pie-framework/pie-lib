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

  function fromLatexToString(latex, { unknownCommands = 'passthrough' } = {}) {
    return mathExpressions.fromLatex(latex, { unknownCommands }).toString();
  }

  describe('PIE-188-math-expressions', () => {
    it('parses expressions correctly', async () => {
      // comparisons

      expect(fromLatexToString('1 \\lt 2')).toEqual('1 < 2');

      expect(fromLatexToString('1 \\gt 2')).toEqual('1 > 2');

      expect(fromLatexToString('1 \\le 2')).toEqual('1 ≤ 2');

      expect(fromLatexToString('1 \\ge 2')).toEqual('1 ≥ 2');

      // exponents

      expect(fromLatexToString('2^2')).toEqual('2^2');

      expect(fromLatexToString('2^{3}')).toEqual('2^3');

      // roots

      expect(fromLatexToString('\\sqrt{2}')).toEqual('sqrt(2)');

      expect(fromLatexToString('\\sqrt[{3}]{3}')).toEqual('3^(1/3)');

      // fractions

      expect(fromLatexToString('\\frac{3}{3}')).toEqual('3/3');

      expect(fromLatexToString('\\frac{x}{3}')).toEqual('x/3');

      expect(fromLatexToString('x\\frac{5}{3}')).toEqual('x (5/3)');

      // geometry

      // MULTIPLY WITH VARIABLE BASED
      expect(fromLatexToString('\\parallel x')).toEqual('parallel x');
      expect(fromLatexToString('\\nparallel x')).toEqual('nparallel x');
      expect(fromLatexToString('\\overrightarrow{x}')).toEqual('overrightarrow x');
      expect(fromLatexToString('\\overleftrightarrow{x}')).toEqual('overleftrightarrow x');
      expect(fromLatexToString('\\perp x')).toEqual('perp x');
      expect(fromLatexToString('\\angle x')).toEqual('angle x');
      expect(fromLatexToString('\\overarc x')).toEqual('overarc x');
      expect(fromLatexToString('\\measuredangle x')).toEqual('measuredangle x');
      expect(fromLatexToString('\\triangle x')).toEqual('triangle x');
      expect(fromLatexToString('\\parallelogram x')).toEqual('parallelogram x');
      expect(fromLatexToString('\\odot x')).toEqual('odot x');
      expect(fromLatexToString('\\degree x')).toEqual('degree x');
      expect(fromLatexToString('\\sim x')).toEqual('sim x');
      expect(fromLatexToString('\\cong x')).toEqual('cong x');
      expect(fromLatexToString('\\ncong x')).toEqual('ncong x');
      expect(fromLatexToString('\\napprox x')).toEqual('napprox x'); // UNRECOGNIZED BY LEARNOSITY
      expect(fromLatexToString('\\nim x')).toEqual('nim x'); // UNRECOGNIZED BY LEARNOSITY
      expect(fromLatexToString('\\sim x')).toEqual('sim x');
      expect(() => fromLatexToString('\\sim 4', { unknownCommands: 'error' })).toThrow();

      // ACTUAL OPERATOR BASED
      // expect(fromLatexToString('\\overline{}')).toEqual('x');
      // expect(fromLatexToString('\\pm')).toEqual('+-');
      // expect(fromLatexToString('4%')).toEqual('4%');
      // expect(fromLatexToString('\\approx')).toEqual('x');
      // expect(fromLatexToString('\\neq')).toEqual('4%');
      // expect(fromLatexToString('\\overline{x}')).toEqual('4');
      // expect(fromLatexToString('\\overline{x}')).toEqual('4');

      // logarithms

      expect(fromLatexToString("4'")).toEqual("4'");
      expect(fromLatexToString('\\log 4')).toEqual('log(4)');
      expect(fromLatexToString('\\log(4x)')).toEqual('log(4 x)');
      expect(fromLatexToString('\\ln 4')).toEqual('ln(4)');

      expect(fromLatexToString('|4|')).toEqual('|4|');
      expect(fromLatexToString('(4)')).toEqual('4');
      expect(fromLatexToString('(4 + x) * 5')).toEqual('(4 + x) * 5');
      expect(fromLatexToString('[4]')).toEqual('4');
      expect(fromLatexToString('\\mu')).toEqual('μ');
      expect(fromLatexToString('\\Sigma')).toEqual('Σ');
      expect(fromLatexToString('x^{15}')).toEqual('x^15');
      expect(fromLatexToString('x_{15}')).toEqual('x_15');

      // Trigo

      expect(fromLatexToString('\\sin(x)')).toEqual('sin(x)');
      expect(fromLatexToString('\\cos(x)')).toEqual('cos(x)');
      expect(fromLatexToString('\\tan(x)')).toEqual('tan(x)');
      expect(fromLatexToString('\\sec(x)')).toEqual('sec(x)');
      expect(fromLatexToString('\\csc(x)')).toEqual('csc(x)');
      expect(fromLatexToString('\\cot(x)')).toEqual('cot(x)');
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
