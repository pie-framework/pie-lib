import { color } from '../../render-ui';

export const disabled = (key = 'fill') => ({
  [key]: `var(--graph-disabled, ${color.disabled()})`,
  pointerEvents: 'none',
  border: 'none',
});

export const correct = (key = 'fill') => ({
  [key]: color.correct(),
  pointerEvents: 'none',
  border: `solid 1px ${color.correct()}`,
});

export const incorrect = (key = 'fill') => ({
  [key]: color.incorrect(),
  pointerEvents: 'none',
  border: `solid 1px ${color.incorrect()}`,
});
