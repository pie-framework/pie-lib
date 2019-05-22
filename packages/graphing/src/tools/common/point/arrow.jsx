import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { types } from '@pie-lib/plot';
import isEqual from 'lodash/isEqual';

export class RawArrow extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    correctness: PropTypes.string,
    disabled: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number,
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

  getAngleDeg(ax, ay, bx, by) {
    if (ax === bx) {
      if (ay < by) {
        angleDeg = 0;
      } else {
        angleDeg = 180;
      }

      return angleDeg;
    }

    if (ay === by) {
      if (ax < bx) {
        angleDeg = 90;
      } else {
        angleDeg = 270;
      }

      return angleDeg;
    }

    const angleRad = Math.atan((ay - by) / (ax - bx));
    let angleDeg = (angleRad * 180) / Math.PI;

    if (ax > bx) {
      angleDeg = 270 - angleDeg;
    } else {
      angleDeg = 90 - angleDeg;
    }

    return angleDeg;
  }

  render() {
    const {
      classes,
      className,
      x,
      y,
      disabled,
      correctness,
      graphProps,
      from,
      to,
      ...rest
    } = this.props;
    const { scale } = graphProps;

    let angle = this.getAngleDeg(from.x, from.y, to.x, to.y);
    let points = '';

    if (isEqual(from, to)) {
      points = '0,0 0,0 0,0';
    } else {
      points = '0,-7 7,7 -7,7';
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
        <polygon
          points={points}
          transform={`
          translate(${scale.x(x)}, ${scale.y(y)})
          rotate(${angle} 0 0)`}
        />
      </g>
    );
  }
}
