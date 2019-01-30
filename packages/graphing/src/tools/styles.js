import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';

export const disabled = (key = 'fill') => ({
  [key]: `var(--graph-disabled, ${'rgba(0,0,0,0.2)'})`,
  pointerEvents: 'none'
});

export const correct = (key = 'fill') => ({
  [key]: `var(--graph-correct, ${green[500]})`,
  pointerEvents: 'none'
});
export const incorrect = (key = 'fill') => ({
  [key]: `var(--graph-incorrect, ${orange[500]})`,
  pointerEvents: 'none'
});
