import digits from './digits';
import * as nav from './navigation';
import * as edit from './edit';
import { divide, equals, minus, multiply, plus } from './basic-operators';
import * as comparison from './comparison';
import * as fractions from './fractions';
import * as exponent from './exponent';
import * as misc from './misc';

const { one, two, three, four, five, six, seven, eight, nine, zero, comma, decimalPoint } = digits;

export const baseSet = [
  [seven, eight, nine, divide],
  [four, five, six, multiply],
  [one, two, three, minus],
  [zero, decimalPoint, comma, plus],
  [nav.left, nav.right, edit.del, equals],
];

export { comparison, fractions, exponent, misc };
