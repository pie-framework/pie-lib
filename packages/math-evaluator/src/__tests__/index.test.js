import areValuesEqual, { ave, latexToText } from '../index';
import _ from 'lodash';

describe('math-evaluator', () => {
  describe('latexToText', () => {
    const assertLatexToText = (input, expected) => {
      it(`${input} => ${expected}`, () => {
        const result = latexToText(input);
        expect(result).toEqual(expected);
      });
    };
    assertLatexToText('\\frac{ \\frac{1}{3}}{3}', '(1/3)/3');
    assertLatexToText('\\neq', '0 != 0');
    assertLatexToText('10 \\neq 20', '10 != 20');
    assertLatexToText('10 \\neq', '10 != 0');
    assertLatexToText('\\neq 10', '0 != 10');
    assertLatexToText('40%', 'percent(40)');
    assertLatexToText('%', 'percent(0)');
    assertLatexToText('12%', 'percent(12)');
    assertLatexToText('12\\%', 'percent(12)');
    assertLatexToText('-12.5%', '- percent(12.5)');
    assertLatexToText('-12.5\\%', '- percent(12.5)');
  });

  const assert = (isEqual, opts) => label =>
    function() {
      const args = Array.from(arguments);
      const pairs = _.chunk(args, 2);

      describe(label, () => {
        pairs.forEach(([a, b]) => {
          it(`${a} === ${b} ? ${isEqual}`, () => {
            expect(areValuesEqual(a, b, opts)).toBe(isEqual);
          });
        });
      });
    };

  const assertEqual = assert(true);
  const assertNotEqual = assert(false);

  const assertLatexEqual = assert(true, { isLatex: true });
  const assertLatexNotEqual = assert(false, { isLatex: true });

  const _amjs = only => (a, b, equal) => {
    const fn = only ? it.only : it;
    fn(`${a} === ${b} => ${equal}`, () => {
      const as = latexToText(a);
      const bs = latexToText(b);
      expect(ave(as, bs)).toEqual(equal);
    });
  };

  const assertThroughMathJs = _amjs(false);
  assertThroughMathJs.only = _amjs(true);

  const _als = only => (input, expected) => {
    const fn = only ? it.only : it;
    fn(`${input} => ${expected}`, () => {
      expect(latexToText(input)).toEqual(expected);
    });
  };

  const assertLatexFromString = _als(false);
  assertLatexFromString.only = _als(true);

  describe('ch6456', () => {
    assertEqual('percent')('-12.5%', '-12.5%');
    assertEqual('percent')('-12.5\\%', '-12.5%');
    assertNotEqual('percent')('-11.5%', '-12.5%');
  });

  describe('ch6456 - latex', () => {
    assertLatexEqual('percent')('\\frac{1}{2} -12.5%', '\\frac{2}{4} -12.5%');
    assertLatexEqual('percent')('\\frac{1}{2} -12.5%', '\\frac{2}{4} -12.5\\%');
    assertLatexNotEqual('percent')('\\frac{4}{2} -12.5%', '\\frac{2}{4} -12.5\\%');
    assertLatexNotEqual('percent')('\\frac{2}{2} -12.5%', '\\frac{2}{4} -12.5\\%');
  });

  describe('PIE-188-math-expressions', () => {
    // it('parses expressions correctly', async () => {

    // geometry

    // MULTIPLY WITH VARIABLE BASED
    assertThroughMathJs('\\parallel x', '\\parallel x', true);
    assertThroughMathJs('\\parallel x', '\\parallel   x', true);
    assertThroughMathJs('\\parallel x', '\\parallel   0', false);
    assertThroughMathJs('\\overrightarrow{x + 4}', '\\overrightarrow {4 + x}', true);
    assertThroughMathJs('\\overrightarrow{4x^2 + 4}', '\\overrightarrow {4x^2 + 8 - 4}', true);
    assertThroughMathJs('\\overrightarrow{21*2*x}', '\\overrightarrow {42x}', true);
    assertLatexFromString('\\nparallel x', 'nparallel x');
    assertLatexFromString('\\overrightarrow{x}', 'overrightarrow x');
    assertLatexFromString('\\overleftrightarrow{x}', 'overleftrightarrow x');
    assertLatexFromString('\\perp x', 'perp x');
    assertLatexFromString('\\angle x', 'angle x');
    assertLatexFromString('\\overarc x', 'overarc x');
    assertLatexFromString('\\measuredangle x', 'measuredangle x');
    assertLatexFromString('\\triangle x', 'triangle x');
    assertLatexFromString('\\parallelogram x', 'parallelogram x');
    assertLatexFromString('\\odot x', 'odot x');
    assertLatexFromString('\\degree x', 'degree x');
    assertLatexFromString('\\sim x', 'sim x');
    assertLatexFromString('\\cong x', 'cong x');
    assertLatexFromString('\\ncong x', 'ncong x');
    assertLatexFromString('\\napprox x', 'napprox x'); // UNRECOGNIZED BY LEARNOSITY
    assertLatexFromString('\\nim x', 'nim x'); // UNRECOGNIZED BY LEARNOSITY
    assertLatexFromString('\\sim x', 'sim x');
    expect(() => latexToText('\\sim 4', { unknownCommandBehavior: 'error' })).toThrow();

    // comparisons

    assertLatexFromString('1 \\lt 2', '1 < 2');

    assertLatexFromString('1 \\gt 2', '1 > 2');

    assertLatexFromString('1 \\le 2', '1 ≤ 2');

    assertLatexFromString('1 \\ge 2', '1 ≥ 2');

    // exponents

    assertLatexFromString('2^2', '2^2');

    assertLatexFromString('2^{3}', '2^3');

    // roots

    assertLatexFromString('\\sqrt{2}', 'sqrt(2)');

    assertLatexFromString('\\sqrt[{3}]{3}', '3^(1/3)');

    // fractions

    assertLatexFromString('\\frac{3}{3}', '3/3');

    assertLatexFromString('\\frac{x}{3}', 'x/3');

    assertLatexFromString('x\\frac{5}{3}', 'x (5/3)');

    // ACTUAL OPERATOR BASED
    assertLatexFromString('\\overline{x}', 'overline x');
    assertLatexFromString('\\pm', 'pm');
    assertLatexFromString('\\approx x', 'approx x');

    // logarithms

    assertLatexFromString("4'", "4'");
    assertLatexFromString('\\log 4', 'log(4)');
    assertLatexFromString('\\log(4x)', 'log(4 x)');
    assertLatexFromString('\\ln 4', 'ln(4)');

    assertLatexFromString('|4|', '|4|');
    assertLatexFromString('(4)', '4');
    assertLatexFromString('(4 + x) * 5', '(4 + x) * 5');
    assertLatexFromString('[4]', '4');
    assertLatexFromString('\\mu', 'μ');
    assertLatexFromString('\\Sigma', 'Σ');
    assertLatexFromString('x^{15}', 'x^15');
    assertLatexFromString('x_{15}', 'x_15');

    // Trigo

    assertLatexFromString('\\sin(x)', 'sin(x)');
    assertLatexFromString('\\cos(x)', 'cos(x)');
    assertLatexFromString('\\tan(x)', 'tan(x)');
    assertLatexFromString('\\sec(x)', 'sec(x)');
    assertLatexFromString('\\csc(x)', 'csc(x)');
    assertLatexFromString('\\cot(x)', 'cot(x)');
  });

  // assertNotEqual('custom latex')('1530', `\\odot`);
  assertNotEqual('evaluates simple expressions correctly')('0', 'x', '3x', '4x');

  assertEqual('evaluates simple expressions correctly')('x', 'x', '2x', '2x');

  assertEqual('evaluates simple expressions correctly 2')(
    '100',
    '100',
    '50 + 50',
    '25 * 4',
    '200 / 2',
    '20 * 5',
    '2.5 * 40',
    '10 * 10'
  );

  assertNotEqual('evaluates simple expressions correctly 2')(
    '100',
    '0',
    '0',
    '50 * 2',
    '44 + 57',
    '100',
    '44 + 57',
    '50 * 3'
  );

  assertEqual('evaluates simple expressions correctly 3')(
    '50 + 50',
    '100',
    '100 / 2 + 50',
    '100',
    '2 + 2',
    '4',
    '1/2 + .5',
    '1'
  );

  assertNotEqual('evaluates simple expressions correctly 3')(
    '50 + 51',
    '100',
    '25 * 2 + 51',
    '100',
    '1/2 + .5',
    '1.9',
    '1/2 + .5',
    '1.1'
  );

  assertEqual('evaluates simple expressions correctly 4')(
    '50 + 50',
    '100',
    '100 / 2 + 50',
    '100',
    '2 + 2',
    '4',
    '1/2 + .5',
    '1',
    '13/2',
    '13/2',
    '26/4',
    '13/2',
    '6 + 1/2',
    '13/2',
    '6.5',
    '13/2'
  );

  assertNotEqual('evaluates simple expressions correctly 4')(
    '50 + 51',
    '100',
    '25 * 2 + 51',
    '100',
    '1/2 + .5',
    '1.9',
    '1/2 + .5',
    '1.1',
    '14/2',
    '13/2',
    '6.6',
    '13/2'
  );

  assertEqual('evaluates simple variable expressions correctly')(
    'x',
    'x',
    'x + 0',
    'x',
    '(x-2) + 2',
    'x',
    '((x^2 + x) / x) - 1',
    'x',
    '2x/2',
    'x',
    '(x + 2)^2',
    '(x + 2)^2',
    'x^2 + 4x + 4',
    '(x + 2)^2',
    'x^2 + 4(x+1)',
    '(x + 2)^2',
    'x^2 + 8 ((x+1) / 2)',
    '(x + 2)^2'
  );

  assertNotEqual('evaluates simple variable expressions correctly')(
    'y',
    'x',
    'x + 1',
    'x',
    'x^3 + 4x + 4',
    '(x + 2)^2',
    'x^2 + 4(x+2)',
    '(x + 2)^2'
  );

  assertEqual('evaluates simple variable expressions correctly 2')(
    '(2 + x)^2',
    '(x + 2)^2',
    'x^2 + 4x + 4',
    '(x + 2)^2',
    'x^2 + 4(x+1)',
    '(x + 2)^2',
    'x^2 + 8 ((x+1) / 2)',
    '(x + 2)^2'
  );

  assertEqual('evaluates expressions correctly with variable exponents')(
    '(2 + x)^2x',
    '(x + 2)^2x',
    'y^(2 x)',
    'y^(x+x)'
  );

  assertEqual('evaluates function expressions correctly with variable parameters')(
    'sqrt(4x)',
    'sqrt(2x+2x)',
    'sqrt(x^2)',
    'sqrt(((x+1)^2) - ((x+1)^2) + x^2)'
  );

  assertNotEqual('evaluates simple variable expressions correctly 2')(
    'x^3 + 4x + 4',
    '(x + 2)^2',
    'x^2 + 4(x+2)',
    '(x + 2)^2'
  );

  it('correctly consumes allowDecimals option', () => {
    expect(areValuesEqual('123', '123', { allowDecimals: true })).toEqual(true);
    expect(areValuesEqual('123', '123.0', { allowDecimals: true })).toEqual(true);
    expect(areValuesEqual('123,0', '123.0', { allowDecimals: true })).toEqual(true);
    expect(areValuesEqual('123,0', '123.0', { allowDecimals: false })).toEqual(false);
    expect(areValuesEqual('123', '123.0', { allowDecimals: false })).toEqual(false);
    expect(areValuesEqual('123', '123,0', { allowDecimals: false })).toEqual(false);
  });

  it('correctly consumes allowDecimals option for complex examples too', () => {
    expect(areValuesEqual('1500000', '1500000', { allowDecimals: true })).toEqual(true);
    expect(areValuesEqual('1,500,000', '1,500,000', { allowDecimals: true })).toEqual(true);
    expect(areValuesEqual('1500000', '1,500,000', { allowDecimals: true })).toEqual(true);
    expect(areValuesEqual('1500000', '1,500,000.00', { allowDecimals: true })).toEqual(true);
    expect(areValuesEqual('1500000', '1,500,000.0', { allowDecimals: true })).toEqual(true);
    expect(areValuesEqual('1,500,000.0', '1,500,000.00', { allowDecimals: true })).toEqual(true);
    expect(areValuesEqual('1500000', '1,500000', { allowDecimals: true })).toEqual(false);
    expect(areValuesEqual('1500000', '1500,000', { allowDecimals: true })).toEqual(false);
    expect(areValuesEqual('1500000', '1,500,000.01', { allowDecimals: true })).toEqual(false);
    expect(areValuesEqual('1500000', '1,500,00,0', { allowDecimals: true })).toEqual(false);
    expect(areValuesEqual('1500000', '1500,000', { allowDecimals: true })).toEqual(false);
    expect(areValuesEqual('1500000', ',1500,000', { allowDecimals: true })).toEqual(false);
  });

  it('evaluates simple trigo expressions correctly', () => {
    expect(areValuesEqual('sin(x)', 'sin(x)')).toEqual(true);
    expect(areValuesEqual('tan(x)', 'tan(x)')).toEqual(true);
  });

  it('correctly creates math expressions 1', () => {
    expect(
      areValuesEqual(
        'f^{-1}\\left(x\\right)=\\sqrt{x-1}+3',
        'f^{-1}\\left(x\\right)=\\sqrt{x-1}+3',
        { allowDecimals: true, isLatex: true }
      )
    ).toEqual(true);
  });

  it('correctly creates math expressions 2', () => {
    expect(
      areValuesEqual('72\\div12=6\\text{eggs}', '72\\div12=6\\text{eggs}', {
        allowDecimals: true,
        isLatex: true
      })
    ).toEqual(true);
  });
});
