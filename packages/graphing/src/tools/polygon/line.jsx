import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { types, gridDraggable } from '@pie-lib/plot';
import { color } from '@pie-lib/render-ui';
import * as utils from '../../utils';
import { correct, disabled, disabledSecondary, incorrect, missing } from '../shared/styles';

const StyledLine = styled('line')(({ theme, disabled: isDisabled, correctness }) => ({
  strokeWidth: 3,
  transition: 'stroke-width 200ms ease-in, stroke 200ms ease-in',
  stroke: 'transparent',
  '&:hover': {
    strokeWidth: 4,
    stroke: color.defaults.BLACK,
  },
  ...(isDisabled && {
    ...disabled('stroke'),
    strokeWidth: 2,
  }),
  ...(correctness === 'correct' && correct('stroke')),
  ...(correctness === 'incorrect' && incorrect('stroke')),
  ...(correctness === 'missing' && {
    ...missing('stroke'),
    strokeWidth: 1,
    strokeDasharray: '4 3',
  }),
}));

class RawLine extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    from: types.PointType,
    to: types.PointType,
    graphProps: types.GraphPropsType.isRequired,
    disabled: PropTypes.bool,
    correctness: PropTypes.string,
  };

  static defaultProps = {
    from: {},
    to: {},
  };

  render() {
    const { graphProps, from, to, className, disabled, correctness, ...rest } = this.props;
    const { scale } = graphProps;
    return (
      <StyledLine
        x1={scale.x(from.x)}
        y1={scale.y(from.y)}
        x2={scale.x(to.x)}
        y2={scale.y(to.y)}
        className={className}
        disabled={disabled}
        correctness={correctness}
        {...rest}
      />
    );
  }
}

export const Line = RawLine;

export default gridDraggable({
  bounds: (props, { domain, range }) => {
    const { from, to } = props;
    const area = utils.lineToArea(from, to);
    return utils.bounds(area, domain, range);
  },
  anchorPoint: (props) => {
    const { from } = props;
    return from;
  },
  fromDelta: (props, delta) => {
    const { from, to } = props;
    return {
      from: utils.point(from).add(utils.point(delta)),
      to: utils.point(to).add(utils.point(delta)),
    };
  },
})(Line);
