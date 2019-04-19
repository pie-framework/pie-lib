export MaskMarkup from './simple/mask';
import Input from './simple/input';
import Dropdown from './simple/dropdown';
import Blank from './simple/drag-blank';
export const components = { Input, Dropdown, Blank };

const REGEX = /\{\{(\d?)\}\}/g;
export const componentize = (s, t) => {
  if (!s) {
    throw new Error('No markup');
  }

  return s.replace(REGEX, (match, g) => {
    return `<span data-component="${t}" data-id="${g}"></span>`;
  });
};
