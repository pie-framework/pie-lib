import { lineToolComponent, lineBase, styles } from '../shared/line-tools';
import React from 'react';
import PropTypes from 'prop-types';

import { trig, types } from '@pie-lib/plot';
import debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const log = debug('pie-lib:graphing:ray-two');

const RayLine = withStyles(theme => ({
  line: styles.line(theme),
  arrow: styles.arrow(theme)
}))(props => {
  const { graphProps, from, to, classes, disabled, correctness, className, ...rest } = props;
  const { scale } = graphProps;
  const [aToB] = trig.edges(graphProps.domain, graphProps.range)(from, to);

  const size = 6;
  log('from:', from, 'to: ', to);
  return (
    <g>
      <defs>
        <marker
          id="arrow"
          viewBox={`0 0 ${size} ${size}`}
          refX={size / 2}
          refY={size / 2}
          markerWidth={size}
          markerHeight={size}
          orient="auto-start-reverse"
          className={classes.arrow}
        >
          <path
            d={`M 0 0 L ${size} ${size / 2} L 0
              ${size} z`}
          />
        </marker>
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
        markerEnd="url(#arrow)"
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
