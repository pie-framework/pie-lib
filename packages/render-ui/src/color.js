import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import pink from '@material-ui/core/colors/pink';
import indigo from '@material-ui/core/colors/indigo';

export const defaults = {
  TEXT: 'black',
  DISABLED: 'grey',
  CORRECT: green[500],
  INCORRECT: orange[500],
  PRIMARY: indigo[500],
  SECONDARY: pink.A400,
  BACKGROUND: 'rgba(255,255,255,0)'
};

Object.freeze(defaults);

export const v = prefix => (...args) => {
  const fallback = args.pop();
  return args.reduceRight((acc, v) => {
    return `var(--${prefix}-${v}, ${acc})`;
  }, fallback);
};

const pv = v('pie');

export const text = () => pv('text', defaults.TEXT);
export const primaryText = () => pv('primary-text', 'text', defaults.TEXT);
export const disabled = () => pv('disabled', defaults.DISABLED);
export const correct = () => pv('correct', defaults.CORRECT);
export const incorrect = () => pv('incorrect', defaults.INCORRECT);
export const primary = () => pv('primary', defaults.PRIMARY);
export const secondary = () => pv('secondary', defaults.SECONDARY);
export const secondaryText = () => pv('secondary-text', 'text', defaults.TEXT);
// export const background = () => pv('background', defaults.BACKGROUND);
