import { lineToolComponent, lineBase, styles } from '../shared/line';
import React from 'react';
import PropTypes from 'prop-types';
import { trig, types } from '@pie-lib/plot';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { ArrowMarker, genUid } from '../shared/arrow-head';
import { GraphPropsType } from '@pie-lib/plot/lib/types';
import isEqual from 'lodash/isEqual';

const markerId = genUid();

const lineStyles = theme => ({
  line: styles.line(theme),
  arrow: styles.arrow(theme)
});
export const ArrowedLine = props => {
  const { className, classes, correctness, disabled, graphProps, from, to, ...rest } = props;
  const { scale } = graphProps;
  const [eFrom, eTo] = trig.edges(graphProps.domain, graphProps.range)(from, to);
  let eFromArrow;
  let eToArrow;

  if (!isEqual(from, to)) {
    eFromArrow = trig.getPointOnLineAtADistance(
      {
        x: scale.x(eTo.x),
        y: scale.y(eTo.y)
      },
      {
        x: scale.x(eFrom.x),
        y: scale.y(eFrom.y)
      }
    );

    eToArrow = trig.getPointOnLineAtADistance(
      {
        x: scale.x(eFrom.x),
        y: scale.y(eFrom.y)
      },
      {
        x: scale.x(eTo.x),
        y: scale.y(eTo.y)
      }
    );
  } else {
    eFromArrow = {
      x: scale.x(from.x),
      y: scale.y(from.y)
    };
    eToArrow = {
      x: scale.x(to.x),
      y: scale.y(to.y)
    };
  }

  return (
    <g>
      <defs>
        <ArrowMarker id={props.markerId || markerId} className={classes.arrow} />
      </defs>
      <line
        x1={eFromArrow.x}
        y1={eFromArrow.y}
        x2={eToArrow.x}
        y2={eToArrow.y}
        className={classNames(
          classes.line,
          disabled && classes.disabled,
          classes[correctness],
          className
        )}
        markerEnd={`url(#${props.markerId || markerId})`}
        markerStart={`url(#${props.markerId || markerId})`}
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
  graphProps: GraphPropsType,
  from: types.PointType,
  to: types.PointType,
  markerId: PropTypes.string
};

const StyledArrowedLine = withStyles(lineStyles)(ArrowedLine);

const Line = lineBase(StyledArrowedLine);
const Component = lineToolComponent(Line);

export default Component;
