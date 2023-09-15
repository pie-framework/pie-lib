import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { gridDraggable, utils, types } from '@pie-lib/plot';
import { color } from '@pie-lib/render-ui';
import { correct, incorrect, disabled } from './styles';
import SwapVerticalCircleOutlinedIcon from '@mui/icons-material/SwapVerticalCircleOutlined';

const ICON_Y_OFFSET = -23;
const ICON_X_OFFSET = 45;

const RawDragHandle = ({
  x,
  y,
  width,
  graphProps,
  classes,
  className,
  interactive,
  isHovered,
  correctness,
  ...rest
}) => {
  const { scale } = graphProps;

  return (
    <svg x={x} y={scale.y(y) - 10} width={width} overflow="visible">
      {isHovered && !correctness && interactive && (
        <foreignObject x={ICON_X_OFFSET} y={ICON_Y_OFFSET} overflow="visible">
          <SwapVerticalCircleOutlinedIcon sx={{ color: '#283593' }} fontSize="large" />
        </foreignObject>
      )}

      <circle
        cx={ICON_X_OFFSET - ICON_Y_OFFSET}
        r={-ICON_Y_OFFSET}
        width={width}
        className={classNames(classes.transparentHandle, className)}
        {...rest}
      />

      {correctness && (
        <rect
          y={10}
          width={width}
          className={classNames(
            classes.handle,
            'handle',
            className,
            !interactive && 'non-interactive',
            interactive && correctness && correctness.value,
          )}
          {...rest}
        />
      )}
    </svg>
  );
};

RawDragHandle.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number,
  graphProps: types.GraphPropsType.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  interactive: PropTypes.bool,
  isHovered: PropTypes.bool,
  correctness: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
};

export const DragHandle = withStyles(() => ({
  handle: {
    height: '10px',
    fill: 'transparent',
    transition: 'fill 200ms linear, height 200ms linear',
    '&.correct': correct('fill'),
    '&.incorrect': incorrect('fill'),
    '&.non-interactive': disabled('fill'),
  },
  transparentHandle: {
    height: '20px',
    fill: 'transparent',
  },
  handleContainer: {
    height: 30,
    '&:hover': {
      '& .handle': {
        fill: color.secondaryDark(),
        height: '16px',
      },
    },
    '&.non-interactive': disabled('fill'),
    '&.incorrect': incorrect('fill'),
    '&.correct': correct('fill'),
  },
}))(RawDragHandle);

export const D = gridDraggable({
  axis: 'y',
  fromDelta: (props, delta) => {
    //TODO: should be in grid-draggable, if axis is y delta.x should always be 0.
    delta.x = 0;
    const newPoint = utils.point(props).add(utils.point(delta));

    return newPoint.y;
  },
  bounds: (props, { domain, range }) => {
    const area = { left: 0, top: props.y, bottom: props.y, right: 0 };
    return utils.bounds(area, domain, range);
  },
  anchorPoint: (props) => {
    return { x: props.x, y: props.y };
  },
})(DragHandle);

export default D;
