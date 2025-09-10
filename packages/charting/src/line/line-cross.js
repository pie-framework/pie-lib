import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LinePath } from '@vx/shape';
import { Group } from '@vx/group';
import classNames from 'classnames';

import { color } from '@pie-lib/render-ui';
import { dataToXBand } from '../utils';
import { types } from '@pie-lib/plot';
import RawLine from './common/line';
import { CorrectnessIndicator, SmallCorrectPointIndicator } from '../common/correctness-indicators';

const DraggableComponent = (props) => {
  const { classes = {}, className, scale, x, y, r, correctness, interactive, correctData, label, ...rest } = props;
  const [hover, setHover] = useState(false);

  const squareSize = r * 4;
  const squareHalf = squareSize / 2;
  const cx = scale.x(x);
  const cy = scale.y(y);

  return (
    <Group className={classNames(className, classes.line, correctness && !interactive && classes.disabledPoint)}>
      <LinePath
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
      <LinePath
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
      <circle
        cx={cx}
        cy={cy}
        r={r * 2}
        className={classNames(classes.transparentHandle)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        {...rest}
      />
      {/* show correctness indicators */}
      <CorrectnessIndicator
        scale={scale}
        x={x}
        y={y}
        classes={classes}
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
        classes={classes}
        correctData={correctData}
        label={label}
      />
    </Group>
  );
};

DraggableComponent.propTypes = {
  scale: PropTypes.object,
  x: PropTypes.number,
  y: PropTypes.number,
  r: PropTypes.number,
  className: PropTypes.string,
  classes: PropTypes.object,
  correctness: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
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
