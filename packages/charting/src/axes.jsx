import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { utils, types } from '@pie-lib/plot';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { dataToXBand, getTickValues } from './utils';

class RawChartAxes extends React.Component {
  static propTypes = {
    bottomScale: PropTypes.func,
    classes: PropTypes.object.isRequired,
    data: PropTypes.array,
    graphProps: types.GraphPropsType.isRequired
  };

  render() {
    const { classes, data, graphProps, type } = this.props;
    const { scale, range, domain, size } = graphProps;
    const xBand = dataToXBand(scale.x, data, size.width, type);
    const bottomScale = xBand.rangeRound([0, size.width]);
    const rowTickValues = getTickValues({ ...range, step: range.labelStep });

    return (
      <React.Fragment>
        <AxisLeft
          scale={scale.y}
          className={classes.axis}
          axisLineClassName={classes.axisLine}
          tickLength={10}
          tickClassName={classes.tick}
          tickFormat={value => value}
          label={range.label}
          labelClassName={classes.axisLabel}
          tickValues={rowTickValues}
          tickLabelProps={value => {
            const digits = value.toLocaleString().length || 1;

            return {
              dy: 4,
              dx: -10 - digits * 5
            };
          }}
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
