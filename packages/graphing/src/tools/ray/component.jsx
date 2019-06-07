import { lineToolComponent, lineBase, styles } from '../shared/line';
import React from 'react';
import PropTypes from 'prop-types';
import { ArrowMarker, genUid } from '../shared/arrow-head';
import { trig, types } from '@pie-lib/plot';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const log = debug('pie-lib:graphing:ray-two');

const markerId = genUid();

const RayLine = withStyles(theme => ({
  line: styles.line(theme),
  arrow: styles.arrow(theme)
}))(props => {
  const { graphProps, from, to, classes, disabled, correctness, className, ...rest } = props;
  const { scale } = graphProps;
  const [aToB] = trig.edges(graphProps.domain, graphProps.range)(from, to);

  return (
    <g>
      <defs>
        <ArrowMarker id={markerId} className={classes.arrow} />
      </defs>
      <line
        x1={scale.x(from.x)}
        y1={scale.y(from.y)}
        x2={scale.x(aToB.x)}
        y2={scale.y(aToB.y)}
        {...rest}
        className={classNames(
          classes.line,
          disabled && classes.disabled,
          classes[correctness],
          className
        )}
        markerEnd={`url(#${markerId})`}
      />
    </g>
  );
});

RayLine.propTypes = {
  graphProps: PropTypes.any,
  from: types.PointType,
  to: types.PointType
};

const Ray = lineBase(RayLine);
const Component = lineToolComponent(Ray);

export default Component;
