import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';

import { gridDraggable, utils, types } from '../../plot';
import { color as enumColor } from '../../render-ui';
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
  isPlot,
  ...rest
}) => {
  const { scale } = graphProps;
  const scaleValue = getScale(width)?.scale;

  return (
    <svg x={x} y={scale.y(y) - 10} width={width} overflow="visible" className={classes.svgOverflowVisible}>
      {isHovered && !correctness && interactive && (
        <DragIcon width={width} scaleValue={scaleValue} color={enumColor.defaults.BORDER_GRAY} classes={classes} />
      )}
      {interactive && !correctness && (
        <ellipse
          cx={width / 2}
          cy={10}
          rx={width / 2}
          // the drag icon has a 22px fixed r value, so the ry value is 3 times that in order to cover all the area
          ry={66}
          className={classNames(classes.transparentHandle, className)}
          {...rest}
        />
      )}

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

      {correctness && interactive && !isPlot && (
        <foreignObject x={width / 2 - 14} y={0} width={40} height={40}>
          {correctness.value === 'correct' ? (
            <Check className={classNames(classes.correctnessIcon, classes.correctIcon)} title={correctness.label} />
          ) : (
            <Close className={classNames(classes.correctnessIcon, classes.incorrectIcon)} title={correctness.label} />
          )}
        </foreignObject>
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

export const DragHandle = withStyles((theme) => ({
  handle: {
    height: '10px',
    fill: 'transparent',
    transition: 'fill 200ms linear, height 200ms linear',
    '&.correct': correct('fill'),
    '&.incorrect': incorrect('fill'),
    '&.non-interactive': disabled('fill'),
  },
  transparentHandle: {
    fill: 'transparent',
    clipPath: 'polygon(50% 0%, 100% 0%, 100% 50%, 0% 50%, 0% 0%)',
  },
  handleContainer: {
    height: 30,
    '&:hover': {
      '& .handle': {
        fill: enumColor.secondaryDark(),
        height: '16px',
      },
    },
    '&.non-interactive': disabled('fill'),
    '&.incorrect': incorrect('fill'),
    '&.correct': correct('fill'),
  },
  svgOverflowVisible: {
    overflow: 'visible !important',
  },
  correctIcon: {
    backgroundColor: enumColor.correct(),
  },
  incorrectIcon: {
    backgroundColor: enumColor.incorrectWithIcon(),
  },
  correctnessIcon: {
    borderRadius: theme.spacing.unit * 2,
    color: enumColor.defaults.WHITE,
    fontSize: '16px',
    padding: '2px',
    border: `4px solid ${enumColor.defaults.WHITE}`,
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
