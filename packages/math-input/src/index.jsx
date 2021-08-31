import { keysForGrade } from './keys/grades';

const addLeftBracket = s => (s.indexOf('\\(') === 0 ? s : `\\(${s}`);
const addRightBracket = s => (s.indexOf('\\)') === s.length - 2 ? s : `${s}\\)`);
const rmLeftBracket = s => (s.indexOf('\\(') === 0 ? s.substring(2) : s);
const rmRightBracket = s => (s.indexOf('\\)') === s.length - 2 ? s.substring(0, s.length - 2) : s);

const addBrackets = s => addRightBracket(addLeftBracket(s));
const removeBrackets = s => rmRightBracket(rmLeftBracket(s));

// increase the font of parallel notation
const updateSpans = () => {
  const spans = Array.from(document.querySelectorAll('span[mathquill-command-id]'));
  (spans || []).forEach(span => {
    if (span && span.innerText === '∥' && span.className !== 'mq-editable-field') {
      span.style.fontSize = '32px';
    }
  });
};

import * as keys from './keys';

import HorizontalKeypad from './horizontal-keypad';

import * as mq from './mq';

export { keysForGrade, addBrackets, removeBrackets, keys, HorizontalKeypad, mq, updateSpans };
