import { green, orange, pink, indigo, red } from '@mui/material/colors';

export const defaults = {
  TEXT: 'black',
  DISABLED: 'grey',
  DISABLED_SECONDARY: '#ABABAB',
  CORRECT: green[500],
  CORRECT_SECONDARY: green[50],
  CORRECT_TERTIARY: '#0EA449',
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
  TERTIARY: '#146EB3',
  TERTIARY_LIGHT: '#D0E2F0',
  BACKGROUND: 'rgba(255,255,255,0)',
  BACKGROUND_DARK: '#ECEDF1',
  DROPDOWN_BACKGROUND: '#E0E1E6', // this is used for inline-dropdown
  // this is only used for multi-trait-rubric, we might want to use BACKGROUND_DARK instead
  SECONDARY_BACKGROUND: 'rgba(241,241,241,1)',
  BORDER: '#9A9A9A',
  BORDER_LIGHT: '#D1D1D1',
  BORDER_DARK: '#646464',
  BORDER_GRAY: '#7E8494',
  BLACK: '#000000',
  WHITE: '#ffffff',
  TRANSPARENT: 'transparent',
  // this is used for multiple-choice accessibility
  FOCUS_CHECKED: '#BBDEFB',
  FOCUS_CHECKED_BORDER: '#1565C0',
  FOCUS_UNCHECKED: '#E0E0E0',
  FOCUS_UNCHECKED_BORDER: '#757575',
  // this is used for select text tokens
  BLUE_GREY100: '#F3F5F7',
  BLUE_GREY300: '#C0C3CF',
  BLUE_GREY600: '#7E8494',
  BLUE_GREY900: '#152452',
  // this is used for charting
  FADED_PRIMARY: '#DCDAFB',
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
export const disabledSecondary = () => pv('disabled-secondary', defaults.DISABLED_SECONDARY);
export const correct = () => pv('correct', defaults.CORRECT);
export const correctSecondary = () => pv('correct-secondary', defaults.CORRECT_SECONDARY);
export const correctTertiary = () => pv('correct-tertiary', defaults.CORRECT_TERTIARY);
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
export const fadedPrimary = () => pv('faded-primary', defaults.FADED_PRIMARY);

export const secondary = () => pv('secondary', defaults.SECONDARY);
export const secondaryLight = () => pv('secondary-light', defaults.SECONDARY_LIGHT);
export const secondaryDark = () => pv('secondary-dark', defaults.SECONDARY_DARK);

export const secondaryText = () => pv('secondary-text', 'text', defaults.TEXT);
export const background = () => pv('background', defaults.BACKGROUND);
export const backgroundDark = () => pv('background-dark', defaults.BACKGROUND_DARK);
export const secondaryBackground = () => pv('secondary-background', defaults.SECONDARY_BACKGROUND);
export const dropdownBackground = () => pv('dropdown-background', defaults.DROPDOWN_BACKGROUND);

export const tertiary = () => pv('tertiary', defaults.TERTIARY);
export const tertiaryLight = () => pv('tertiary-light', defaults.TERTIARY_LIGHT);

export const border = () => pv('border', defaults.BORDER);
export const borderLight = () => pv('border-light', defaults.BORDER_LIGHT);
export const borderDark = () => pv('border-dark', defaults.BORDER_DARK);
export const borderGray = () => pv('border-gray', defaults.BORDER_GRAY);

export const black = () => pv('black', defaults.BLACK);
export const white = () => pv('white', defaults.WHITE);
export const transparent = () => defaults.TRANSPARENT;

export const focusChecked = () => pv('focus-checked', defaults.FOCUS_CHECKED);
export const focusCheckedBorder = () => pv('focus-checked-border', defaults.FOCUS_CHECKED_BORDER);
export const focusUnchecked = () => pv('focus-unchecked', defaults.FOCUS_UNCHECKED);
export const focusUncheckedBorder = () => pv('focus-unchecked-border', defaults.FOCUS_UNCHECKED_BORDER);

export const blueGrey100 = () => pv('blue-grey-100', defaults.BLUE_GREY100);
export const blueGrey300 = () => pv('blue-grey-300', defaults.BLUE_GREY300);
export const blueGrey600 = () => pv('blue-grey-600', defaults.BLUE_GREY600);
export const blueGrey900 = () => pv('blue-grey-900', defaults.BLUE_GREY900);

export const visualElementsColors = {
  AXIS_LINE_COLOR: '#5A53C9',
  ROLLOVER_FILL_BAR_COLOR: '#050F2D',
  GRIDLINES_COLOR: '#8E88EA',
  PLOT_FILL_COLOR: '#1463B3',
};
