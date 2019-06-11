import { lineToolComponent, lineBase, styles } from '../shared/line';
import React from 'react';
import PropTypes from 'prop-types';
import { ArrowMarker, genUid } from '../shared/arrow-head';
import { trig, types } from '@pie-lib/plot';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';

const log = debug('pie-lib:graphing:ray-two');

const markerId = genUid();

const rayStyles = theme => ({
  line: styles.line(theme),
  arrow: styles.arrow(theme)
});
export const RayLine = props => {
  const { graphProps, from, to, classes, disabled, correctness, className, ...rest } = props;
  const { scale } = graphProps;
  const [aToB] = trig.edges(graphProps.domain, graphProps.range)(from, to);
  let aToBArrow;

  if (!isEqual(from, to)) {
    aToBArrow = trig.getPointOnLineAtADistance(
      {
        x: scale.x(from.x),
        y: scale.y(from.y)
      },
      {
        x: scale.x(aToB.x),
        y: scale.y(aToB.y)
      }
    );
  } else {
    aToBArrow = {
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
        x1={scale.x(from.x)}
        y1={scale.y(from.y)}
        x2={aToBArrow.x}
        y2={aToBArrow.y}
        {...rest}
        className={classNames(
          classes.line,
          disabled && classes.disabled,
          classes[correctness],
          className
        )}
        markerEnd={`url(#${props.markerId || markerId})`}
      />
    </g>
  );
};

RayLine.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  correctness: PropTypes.string,
  graphProps: PropTypes.any,
  from: types.PointType,
  to: types.PointType,
  markerId: PropTypes.string
};

const StyledRay = withStyles(rayStyles)(RayLine);

const Ray = lineBase(StyledRay);
const Component = lineToolComponent(Ray);

export default Component;
