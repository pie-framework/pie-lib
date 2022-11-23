import times from 'lodash/times';

const digitMap = {
  0: 'zero',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
};

const comma = { name: 'comma', label: ',', write: ',', category: 'digit' };

const decimalPoint = {
  name: 'decimal-point',
  label: '.',
  write: '.',
  category: 'digit',
};

export default times(10, String)
  .map((n) => {
    return {
      name: digitMap[n],
      write: n,
      label: n,
      category: 'digit',
    };
  })
  .reduce(
    (acc, o) => {
      acc[o.name] = o;
      return acc;
    },
    { comma, decimalPoint },
  );
