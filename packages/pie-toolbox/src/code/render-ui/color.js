import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import pink from '@material-ui/core/colors/pink';
import indigo from '@material-ui/core/colors/indigo';
import red from '@material-ui/core/colors/red';

export const defaults = {
  TEXT: 'black',
  DISABLED: 'grey',
  CORRECT: green[500],
  CORRECT_SECONDARY: green[50],
  CORRECT_WITH_ICON: '#087D38',
  INCORRECT: orange[500],
  INCORRECT_SECONDARY: red[50],
  INCORRECT_WITH_ICON: '#BF0D00',
  MISSING: red[700],
  MISSING_WITH_ICON: '#6A78A1',
  PRIMARY: indigo[500],
  PRIMARY_LIGHT: indigo[200],
  PRIMARY_DARK: indigo[800],
  SECONDARY: pink.A400,
  SECONDARY_LIGHT: pink[200],
  SECONDARY_DARK: pink[900],
  BACKGROUND: 'rgba(255,255,255,0)',
  SECONDARY_BACKGROUND: 'rgba(241,241,241,1)',
  BLACK: '#000000',
};

Object.freeze(defaults);

export const v = (prefix) => (...args) => {
  const fallback = args.pop();
  return args.reduceRight((acc, v) => {
    return `var(--${prefix}-${v}, ${acc})`;
  }, fallback);
};

const pv = v('pie');

export const text = () => pv('text', defaults.TEXT);
export const disabled = () => pv('disabled', defaults.DISABLED);
export const correct = () => pv('correct', defaults.CORRECT);
export const correctSecondary = () => pv('correct-secondary', defaults.CORRECT_SECONDARY);
export const correctWithIcon = () => pv('correct-icon', defaults.CORRECT_WITH_ICON);
export const incorrect = () => pv('incorrect', defaults.INCORRECT);
export const incorrectWithIcon = () => pv('incorrect-icon', defaults.INCORRECT_WITH_ICON);
export const incorrectSecondary = () => pv('incorrect-secondary', defaults.INCORRECT_SECONDARY);
export const missing = () => pv('missing', defaults.MISSING);
export const missingWithIcon = () => pv('missing-icon', defaults.MISSING_WITH_ICON);

export const primary = () => pv('primary', defaults.PRIMARY);
export const primaryLight = () => pv('primary-light', defaults.PRIMARY_LIGHT);
export const primaryDark = () => pv('primary-dark', defaults.PRIMARY_DARK);
export const primaryText = () => pv('primary-text', 'text', defaults.TEXT);

export const secondary = () => pv('secondary', defaults.SECONDARY);
export const secondaryLight = () => pv('secondary-light', defaults.SECONDARY_LIGHT);
export const secondaryDark = () => pv('secondary-dark', defaults.SECONDARY_DARK);

export const secondaryText = () => pv('secondary-text', 'text', defaults.TEXT);
export const background = () => pv('background', defaults.BACKGROUND);
export const secondaryBackground = () => pv('secondary-background', defaults.SECONDARY_BACKGROUND);
