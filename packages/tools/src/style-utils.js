export const noSelect = () => ({
  cursor: 'default',
  '-webkit-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  'user-select': 'none'
});

export const strokeColor = theme =>
  `var(--ruler-stroke, ${theme.palette.primary.main})`;

export const fillColor = theme =>
  `var(--ruler-bg, ${theme.palette.primary.contrastText})`;
