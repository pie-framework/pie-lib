import { lineToolComponent, lineBase, styles } from '../shared/line-tools';
import React from 'react';
import PropTypes from 'prop-types';
import { trig, types } from '@pie-lib/plot';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { ArrowHead, ArrowMarker, genUid } from '../common/arrow-head';
const markerId = genUid();

const ArrowedLine = withStyles(theme => ({
  line: styles.line(theme),
  arrow: styles.arrow(theme)
}))(props => {
  const { className, classes, correctness, disabled, graphProps, from, to, ...rest } = props;
  const { scale } = graphProps;
  const [eFrom, eTo] = trig.edges(graphProps.domain, graphProps.range)(from, to);
  return (
    <g>
      <defs>
        <ArrowMarker id={markerId} className={classes.arrow} />
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
        markerEnd={`url(#${markerId})`}
        markerStart={`url(#${markerId})`}
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
