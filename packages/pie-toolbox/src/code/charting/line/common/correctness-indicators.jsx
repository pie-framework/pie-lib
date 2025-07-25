import React from 'react';
import classNames from 'classnames';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';

export const CorrectnessIndicator = ({ scale, x, y, classes, r, correctness, interactive }) => {
  if (!correctness || !interactive) return null;
  const cx = scale.x(x);
  const cy = scale.y(y);
  const isCorrect = correctness.value === 'correct';
  const iconClass = isCorrect ? classes.correctIcon : classes.incorrectIcon;

  // The icon is 16px + 2px padding + 1px border, so total size is 22px
  return (
    <foreignObject x={cx - 11} y={cy - 11} width={22} height={22}>
      {isCorrect ? (
        <Check className={classNames(classes.correctnessIcon, iconClass)} title={correctness.label} />
      ) : (
        <Close className={classNames(classes.correctnessIcon, iconClass)} title={correctness.label} />
      )}
    </foreignObject>
  );
};

export const SmallCorrectPointIndicator = ({ scale, x, r, correctness, classes, correctData, label }) => {
  if (correctness && correctness.value === 'incorrect') {
    const correctVal = parseFloat(correctData.find((d) => d.label === label)?.value);
    if (isNaN(correctVal)) return null;
    const correctPxY = scale.y(correctVal);
    const yToRender = correctPxY - 7.5;
    const xToRender = scale.x(x) - 7.5;

    // small circle has 10px font + 2px padding + 1px border, so total size is 15px
    return (
      <foreignObject x={xToRender} y={yToRender} width={15} height={15}>
        <Check
          className={classNames(classes.correctnessIcon, classes.correctIcon, classes.smallIcon)}
          title={correctness.label}
        />
      </foreignObject>
    );
  }

  return null;
};
