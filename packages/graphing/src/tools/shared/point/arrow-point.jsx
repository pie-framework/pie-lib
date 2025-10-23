import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import { getAngleDeg, arrowDimensions } from '../../../utils';

export class RawArrow extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    correctness: PropTypes.string,
    disabled: PropTypes.bool,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    from: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }).isRequired,
    to: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    graphProps: types.GraphPropsType.isRequired,
  };

  static defaultProps = {
    from: {},
    to: {},
  };

  render() {
    const { className, x, y, disabled, correctness, graphProps, from, to, ...rest } = this.props;
    const { scale } = graphProps;

    const angle = from && to ? getAngleDeg(from.x, from.y, to.x, to.y) : 0;

    const points =
      from && to && (from.x !== to.x || from.y !== to.y)
        ? `0,0 ${arrowDimensions.vector},${arrowDimensions.vector * 2} -${arrowDimensions.vector},${arrowDimensions.vector * 2}`
        : '0,0 0,0 0,0';

    return (
      <g className={className} {...rest}>
        <polygon
          points={points}
          transform={`translate(${scale.x(x)}, ${scale.y(y)}) rotate(${angle} 0 0)`}
        />
      </g>
    );
  }
}
