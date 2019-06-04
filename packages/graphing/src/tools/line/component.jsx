import { lineToolComponent, lineBase, styles } from '../shared/line-tools';
import React from 'react';
import PropTypes from 'prop-types';
import { trig, types } from '@pie-lib/plot';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { ArrowHead } from '../common/arrow-head';

const ArrowedLine = withStyles(theme => ({
  line: styles.line(theme)
}))(props => {
  const { className, classes, correctness, disabled, graphProps, from, to, ...rest } = props;
  const { scale } = graphProps;
  const [eFrom, eTo] = trig.edges(graphProps.domain, graphProps.range)(from, to);
  const size = 20;
  return (
    <g>
      <defs>
        <marker
          id="arrow"
          viewBox={`0 0 ${size} ${size}`}
          refX={size / 2}
          refY={size / 2}
          markerWidth="10"
          markerHeight="10"
          orient="auto-start-reverse"
          className={classes.arrow}
        >
          <ArrowHead />
        </marker>
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
        markerEnd="url(#arrow)"
        markerStart="url(#arrow)"
        {...rest}
      />
    </g>
  );
});

ArrowedLine.propTypes = {
  graphProps: PropTypes.any,
  from: types.PointType,
  to: types.PointType
};

const Line = lineBase(ArrowedLine);
const Component = lineToolComponent(Line);

export default Component;
