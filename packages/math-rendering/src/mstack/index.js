import { CHTMLmstack } from '../../lib/chtml-mstack';
import { MmlNone, MmlMsline, MmlMstack, MmlMsrow } from './mml';

export const chtmlNodes = {
  mstack: CHTMLmstack
};

export const mmlNodes = {
  mstack: MmlMstack,
  msline: MmlMsline,
  msrow: MmlMsrow,
  none: MmlNone
};

console.log('mml nodes:', mmlNodes);
