import React from 'react';
import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import { color as enumColor } from '@pie-lib/render-ui';

const StyledCorrectIcon = styled(Check)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  color: enumColor.defaults.WHITE,
  fontSize: '16px',
  padding: '2px',
  border: `4px solid ${enumColor.defaults.WHITE}`,
  width: '16px',
  height: '16px',
  boxSizing: 'unset', // to override the default border-box in IBX
  backgroundColor: enumColor.correct(),
  '&.small': {
    fontSize: '10px',
    width: '10px',
    height: '10px',
  },
}));

const StyledIncorrectIcon = styled(Close)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  color: enumColor.defaults.WHITE,
  fontSize: '16px',
  padding: '2px',
  border: `4px solid ${enumColor.defaults.WHITE}`,
  width: '16px',
  height: '16px',
  boxSizing: 'unset', // to override the default border-box in IBX
  backgroundColor: enumColor.incorrectWithIcon(),
  '&.small': {
    fontSize: '10px',
    width: '10px',
    height: '10px',
  },
}));

export const CorrectnessIndicator = ({ scale, x, y, r, correctness, interactive }) => {
  if (!correctness || !interactive) return null;
  const cx = scale ? scale.x(x) : x;
  const cy = scale ? scale.y(y) : y;
  const isCorrect = correctness.value === 'correct';

  // the icon is 16px + 2px padding + 1px border, so total size is 22px
  return (
    <foreignObject x={cx - 11} y={cy - 11} width={22} height={22}>
      {isCorrect ? (
        <StyledCorrectIcon title={correctness.label} />
      ) : (
        <StyledIncorrectIcon title={correctness.label} />
      )}
    </foreignObject>
  );
};

export const SmallCorrectPointIndicator = ({ scale, x, r, correctness, correctData, label }) => {
  if (correctness && correctness.value === 'incorrect') {
    const correctVal = parseFloat(correctData.find((d) => d.label === label)?.value);
    if (isNaN(correctVal)) return null;
    const correctPxY = scale.y(correctVal);
    const yToRender = correctPxY - 7.5;
    const xToRender = scale.x(x) - 7.5;

    // small circle has 10px font + 2px padding + 1px border, so total size is 15px
    return (
      <foreignObject x={xToRender} y={yToRender} width={15} height={15}>
        <StyledCorrectIcon
          className="small"
          title={correctness.label}
        />
      </foreignObject>
    );
  }

  return null;
};

export const TickCorrectnessIndicator = ({ correctness, interactive }) => {
  if (!correctness || !interactive) return null;

  return correctness.value === 'correct' ? (
    <StyledCorrectIcon title={correctness.label} />
  ) : (
    <StyledIncorrectIcon title={correctness.label} />
  );
};
