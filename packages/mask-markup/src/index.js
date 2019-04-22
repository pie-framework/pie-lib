export MaskMarkup from './simple/mask';
import Input from './simple/input';
import Dropdown from './simple/dropdown';
import Blank from './simple/drag-blank';
export const components = { Input, Dropdown, Blank };

const REGEX = /\{\{(\d?)\}\}/g;

/**
 *
 * @param {*} s
 * @param {*} t
 * @return { markup:string, ids: number[]}
 */
export const componentize = (s, t) => {
  if (!s) {
    throw new Error('No markup');
  }

  const ids = [];
  const markup = s.replace(REGEX, (match, g) => {
    ids.push(g);
    return `<span data-component="${t}" data-id="${g}"></span>`;
  });
  return { markup, ids };
};
