import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LinePath } from '@vx/shape';
import { Group } from '@vx/group';
import { styled } from '@mui/material/styles';

import { color } from '@pie-lib/render-ui';
import { dataToXBand } from '../utils';
import { types } from '@pie-lib/plot';
import RawLine from './common/line';
import { CorrectnessIndicator, SmallCorrectPointIndicator } from '../common/correctness-indicators';

const StyledLinePath = styled(LinePath)(() => ({
  stroke: color.defaults.TEXT,
  transition: 'fill 200ms linear, height 200ms linear',
  '&.non-interactive': {
    stroke: color.disabled?.() || '#ccc',
  },
}));

const StyledGroup = styled(Group)(({ correctness, interactive }) => ({
  stroke: color.defaults.TEXT,
  transition: 'fill 200ms linear, height 200ms linear',
  ...(correctness && !interactive && {
    fill: `${color.defaults.BLACK} !important`,
    stroke: `${color.defaults.BLACK} !important`,
  }),
  '&.non-interactive': {
    stroke: color.disabled?.() || '#ccc',
  },
}));

const StyledTransparentHandle = styled('circle')(() => ({
  height: '20px',
  fill: 'transparent',
  stroke: 'transparent',
}));

const DraggableComponent = (props) => {
  const { className, scale, x, y, r, correctness, interactive, correctData, label, ...rest } = props;
  const [hover, setHover] = useState(false);

  const squareSize = r * 4;
  const squareHalf = squareSize / 2;
  const cx = scale.x(x);
  const cy = scale.y(y);
  
  return (
    <StyledGroup className={className} correctness={correctness} interactive={interactive}>
      <StyledLinePath
        data={[
          { x: scale.x(x) - r, y: scale.y(y) + r },
          { x: scale.x(x) + r, y: scale.y(y) - r },
        ]}
        key={`point-${x}-${y}-1`}
        x={(d) => d.x}
        y={(d) => d.y}
        strokeWidth={5}
        style={{ pointerEvents: 'none' }}
      />
      <StyledLinePath
        data={[
          { x: scale.x(x) - r, y: scale.y(y) - r },
          { x: scale.x(x) + r, y: scale.y(y) + r },
        ]}
        key={`point-${x}-${y}-2`}
        x={(d) => d.x}
        y={(d) => d.y}
        strokeWidth={5}
        style={{ pointerEvents: 'none' }}
      />
      {hover && (
        <rect
          x={cx - squareHalf}
          y={cy - squareHalf}
          width={squareSize}
          height={squareSize}
          stroke={color.defaults.BORDER_GRAY}
          fill="none"
          strokeWidth={2}
          pointerEvents="none"
        />
      )}
      <StyledTransparentHandle
        cx={cx}
        cy={cy}
        r={r * 2}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        {...rest}
      />
      {/* show correctness indicators */}
      <CorrectnessIndicator
        scale={scale}
        x={x}
        y={y}
        r={r}
        correctness={correctness}
        interactive={interactive}
      />
      {/* show correct point if answer was incorrect */}
      <SmallCorrectPointIndicator
        scale={scale}
        x={x}
        r={r}
        correctness={correctness}
        correctData={correctData}
        label={label}
      />
    </StyledGroup>
  );
};

DraggableComponent.propTypes = {
  scale: PropTypes.object,
  x: PropTypes.number,
  y: PropTypes.number,
  r: PropTypes.number,
  className: PropTypes.string,
  correctness: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
  interactive: PropTypes.bool,
  correctData: PropTypes.array,
  label: PropTypes.string,
};

export class LineCross extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
  };

  render() {
    const props = this.props;
    const { data, graphProps } = props;
    const { scale = {}, size = {} } = graphProps || {};
    const xBand = dataToXBand(scale.x, data, size.width, 'lineCross');

    return <RawLine {...props} xBand={xBand} CustomDraggableComponent={DraggableComponent} />;
  }
}

export default () => ({
  type: 'lineCross',
  Component: LineCross,
  name: 'Line Cross',
});
