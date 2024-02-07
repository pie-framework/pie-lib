import { keysForGrade } from './keys/grades';
import { updateSpans} from "./updateSpans";

const addLeftBracket = (s) => (s.indexOf('\\(') === 0 ? s : `\\(${s}`);
const addRightBracket = (s) => (s.indexOf('\\)') === s.length - 2 ? s : `${s}\\)`);
const rmLeftBracket = (s) => (s.indexOf('\\(') === 0 ? s.substring(2) : s);
const rmRightBracket = (s) => (s.indexOf('\\)') === s.length - 2 ? s.substring(0, s.length - 2) : s);

const addBrackets = (s) => addRightBracket(addLeftBracket(s));
const removeBrackets = (s) => rmRightBracket(rmLeftBracket(s));

import * as keys from './keys';

import HorizontalKeypad from './horizontal-keypad';

import * as mq from './mq';

export { keysForGrade, addBrackets, removeBrackets, keys, HorizontalKeypad, mq, updateSpans };
