import { lineToolComponent, lineBase, styles } from '../shared/line';
import { Arrow } from '../shared/point';
import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const Line = withStyles(theme => ({
  line: styles.line(theme)
}))(props => {
  const { className, classes, disabled, correctness, graphProps, from, to, ...rest } = props;
  const { scale } = graphProps;
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
      x2={scale.x(to.x)}
      y2={scale.y(to.y)}
      {...rest}
    />
  );
});

Line.propTypes = {
  graphProps: PropTypes.any,
  from: types.PointType,
  to: types.PointType
};

const Vector = lineBase(Line, { to: Arrow });
const Component = lineToolComponent(Vector);

export default Component;
