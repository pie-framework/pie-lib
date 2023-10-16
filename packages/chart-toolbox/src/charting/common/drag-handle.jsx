import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { gridDraggable, utils, types } from '@pie-lib/plot';
import { color } from '@pie-lib/render-ui';
import { correct, incorrect, disabled } from './styles';
import { getScale } from '../utils';
import DragIcon from './drag-icon';

const RawDragHandle = ({
  x,
  y,
  width,
  graphProps,
  classes,
  className,
  interactive,
  defineChart,
  isHovered,
  correctness,
  color,
  ...rest
}) => {
  const { scale } = graphProps;
  const scaleValue = getScale(width)?.scale;

  return (
    <svg x={x} y={scale.y(y) - 10} width={width} overflow="visible">
      {isHovered && !correctness && interactive && <DragIcon width={width} scaleValue={scaleValue} color={color} />}
      <circle
        cx={width / 2}
        cy={10}
        r={width / 2}
        className={classNames(classes.transparentHandle, className)}
        {...rest}
      />

      <defs>
        <filter id="bottomShadow" x="0" y="0" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="5" result="offsetblur" />
          <feFlood floodColor="#00000033" />
          <feComposite in2="offsetblur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {correctness && (
        <rect
          y={10}
          width={width}
          filter="url(#bottomShadow)"
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
  color: PropTypes.string,
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
    clipPath: 'polygon(50% 0%, 100% 0%, 100% 50%, 0% 50%, 0% 0%)',
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
