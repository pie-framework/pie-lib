import React from 'react';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import { dataToXBand } from '../utils';
import Plot from './common/plot';
import { LinePath } from '@vx/shape';
import { Group } from '@vx/group';

const CustomBarElement = (props) => {
  const { index, pointDiameter, barX, barWidth, pointHeight, label, value, classes, scale } = props;

  const x = barX + (barWidth - pointDiameter) / 2;
  const y = scale.y(index) - (pointHeight - pointDiameter) / 2;

  return (
    <Group>
      <LinePath
        data={[
          { x, y },
          { x: x + pointDiameter, y: y - pointDiameter },
        ]}
        key={`point-${label}-${value}-${index}-1`}
        className={classes.line}
        x={(d) => d.x}
        y={(d) => d.y}
        strokeWidth={pointDiameter / 5}
      />
      <LinePath
        data={[
          { x, y: y - pointDiameter },
          { x: x + pointDiameter, y },
        ]}
        key={`point-${label}-${value}-${index}-2`}
        className={classes.line}
        x={(d) => d.x}
        y={(d) => d.y}
        strokeWidth={pointDiameter / 5}
      />
    </Group>
  );
};

CustomBarElement.propTypes = {
  index: PropTypes.number,
  pointDiameter: PropTypes.number,
  barX: PropTypes.number,
  barWidth: PropTypes.number,
  pointHeight: PropTypes.number,
  value: PropTypes.number,
  label: PropTypes.string,
  classes: PropTypes.object,
  scale: PropTypes.object,
};

export class LinePlot extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
  };

  render() {
    const props = this.props;
    const { data, graphProps } = props;
    const { scale = {}, size = {} } = graphProps || {};
    const xBand = dataToXBand(scale.x, data, size.width, 'linePlot');

    return <Plot {...props} xBand={xBand} CustomBarElement={CustomBarElement} />;
  }
}

export default () => ({
  type: 'linePlot',
  Component: LinePlot,
  name: 'Line Plot',
});
