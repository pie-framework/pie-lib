import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';

import { gridDraggable, utils, types } from '@pie-lib/plot';
import { color as enumColor } from '@pie-lib/render-ui';
import { getScale } from '../utils';
import DragIcon from './drag-icon';

const StyledSvg = styled('svg')(() => ({
  overflow: 'visible !important',
}));

const StyledEllipse = styled('ellipse')(() => ({
  fill: 'transparent',
  clipPath: 'polygon(50% 0%, 100% 0%, 100% 50%, 0% 50%, 0% 0%)',
}));

const StyledCorrectIcon = styled(Check)(() => ({
  backgroundColor: enumColor.correct(),
  borderRadius: '16px', // equivalent to theme.spacing(2) for most themes
  color: enumColor.defaults.WHITE,
  fontSize: '16px',
  padding: '2px',
  border: `4px solid ${enumColor.defaults.WHITE}`,
  width: '16px',
  height: '16px',
  boxSizing: 'unset', // to override the default border-box in IBX
}));

const StyledIncorrectIcon = styled(Close)(() => ({
  backgroundColor: enumColor.incorrectWithIcon(),
  borderRadius: '16px', // equivalent to theme.spacing(2) for most themes
  color: enumColor.defaults.WHITE,
  fontSize: '16px',
  padding: '2px',
  border: `4px solid ${enumColor.defaults.WHITE}`,
  width: '16px',
  height: '16px',
  boxSizing: 'unset', // to override the default border-box in IBX
}));

const RawDragHandle = ({
  x,
  y,
  width,
  graphProps,
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
    <StyledSvg x={x} y={scale.y(y) - 10} width={width} overflow="visible">
      {isHovered && !correctness && interactive && (
        <DragIcon width={width} scaleValue={scaleValue} color={enumColor.defaults.BORDER_GRAY} />
      )}
      {interactive && !correctness && (
        <StyledEllipse
          cx={width / 2}
          cy={10}
          rx={width / 2}
          // the drag icon has a 22px fixed r value, so the ry value is 3 times that in order to cover all the area
          ry={66}
          className={className}
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
            <StyledCorrectIcon title={correctness.label} />
          ) : (
            <StyledIncorrectIcon title={correctness.label} />
          )}
        </foreignObject>
      )}
    </StyledSvg>
  );
};

RawDragHandle.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number,
  graphProps: types.GraphPropsType.isRequired,
  className: PropTypes.string,
  interactive: PropTypes.bool,
  isHovered: PropTypes.bool,
  correctness: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
  color: PropTypes.string,
};

export const DragHandle = RawDragHandle;

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
