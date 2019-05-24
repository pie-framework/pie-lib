import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { types } from '@pie-lib/plot';
import isEqual from 'lodash/isEqual';
import { getAngleDeg } from '../../../utils';
import { arrowDimensions } from '../../line-tools/utils';

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
    // x & y are the initial coordinates for the arrow
    // from & to are used only to calculate the angle that the arrow should be rotated with

    const { scale } = graphProps;
    const angle = getAngleDeg(from.x, from.y, to.x, to.y);

    let points = '';

    if (isEqual(from, to)) {
      points = '0,0 0,0 0,0';
    } else {
      points = `0,0 ${arrowDimensions.vector},${arrowDimensions.vector * 2} 
      -${arrowDimensions.vector},${arrowDimensions.vector * 2}`;
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
