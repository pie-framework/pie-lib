import React from 'react';
import PropTypes from 'prop-types';
import { Circle } from '@vx/shape';

import { types } from '@pie-lib/plot';
import { dataToXBand } from '../utils';
import Plot from './common/plot';
import { color } from '@pie-lib/render-ui';
import { styled } from '@mui/material/styles';
import { correct, incorrect } from '../common/styles';

const StyledCircle = styled(Circle)(() => ({
  fill: color.visualElementsColors.PLOT_FILL_COLOR,
  '&.correct': correct('stroke'),
  '&.incorrect': incorrect('stroke'),
}));

const CustomBarElement = (props) => {
  const { index, pointDiameter, barX, barWidth, pointHeight, label, value, scale, dottedOverline } = props;

  const r = pointDiameter / 2;
  const cx = barX + (barWidth - pointDiameter) / 2 + r;
  const cy = scale.y(index) - (pointHeight - pointDiameter) / 2 - r;
  const EXTRA_PADDING = 2;

  return dottedOverline ? (
    <Circle
      key={`point-${label}-${value}-${index}`}
      cx={cx}
      cy={cy}
      r={r + EXTRA_PADDING}
      strokeDasharray="4,4"
      stroke={color.defaults.BORDER_GRAY}
      fill="none"
    />
  ) : (
    <StyledCircle key={`point-${label}-${value}-${index}`} cx={cx} cy={cy} r={r} />
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
  scale: PropTypes.object,
  dottedOverline: PropTypes.bool,
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
