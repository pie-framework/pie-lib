import { lineToolComponent, lineBase, styles } from '../shared/line';
import React from 'react';
import PropTypes from 'prop-types';
import { trig, types } from '@pie-lib/plot';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { ArrowMarker, genUid } from '../shared/arrow-head';
import { thinnerShapesNeeded } from '../../utils';

const markerId = genUid();

const lineStyles = theme => ({
  line: styles.line(theme),
  enabledArrow: styles.arrow(theme),
  disabledArrow: styles.disabledArrow(theme),
  disabled: styles.disabled(theme),
  correct: styles.correct(theme, 'stroke'),
  correctArrow: styles.correct(theme),
  incorrect: styles.incorrect(theme, 'stroke'),
  incorrectArrow: styles.incorrect(theme)
});
export const ArrowedLine = props => {
  const { className, classes, correctness, disabled, graphProps, from, to, ...rest } = props;
  const { scale } = graphProps;
  const [eFrom, eTo] = trig.edges(graphProps.domain, graphProps.range)(from, to);
  const suffix = correctness || (disabled && 'disabled') || 'enabled';

  return (
    <g>
      <defs>
        <ArrowMarker
          size={thinnerShapesNeeded(graphProps) ? 4 : 5}
          id={`${props.markerId || markerId}-${suffix}`}
          className={classNames(classes[`${suffix}Arrow`])}
        />
      </defs>
      <line
        x1={scale.x(eFrom.x)}
        y1={scale.y(eFrom.y)}
        x2={scale.x(eTo.x)}
        y2={scale.y(eTo.y)}
        className={classNames(
          classes.line,
          disabled && classes.disabled,
          classes[correctness],
          className
        )}
        markerEnd={`url(#${props.markerId || markerId}-${suffix})`}
        markerStart={`url(#${props.markerId || markerId}-${suffix})`}
        {...rest}
      />
    </g>
  );
};

ArrowedLine.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  correctness: PropTypes.string,
  disabled: PropTypes.bool,
  graphProps: types.GraphPropsType,
  from: types.PointType,
  to: types.PointType,
  markerId: PropTypes.string
};

const StyledArrowedLine = withStyles(lineStyles)(ArrowedLine);

const Line = lineBase(StyledArrowedLine);
const Component = lineToolComponent(Line);

export default Component;
