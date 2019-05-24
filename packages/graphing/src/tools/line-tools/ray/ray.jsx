import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { types } from '@pie-lib/plot';
import { calculateCorrectScaledPoints, arrowDimensions } from '../utils';

/**
 * A low level segment component
 */
export class RawRay extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    correctness: PropTypes.string,
    disabled: PropTypes.bool,
    from: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }).isRequired,
    to: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }),
    forward: PropTypes.shape({
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
      from,
      forward,
      ...rest
    } = this.props;
    const { scale } = graphProps;
    const scaledFromX = scale.x(from.x);
    const scaledFromY = scale.y(from.y);
    const { x: scaledForwardX, y: scaledForwardY } = calculateCorrectScaledPoints(
      scale,
      from,
      forward,
      'ray'
    );

    return (
      <g>
        <defs>
          <marker
            id="arrow"
            viewBox={`0 0 ${arrowDimensions.ray} ${arrowDimensions.ray}`}
            refX={arrowDimensions.ray / 2}
            refY={arrowDimensions.ray / 2}
            markerWidth="3"
            markerHeight="3"
            orient="auto-start-reverse"
            className={classes.arrow}
          >
            <path
              d={`M 0 0 L ${arrowDimensions.ray} ${arrowDimensions.ray / 2} L 0
              ${arrowDimensions.ray} z`}
            />
          </marker>
        </defs>
        <line
          x1={scaledFromX}
          y1={scaledFromY}
          x2={scaledForwardX}
          y2={scaledForwardY}
          className={classNames(
            classes.bgSegment,
            disabled && classes.disabled,
            classes[correctness],
            className
          )}
          markerEnd="url(#arrow)"
          {...rest}
        />
      </g>
    );
  }
}
