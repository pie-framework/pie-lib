import { lineToolComponent, lineBase, styles } from '../shared/line';
import { Arrow } from '../shared/point';
import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import { getAngleDeg } from '../../utils';

const lineStyles = theme => ({
  line: styles.line(theme),
  disabled: styles.disabled(theme),
  correct: styles.correct(theme, 'stroke'),
  incorrect: styles.incorrect(theme, 'stroke')
});

export const Line = props => {
  const { className, classes, disabled, correctness, graphProps, from, to, ...rest } = props;
  const { scale } = graphProps;
  const angle = getAngleDeg(from.x, from.y, to.x, to.y);

  let x2 = scale.x(to.x);
  let y2 = scale.y(to.y);

  if (angle === 0) {
    x2 -= 10;
  }

  if (angle === 90) {
    y2 += 10;
  }

  if (angle === 180) {
    x2 += 10;
  }

  if (angle === -90) {
    y2 -= 10;
  }

  return (
    <line
      className={classNames(
        classes.line,
        disabled && classes.disabled,
        classes[correctness],
        className
      )}
      x1={scale.x(from.x)}
      y1={scale.y(from.y)}
      x2={x2}
      y2={y2}
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
  to: types.PointType
};

const StyledLine = withStyles(lineStyles)(Line);
const Vector = lineBase(StyledLine, { to: Arrow });
const Component = lineToolComponent(Vector);

export default Component;
