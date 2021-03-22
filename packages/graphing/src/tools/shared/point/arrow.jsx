import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { types } from '@pie-lib/plot';
import { ArrowHead } from '../arrow-head';

export default class Arrow extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    correctness: PropTypes.string,
    disabled: PropTypes.bool,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    angle: PropTypes.number.isRequired,
    graphProps: types.GraphPropsType.isRequired
  };

  getRotation(currentAngle, referenceAngle, x, y) {
    const breakpoint = referenceAngle + 10;
    return `rotate(${-currentAngle - (currentAngle > breakpoint ? 15 : 0)}, ${x},${y})`;
  }

  getRotationWithBreakpoint(currentAngle, referenceAngle, x, y) {
    const firstBreakpoint = referenceAngle + 10;
    const secondBreakpoint = referenceAngle + 65;
    let t;
    if (currentAngle >= firstBreakpoint && currentAngle < secondBreakpoint) {
      t = 15;
    } else if (currentAngle > secondBreakpoint) {
      t = 7;
    } else {
      t = 0;
    }
    return `rotate(${-currentAngle + t}, ${x},${y})`;
  }

  render() {
    const {
      classes,
      angle,
      className,
      x,
      y,
      disabled,
      correctness,
      graphProps,
      ...rest
    } = this.props;

    const size = 14;
    const { scale } = graphProps;

    const scaledX = scale.x(x);
    const scaledY = scale.y(y);

    let transform;
    const points = `${scaledX},${scaledY}
        ${scaledX - size},${scaledY - size / 2}
        ${scaledX - size}, ${scaledY + size / 2}`;

    if (angle >= 0 && angle < 90) {
      transform = this.getRotation(angle, 0, scaledX, scaledY);
    } else if (angle >= 90 && angle < 180) {
      transform = this.getRotationWithBreakpoint(angle, 90, scaledX, scaledY);
    } else if (angle >= 180 && angle < 270) {
      transform = this.getRotation(angle, 180, scaledX, scaledY);
    } else {
      transform = this.getRotationWithBreakpoint(angle, 280, scaledX, scaledY);
    }

    return (
      <g
        className={classNames(
          classes.point,
          disabled && classes.disabled,
          classes[correctness],
          className
        )}
        {...rest}
      >
        <ArrowHead size={size} transform={transform} points={points} />
      </g>
    );
  }
}
