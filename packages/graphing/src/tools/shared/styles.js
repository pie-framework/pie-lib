import { color } from '@pie-lib/render-ui';

export const graphingShapeFill = () => color.visualElementsColors.SHAPES_FILL_COLOR;

export const disabled = (key = 'fill') => ({
  [key]: color.disabledSecondary(), // this is needed to match previous disabled color for backward compatibility
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
