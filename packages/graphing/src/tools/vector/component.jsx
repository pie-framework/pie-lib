import { lineToolComponent, lineBase, styles } from '../shared/line';
import { Arrow } from '../shared/point';
import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { getDistanceBetweenTwoPoints } from '../../utils';

const lineStyles = (theme) => ({
  line: styles.line(theme),
  disabled: styles.disabled(theme),
  correct: styles.correct(theme, 'stroke'),
  incorrect: styles.incorrect(theme, 'stroke'),
});

export const Line = (props) => {
  const {
    className,
    classes,
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
    <line
      className={classNames(classes.line, disabled && classes.disabled, classes[correctness], className)}
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
  classes: PropTypes.object,
  disabled: PropTypes.bool,
  correctness: PropTypes.string,
  graphProps: PropTypes.any,
  from: types.PointType,
  to: types.PointType,
};

const StyledLine = withStyles(lineStyles)(Line);
const Vector = lineBase(StyledLine, { to: Arrow });
const Component = lineToolComponent(Vector);

export default Component;
