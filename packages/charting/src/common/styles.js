import { color } from '@pie-lib/render-ui';

export const disabled = (key = 'fill') => ({
  [key]: `var(--graph-disabled, ${color.disabled()})`,
  pointerEvents: 'none',
});

export const correct = (key = 'fill') => ({
  [key]: color.correct(),
  pointerEvents: 'none',
});
export const incorrect = (key = 'fill') => ({
  [key]: color.incorrect(),
  pointerEvents: 'none',
});
