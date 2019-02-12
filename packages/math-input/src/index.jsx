export KeyPad from './keypad';

export MathInput from './math-input';
export { keysForGrade } from './keys/grades';

const addLeftBracket = s => (s.indexOf('\\(') === 0 ? s : `\\(${s}`);
const addRightBracket = s =>
  s.indexOf('\\)') === s.length - 2 ? s : `${s}\\)`;
const rmLeftBracket = s => (s.indexOf('\\(') === 0 ? s.substring(2) : s);
const rmRightBracket = s =>
  s.indexOf('\\)') === s.length - 2 ? s.substring(0, s.length - 2) : s;

export const addBrackets = s => addRightBracket(addLeftBracket(s));
export const removeBrackets = s => rmRightBracket(rmLeftBracket(s));

export * as keys from './keys';

export HorizontalKeypad from './horizontal-keypad';

export * as mq from './mq';
