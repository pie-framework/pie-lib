import { color } from '../../../render-ui';

export const disabled = (key = 'fill') => ({
  [key]: color.disabled(),
  pointerEvents: 'none',
});

export const disabledSecondary = (key = 'fill') => ({
  [key]: color.disabledSecondary(),
  pointerEvents: 'none',
});

export const correct = (key = 'fill') => ({
  [key]: color.correctWithIcon(),
  pointerEvents: 'none',
});
export const incorrect = (key = 'fill') => ({
  [key]: color.incorrectWithIcon(),
  pointerEvents: 'none',
});

export const missing = (key = 'fill') => ({
  [key]: color.missingWithIcon(),
  pointerEvents: 'none',
});
