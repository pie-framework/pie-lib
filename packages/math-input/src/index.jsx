import * as React from 'react';

import EditableMathInput from './editable-math-input';
import HorizontalKeypad from './horizontal-keypad';
import Keypad from './keypad';
import { withStyles } from 'material-ui/styles';

export { Keypad, EditableMathInput, HorizontalKeypad }

const addLeftBracket = s => s.indexOf('\\(') === 0 ? s : `\\(${s}`;
const addRightBracket = s => s.indexOf('\\)') === s.length - 2 ? s : `${s}\\)`;
const rmLeftBracket = s => s.indexOf('\\(') === 0 ? s.substring(2) : s;
const rmRightBracket = s => s.indexOf('\\)') === s.length - 2 ? s.substring(0, s.length - 2) : s;

export const addBrackets = (s) => addRightBracket(addLeftBracket(s));
export const removeBrackets = (s) => rmRightBracket(rmLeftBracket(s));
