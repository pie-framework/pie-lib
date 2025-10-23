import { lineToolComponent, lineBase, styles } from '../shared/line';
import { Arrow } from '../shared/point';
import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import { styled } from '@mui/material/styles';
import { getDistanceBetweenTwoPoints } from '../../utils';

const StyledLine = styled('line')(({ theme, disabled, correctness }) => ({
  ...styles.line(theme),
  ...(disabled && styles.disabledSecondary(theme)),
  ...(correctness && styles[correctness] && styles[correctness](theme, 'stroke')),
}));

export const Line = (props) => {
  const {
    className,
    disabled,
    correctness,
    graphProps: { scale },
    from,
    to,
    ...rest
  } = props;
  const startPoint = { x: scale.x(from.x), y: scale.y(from.y) };
  const endPoint = { x: scale.x(to.x), y: scale.y(to.y) };
  const length = getDistanceBetweenTwoPoints(startPoint, endPoint);

  return (
    <StyledLine
      className={className}
      disabled={disabled}
      correctness={correctness}
      x1={startPoint.x}
      y1={startPoint.y}
      x2={endPoint.x}
      y2={endPoint.y}
      strokeDasharray={length - 7}
      {...rest}
    />
  );
};

Line.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  correctness: PropTypes.string,
  graphProps: PropTypes.any,
  from: types.PointType,
  to: types.PointType,
};

const Vector = lineBase(Line, { to: Arrow });
const Component = lineToolComponent(Vector);

export default Component;
