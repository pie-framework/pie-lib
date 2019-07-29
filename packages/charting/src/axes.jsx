import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { types } from '@pie-lib/plot';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { getTickValues } from './utils';

class RawChartAxes extends React.Component {
  static propTypes = {
    bottomScale: PropTypes.func,
    classes: PropTypes.object.isRequired,
    categories: PropTypes.array,
    graphProps: types.GraphPropsType.isRequired,
    xBand: PropTypes.object,
    leftAxis: PropTypes.bool,
    onChange: PropTypes.func
  };

  render() {
    const { classes, graphProps, xBand, leftAxis, onChange, categories } = this.props;
    const { scale, range, domain, size } = graphProps;
    const bottomScale = xBand.rangeRound([0, size.width]);
    const rowTickValues = getTickValues({ ...range, step: range.labelStep });

    return (
      <React.Fragment>
        {leftAxis && (
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
        )}
        <AxisBottom
          axisLineClassName={classes.axisLine}
          labelClassName={classes.axisLabel}
          tickClassName={classes.tick}
          scale={bottomScale}
          tickComponent={props => {
            const index = props.formattedValue.split('-')[0];
            const item = index >= 0 && categories[index];
            const { deletable } = item || {};

            return (
              <g>
                <text x={props.x} y={props.y} className={classes.tick}>
                  {props.formattedValue.split('-')[1]}
                </text>
                {deletable && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x={props.x}
                    y={props.y}
                    width={16}
                    height={16}
                    viewBox="0 0 512 512"
                    onClick={() => {
                      const index = props.formattedValue.split('-')[0];

                      if (index >= 0) {
                        onChange([
                          ...categories.slice(0, parseInt(index, 10)),
                          ...categories.slice(parseInt(index, 10) + 1)
                        ]);
                      }
                    }}
                  >
                    <path d="M128 405.429C128 428.846 147.198 448 170.667 448h170.667C364.802 448 384 428.846 384 405.429V160H128v245.429zM416 96h-80l-26.785-32H202.786L176 96H96v32h320V96z" />
                  </svg>
                )}
              </g>
            );
          }}
          label={domain.label}
          labelProps={{ y: 50 }}
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
