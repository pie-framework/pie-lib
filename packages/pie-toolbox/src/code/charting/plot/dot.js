import React from 'react';
import PropTypes from 'prop-types';
import { types } from '../../plot';
import { dataToXBand } from '../utils';
import Plot from './common/plot';
import { Circle } from '@vx/shape';

const CustomBarElement = (props) => {
  const { index, pointDiameter, barX, barWidth, pointHeight, label, value, classes, scale } = props;

  const r = pointDiameter / 2;
  const cx = barX + (barWidth - pointDiameter) / 2 + r;
  const cy = scale.y(index) - (pointHeight - pointDiameter) / 2 - r;

  return <Circle key={`point-${label}-${value}-${index}`} className={classes.dot} cx={cx} cy={cy} r={r} />;
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

export class DotPlot extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
  };

  render() {
    const props = this.props;
    const { data, graphProps } = props;
    const { scale = {}, size = {} } = graphProps || {};
    const xBand = dataToXBand(scale.x, data, size.width, 'dotPlot');

    return <Plot {...props} xBand={xBand} CustomBarElement={CustomBarElement} />;
  }
}

export default () => ({
  type: 'dotPlot',
  Component: DotPlot,
  name: 'Dot Plot',
});
