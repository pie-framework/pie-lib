import digits from './digits';
import * as nav from './navigation';
import * as edit from './edit';
import { divide, multiply, plus, minus, equals } from './basic-operators';

const { one, two, three, four, five, six, seven, eight, nine, zero, comma, decimalPoint } = digits;

export const baseSet = [
  [seven, eight, nine, divide],
  [four, five, six, multiply],
  [one, two, three, minus],
  [zero, decimalPoint, comma, plus],
  [nav.left, nav.right, edit.del, equals]
];

export * as comparison from './comparison';
export * as fractions from './fractions';
export * as exponent from './exponent';
export * as misc from './misc';
