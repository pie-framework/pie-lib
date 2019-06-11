import { lineToolComponent, lineBase, styles } from '../shared/line';
import { Arrow } from '../shared/point';
import React from 'react';
import PropTypes from 'prop-types';
import { types, trig } from '@pie-lib/plot';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const lineStyles = theme => ({
  line: styles.line(theme)
});

export const Line = props => {
  const {
    className,
    classes,
    disabled,
    correctness,
    graphProps,
    from,
    to,
    scaledTo,
    ...rest
  } = props;
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
      x2={scaledTo ? scaledTo.x : scale.x(to.x)}
      y2={scaledTo ? scaledTo.y : scale.y(to.y)}
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
  scaledTo: types.PointType
};

const StyledLine = withStyles(lineStyles)(Line);
const Vector = lineBase(StyledLine, { to: Arrow });
const Component = lineToolComponent(props => {
  const { graphProps, to, from } = props;

  const { scale } = graphProps;
  const newTo =
    to &&
    trig.getPointOnLineAtADistance(
      {
        x: scale.x(from.x),
        y: scale.y(from.y)
      },
      {
        x: scale.x(to.x),
        y: scale.y(to.y)
      }
    );
  return <Vector {...props} scaledTo={newTo} />;
});

export default Component;
