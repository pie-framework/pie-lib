import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { types, gridDraggable } from '@pie-lib/plot';
import { color } from '@pie-lib/render-ui';
import * as utils from '../../utils';
import { disabled, disabledSecondary, correct, incorrect, missing } from '../shared/styles';
import { styled } from '@mui/material/styles';

class RawCircle extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    correctness: PropTypes.string,
    disabled: PropTypes.bool,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    radius: PropTypes.number,
    graphProps: types.GraphPropsType.isRequired,
  };

  render() {
    const { disabled, className, correctness, x, y, radius, graphProps, ...rest } = this.props;
    const { scale } = graphProps;
    const rx = Math.abs(scale.x(x + radius) - scale.x(x));
    const ry = Math.abs(scale.y(y + radius) - scale.y(y));

    return (
      <StyledEllipse
        className={classNames(className, disabled && 'disabledSecondary', correctness)}
        cx={scale.x(x)}
        cy={scale.y(y)}
        rx={rx}
        ry={ry}
        {...rest}
      />
    );
  }
}

// helper to convert old style functions
const applyStyle = (fn) => ({
  ...fn('stroke'),
  '&:hover': {
    strokeWidth: 3,
    ...fn('stroke'),
  },
});

const StyledEllipse = styled('ellipse')(() => ({
  fill: 'transparent',
  stroke: color.defaults.BLACK,
  strokeWidth: 3,
  transition: 'stroke 200ms ease-in, stroke-width 200ms ease-in',
  '&:hover': {
    strokeWidth: 6,
    stroke: color.defaults.PRIMARY_DARK,
  },
  '&.disabled': applyStyle(disabled),
  '&.disabledSecondary': applyStyle(disabledSecondary),
  '&.correct': applyStyle(correct),
  '&.incorrect': applyStyle(incorrect),
  '&.missing': applyStyle(missing),
}));

export const BgCircle = RawCircle;

export default gridDraggable({
  bounds: (props, { domain, range }) => {
    const { x, y } = props;
    const area = { left: x, top: y, bottom: y, right: x };
    return utils.bounds(area, domain, range);
  },
  anchorPoint: (props) => {
    const { x, y } = props;
    return { x, y };
  },
  fromDelta: (props, delta) => {
    const newPoint = utils.point(props).add(utils.point(delta));
    return newPoint;
  },
})(BgCircle);
