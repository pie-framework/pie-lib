import { lineBase, lineToolComponent, styles } from '../shared/line';
import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import { styled } from '@mui/material/styles';

const StyledLineRoot = styled('line')(({ theme, disabled, correctness }) => ({
  ...styles.line(theme),
  ...(disabled && {
    ...styles.disabled(theme),
    ...styles.disabledSecondary(theme),
  }),
  ...(correctness === 'correct' && styles.correct(theme, 'stroke')),
  ...(correctness === 'incorrect' && styles.incorrect(theme, 'stroke')),
  ...(correctness === 'missing' && styles.missing(theme, 'stroke')),
}));

export const Line = (props) => {
  const { className, correctness, disabled, graphProps, from, to, ...rest } = props;
  const { scale } = graphProps;
  const x1 = scale.x(from.x);
  const y1 = scale.y(from.y);
  const x2 = scale.x(to.x);
  const y2 = scale.y(to.y);

  return (
    <g>
      {/* Transparent wider line captures pointer events (+2px each side) */}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={7} style={{ cursor: 'pointer', pointerEvents: 'stroke' }} />
      <StyledLineRoot
        x1={x1} y1={y1} x2={x2} y2={y2}
        className={className}
        disabled={disabled}
        correctness={correctness}
        {...rest}
      />
    </g>
  );
};

Line.propTypes = {
  className: PropTypes.string,
  correctness: PropTypes.string,
  disabled: PropTypes.bool,
  graphProps: PropTypes.any,
  from: types.PointType,
  to: types.PointType,
};

const Segment = lineBase(Line);
const Component = lineToolComponent(Segment);

export default Component;
