import { lineToolComponent, lineBase, styles } from '../shared/line';
import React from 'react';
import PropTypes from 'prop-types';

import { types } from '@pie-lib/plot';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const lineStyles = (theme) => ({
  line: styles.line(theme),
  disabled: styles.disabled(theme),
  correct: styles.correct(theme, 'stroke'),
  incorrect: styles.incorrect(theme, 'stroke'),
});
export const Line = (props) => {
  const { className, classes, correctness, disabled, graphProps, from, to, ...rest } = props;
  const { scale } = graphProps;

  return (
    <line
      stroke="green"
      strokeWidth="6"
      x1={scale.x(from.x)}
      y1={scale.y(from.y)}
      x2={scale.x(to.x)}
      y2={scale.y(to.y)}
      className={classNames(classes.line, disabled && classes.disabled, classes[correctness], className)}
      {...rest}
    />
  );
};

Line.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  correctness: PropTypes.string,
  disabled: PropTypes.bool,
  graphProps: PropTypes.any,
  from: types.PointType,
  to: types.PointType,
};

const StyledLine = withStyles(lineStyles)(Line);
const Segment = lineBase(StyledLine);
const Component = lineToolComponent(Segment);

export default Component;
