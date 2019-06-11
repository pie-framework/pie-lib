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
    scaled: {
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    },
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
      scaled,
      disabled,
      correctness,
      graphProps,
      ...rest
    } = this.props;

    const size = 14;
    const { scale } = graphProps;

    const transform = `translate(${(size / 2) * -1}, ${(size / 2) * -1})`;
    return (
      <g
        className={classNames(
          classes.point,
          disabled && classes.disabled,
          classes[correctness],
          className
        )}
        transform={`translate(${scaled ? scaled.x : scale.x(x)}, ${
          scaled ? scaled.y : scale.y(y)
        }) rotate(${angle * -1} 0 0)`}
        {...rest}
      >
        <ArrowHead size={size} transform={transform} />
      </g>
    );
  }
}
