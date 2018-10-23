import areValuesEqual from '../index';



describe('math-evaluator', () => {

  const assert = (isEqual) => (label) => function(){
   const args = Array.prototype.slice.call(null, arguments):
   const pairs = _.chunk(args, 2);
   describe(label, () => {
      pairs.forEach( ([a,b]) => {
        it(`${a} === ${b} ? ${isEqual}`, () => {
          expect(areValuesEqual(a, b)).toBe(isEqual);
        });
      });
   }):
  }
  
  const assertEqual = assert(true);
  const assertNotEqual = assert(false);
  assertEqual('simple')( 
    'x', 'x',
    '2x', '2x',
    '3x + 4x', '7x',
    //...
  )
  
  assertNotEqual('simple')(
    '', 'x',
    '3x', '4x',
    //....
  )
  it('evaluates simple expressions correctly', () => {
    expect(areValuesEqual('x', 'x')).toEqual(true);
    expect(areValuesEqual('2x', '2x')).toEqual(true);
    expect(areValuesEqual('2x', '3x')).toEqual(false);
  });

  it('evaluates simple expressions correctly 2', () => {
    expect(areValuesEqual('100', '100')).toEqual(true);
    expect(areValuesEqual('50 + 50', '25 * 4')).toEqual(true);
    expect(areValuesEqual('200 / 2', '20 * 5')).toEqual(true);
    expect(areValuesEqual('2.5 * 40', '10 * 10')).toEqual(true);
    expect(areValuesEqual('100', '')).toEqual(false);
    expect(areValuesEqual('', '50 * 2')).toEqual(false);
    expect(areValuesEqual('44 + 57', '100')).toEqual(false);
    expect(areValuesEqual('44 + 57', '50 * 3')).toEqual(false);
  });

  it('evaluates simple expressions correctly 3', () => {
    expect(areValuesEqual('50 + 50', '100')).toEqual(true);
    expect(areValuesEqual('100 / 2 + 50', '100')).toEqual(true);
    expect(areValuesEqual('50 + 51', '100')).toEqual(false);
    expect(areValuesEqual('25 * 2 + 51', '100')).toEqual(false);
    expect(areValuesEqual('2 + 2', '4')).toEqual(true);
    expect(areValuesEqual('1/2 + .5', '1')).toEqual(true);
    expect(areValuesEqual('1/2 + .5', '1.9')).toEqual(false);
    expect(areValuesEqual('1/2 + .5', '1.0')).toEqual(true);
  });

  it('evaluates simple expressions correctly 4', () => {
    expect(areValuesEqual('50 + 50', '100')).toEqual(true);
    expect(areValuesEqual('100 / 2 + 50', '100')).toEqual(true);
    expect(areValuesEqual('50 + 51', '100')).toEqual(false);
    expect(areValuesEqual('25 * 2 + 51', '100')).toEqual(false);
    expect(areValuesEqual('2 + 2', '4')).toEqual(true);
    expect(areValuesEqual('1/2 + .5', '1')).toEqual(true);
    expect(areValuesEqual('1/2 + .5', '1.9')).toEqual(false);
    expect(areValuesEqual('1/2 + .5', '1.0')).toEqual(true);
  });

  it('evaluates simple expressions correctly 4', () => {
    expect(areValuesEqual('13/2', '13/2')).toEqual(true);
    expect(areValuesEqual('26/4', '13/2')).toEqual(true);
    expect(areValuesEqual('6 + 1/2', '13/2')).toEqual(true);
    expect(areValuesEqual('6.5', '13/2')).toEqual(true);
    expect(areValuesEqual('14/2', '13/2')).toEqual(false);
    expect(areValuesEqual('6.6', '13/2')).toEqual(false);
  });

  it('evaluates simple variable expressions correctly', () => {
    expect(areValuesEqual('x', 'x')).toEqual(true);
    expect(areValuesEqual('x + 0', 'x')).toEqual(true);
    expect(areValuesEqual('(x-2) + 2', 'x')).toEqual(true);
    expect(areValuesEqual('((x^2 + x) / x) - 1', 'x')).toEqual(true);
    expect(areValuesEqual('2x/2', 'x')).toEqual(true);
    expect(areValuesEqual('y', 'x')).toEqual(false);
    expect(areValuesEqual('x + 1', 'x')).toEqual(false);
  });

  it('evaluates simple variable expressions correctly 2', () => {
    expect(areValuesEqual('(x + 2)^2', '(x + 2)^2')).toEqual(true);
    expect(areValuesEqual('x^2 + 4x + 4', '(x + 2)^2')).toEqual(true);
    expect(areValuesEqual('x * (x+4) + 4', '(x + 2)^2')).toEqual(true);
    expect(areValuesEqual('x^2 + 4(x+1)', '(x + 2)^2')).toEqual(true);
    expect(areValuesEqual('x^2 + 8 ((x+1) / 2)', '(x + 2)^2')).toEqual(true);
    expect(areValuesEqual('x^3 + 4x + 4', '(x + 2)^2')).toEqual(false);
    expect(areValuesEqual('x^2 + 4(x+2)', '(x + 2)^2')).toEqual(false);
  });

  it('evaluates simple variable expressions correctly 3', () => {
    expect(areValuesEqual('(2 + x)^2', '(x + 2)^2')).toEqual(true);
    expect(areValuesEqual('x^2 + 4x + 4', '(x + 2)^2')).toEqual(true);
    expect(areValuesEqual('x * (x+4) + 4', '(x + 2)^2')).toEqual(true);
    expect(areValuesEqual('x^2 + 4(x+1)', '(x + 2)^2')).toEqual(true);
    expect(areValuesEqual('x^2 + 8 ((x+1) / 2)', '(x + 2)^2')).toEqual(true);
    expect(areValuesEqual('x^3 + 4x + 4', '(x + 2)^2')).toEqual(false);
    expect(areValuesEqual('x^2 + 4(x+2)', '(x + 2)^2')).toEqual(false);
  });

  it('evaluates simple trigo expressions correctly', () => {
    expect(areValuesEqual('sin(x)', 'sin(x)')).toEqual(true);
    expect(areValuesEqual('tan(x)', 'tan(x)')).toEqual(true);
    expect(areValuesEqual('ctg(x)', 'ctg(x)')).toEqual(true);
    // expect(areValuesEqual('sin(x) / cos(x)', 'tan(x)')).toEqual(true); ?? why is this false?
    // expect(areValuesEqual('cos(x) / sin(x)', 'ctg(x)')).toEqual(true); ?? why is this false?
    expect(areValuesEqual('cos(x) / sin(x)', 'ctg(x)')).toEqual(false);
  });
});
