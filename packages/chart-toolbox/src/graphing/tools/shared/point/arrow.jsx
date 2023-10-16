import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { types } from '../../../../plot/index';
import { ArrowHead } from '../arrow-head';
import { thinnerShapesNeeded } from '../../../utils';

export default class Arrow extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    correctness: PropTypes.string,
    disabled: PropTypes.bool,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    angle: PropTypes.number.isRequired,
    graphProps: types.GraphPropsType.isRequired,
  };

  render() {
    const { classes, angle, className, x, y, disabled, correctness, graphProps, ...rest } = this.props;

    const size = thinnerShapesNeeded(graphProps) ? 12 : 14;
    const { scale } = graphProps;

    const scaledX = scale.x(x);
    const scaledY = scale.y(y);

    const transform = `rotate(${-angle}, ${scaledX},${scaledY})`;
    const points = `${scaledX},${scaledY}
        ${scaledX - size},${scaledY - size / 2}
        ${scaledX - size}, ${scaledY + size / 2}`;

    return (
      <g className={classNames(classes.point, disabled && classes.disabled, classes[correctness], className)} {...rest}>
        <ArrowHead size={size} transform={transform} points={points} />
      </g>
    );
  }
}
