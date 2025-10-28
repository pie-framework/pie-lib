import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import { ArrowHead } from '../arrow-head';
import { thinnerShapesNeeded } from '../../../utils';

export class BaseArrow extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    correctness: PropTypes.string,
    disabled: PropTypes.bool,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    angle: PropTypes.number.isRequired,
    graphProps: types.GraphPropsType.isRequired,
  };

  render() {
    const { className, angle, x, y, disabled, correctness, graphProps, ...rest } = this.props;
    const size = thinnerShapesNeeded(graphProps) ? 12 : 14;
    const { scale } = graphProps;

    const scaledX = scale.x(x);
    const scaledY = scale.y(y);

    const transform = `rotate(${-angle}, ${scaledX},${scaledY})`;
    const points = `${scaledX},${scaledY}
        ${scaledX - size},${scaledY - size / 2}
        ${scaledX - size},${scaledY + size / 2}`;

    return (
      <g className={className} {...rest}>
        <ArrowHead size={size} transform={transform} points={points} correctness={correctness} />
      </g>
    );
  }
}
