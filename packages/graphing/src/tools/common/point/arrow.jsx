import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { types } from '@pie-lib/plot';

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

    const size = 10;
    const { scale } = graphProps;

    // const transform = `rotate(${angle * -1 || 0} 0 0) translate(${scale.x(x)}, ${scale.y(y)})`;
    const transform = `
          rotate(${angle * -1} 0 0)`;
    return (
      <g
        className={classNames(
          classes.point,
          disabled && classes.disabled,
          classes[correctness],
          className
        )}
        transform={`translate(${scale.x(x)}, ${scale.y(y)})`}
        {...rest}
      >
        <polygon
          points={`0,0 ${size},${size / 2} 0,${size}`}
          transform={transform}
          style={{ transformOrigin: 'bottom' }}
          transformOrigin={'center'}
        />
      </g>
    );
  }
}
