import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { types } from '@pie-lib/plot';
import { calculateCorrectScaledPoints } from '../utils';

/**
 * A low level segment component
 */
export class RawVector extends React.Component {
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
    }).isRequired,
    graphProps: types.GraphPropsType.isRequired
  };

  render() {
    const { classes, disabled, className, correctness, graphProps, from, to, ...rest } = this.props;
    const { scale } = graphProps;
    const scaledFromX = scale.x(from.x);
    const scaledFromY = scale.y(from.y);

    const { x: scaledToX, y: scaledToY } = calculateCorrectScaledPoints(scale, from, to, 'vector');

    return (
      <g>
        <line
          x1={scaledFromX}
          y1={scaledFromY}
          x2={scaledToX}
          y2={scaledToY}
          className={classNames(
            classes.bgSegment,
            disabled && classes.disabled,
            classes[correctness],
            className
          )}
          {...rest}
        />
      </g>
    );
  }
}
