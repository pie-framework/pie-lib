import { lineToolComponent, lineBase, styles } from '../shared/line';
import React from 'react';
import PropTypes from 'prop-types';

import { types } from '@pie-lib/plot';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const Line = withStyles(theme => ({
  line: styles.line(theme)
}))(props => {
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
      className={classNames(
        classes.line,
        disabled && classes.disabled,
        classes[correctness],
        className
      )}
      {...rest}
    />
  );
});

Line.propTypes = {
  graphProps: PropTypes.any,
  from: types.PointType,
  to: types.PointType
};

const Segment = lineBase(Line);
const Component = lineToolComponent(Segment);

export default Component;
