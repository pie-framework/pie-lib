import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { utils, types } from '@pie-lib/plot';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { dataToXBand } from './utils';

class RawChartAxes extends React.Component {
  static propTypes = {
    bottomScale: PropTypes.func,
    classes: PropTypes.object.isRequired,
    data: PropTypes.array,
    graphProps: types.GraphPropsType.isRequired
  };

  render() {
    const { classes, data, graphProps } = this.props;
    const { scale, range, domain, size } = graphProps;
    const xBand = dataToXBand(scale.x, data, size.width);
    const bottomScale = xBand.rangeRound([0, size.width]);
    return (
      <React.Fragment>
        <AxisLeft
          scale={scale.y}
          className={classes.axis}
          axisLineClassName={classes.axisLine}
          tickClassName={classes.tick}
          label={range.label}
          labelClassName={classes.axisLabel}
          numTicks={utils.tickCount(range.min, range.max, 1)}
        />
        <AxisBottom
          axisLineClassName={classes.axisLine}
          labelClassName={classes.axisLabel}
          tickClassName={classes.tick}
          scale={bottomScale}
          tickComponent={props => {
            return (
              <text x={props.x} y={props.y} className={classes.tick}>
                {props.formattedValue.split('-')[1]}
              </text>
            );
          }}
          label={domain.label}
          top={scale.y(range.min)}
          textLabelProps={() => ({ textAnchor: 'middle' })}
          tickFormat={count => count}
        />
      </React.Fragment>
    );
  }
}

const ChartAxes = withStyles(theme => ({
  axisLabel: {
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: theme.typography.body1.fontSize,
    fill: theme.palette.secondary.main
  },
  axis: {
    stroke: theme.palette.primary.dark,
    strokeWidth: 2
  },
  axisLine: {
    stroke: theme.palette.primary.dark,
    strokeWidth: 2
  },
  tick: {
    '& > line': {
      stroke: theme.palette.primary.dark,
      strokeWidth: 2
    },
    fill: theme.palette.primary.dark,
    fontFamily: theme.typography.body1.fontFamily,
    fontSize: theme.typography.overline.fontSize,
    textAnchor: 'middle'
  }
}))(RawChartAxes);

export default ChartAxes;
