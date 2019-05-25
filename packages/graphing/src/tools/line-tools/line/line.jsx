import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { types } from '@pie-lib/plot';
import { arrowDimensions, calculatePreviousNearestScaledPoint } from '../../../utils';

/**
 * A low level segment component
 */
export class RawLine extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    correctness: PropTypes.string,
    disabled: PropTypes.bool,
    from: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }),
    to: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }),
    forward: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }).isRequired,
    backward: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }).isRequired,
    graphProps: types.GraphPropsType.isRequired
  };

  render() {
    const {
      classes,
      disabled,
      className,
      correctness,
      graphProps,
      backward,
      forward,
      ...rest
    } = this.props;
    const { scale } = graphProps;
    const { x: scaledBackwardX, y: scaledBackwardY } = calculatePreviousNearestScaledPoint(
      scale,
      forward,
      backward,
      'line'
    );
    const { x: scaledForwardX, y: scaledForwardY } = calculatePreviousNearestScaledPoint(
      scale,
      backward,
      forward,
      'line'
    );

    return (
      <g>
        <defs>
          <marker
            id="arrow"
            viewBox={`0 0 ${arrowDimensions.line} ${arrowDimensions.line}`}
            refX={arrowDimensions.line / 2}
            refY={arrowDimensions.line / 2}
            markerWidth="3"
            markerHeight="3"
            orient="auto-start-reverse"
            className={classes.arrow}
          >
            <path
              d={`M 0 0 L ${arrowDimensions.line} ${arrowDimensions.line / 2} L 0
              ${arrowDimensions.line} z`}
            />
          </marker>
        </defs>
        <line
          x1={scaledBackwardX}
          y1={scaledBackwardY}
          x2={scaledForwardX}
          y2={scaledForwardY}
          className={classNames(
            classes.bgSegment,
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
  }
}
