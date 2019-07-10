import React from 'react';
import { Axis } from '@vx/axis';
import { tickCount } from '../utils';
import { types, utils } from '@pie-lib/plot';
import PropTypes from 'prop-types';
import Arrow from './arrow';
import { withStyles } from '@material-ui/core';
import debug from 'debug';
import isEqual from 'lodash/isEqual';

const log = debug('pie-lib:graphing:axes');

const getTickValues = prop => {
  const tickValues = [];
  let tickVal = 0;

  while (tickVal >= prop.min) {
    tickValues.push(tickVal);
    tickVal = Math.round((tickVal - prop.labelStep) * 100) / 100;
  }

  tickVal = 0;

  while (tickVal <= prop.max) {
    tickValues.push(tickVal);
    tickVal = Math.round((tickVal + prop.labelStep) * 100) / 100;
  }

  return tickValues;
};

const AxisPropTypes = {
  includeArrows: PropTypes.bool
};
const AxisDefaultProps = {
  includeArrows: true
};

const axisStyles = theme => ({
  line: {
    stroke: theme.palette.primary.main,
    strokeWidth: 5
  },
  arrow: {
    fill: theme.palette.primary.main
  },
  tick: {
    fill: theme.palette.primary.main,
    '& > line': {
      stroke: theme.palette.primary.main
    }
  }
});

const tickLabelStyles = {
  fontFamily: 'Roboto',
  fontSize: '14px',
  cursor: 'inherit'
};

export class RawXAxis extends React.Component {
  static propTypes = {
    ...AxisPropTypes,
    classes: PropTypes.object,
    graphProps: types.GraphPropsType.isRequired
  };
  static defaultProps = AxisDefaultProps;

  shouldComponentUpdate(nextProps) {
    const { data } = this.props;
    return (
      !utils.isDomainRangeEqual(this.props.graphProps, nextProps.graphProps) ||
      !isEqual(data, nextProps.data)
    );
  }
  render() {
    const { includeArrows, classes, graphProps } = this.props;
    const { scale, domain, size } = graphProps;
    const columnTicksValues = getTickValues(domain);

    return (
      <React.Fragment>
        <Axis
          axisLineClassName={classes.line}
          hideZero={true}
          scale={scale.x}
          top={scale.y(0)}
          left={0}
          label={domain.label}
          tickClassName={classes.tick}
          tickFormat={value => value}
          tickLabelProps={() => ({
            ...tickLabelStyles,
            y: '25',
            dx: -4
          })}
          tickValues={columnTicksValues}
        />
        {includeArrows && (
          <Arrow direction="left" x={domain.min} y={0} className={classes.arrow} scale={scale} />
        )}
        {includeArrows && (
          <Arrow direction="right" x={domain.max} y={0} className={classes.arrow} scale={scale} />
        )}
        {domain.axisLabel && (
          <text x={size.width + 20} y={scale.y(0) + 5} textAnchor="middle">
            {domain.axisLabel}
          </text>
        )}
      </React.Fragment>
    );
  }
}

const XAxis = withStyles(axisStyles)(RawXAxis);

export class RawYAxis extends React.Component {
  static propTypes = {
    ...AxisPropTypes,
    graphProps: types.GraphPropsType.isRequired
  };
  static defaultProps = AxisDefaultProps;
  shouldComponentUpdate(nextProps) {
    const { data } = this.props;
    return (
      !utils.isDomainRangeEqual(this.props.graphProps, nextProps.graphProps) ||
      !isEqual(data, nextProps.data)
    );
  }
  render() {
    const { classes, includeArrows, graphProps } = this.props;
    const { scale, range, size } = graphProps;
    const rowTickValues = getTickValues(range);

    return (
      <React.Fragment>
        <Axis
          axisLineClassName={classes.line}
          orientation={'left'}
          scale={scale.y}
          top={0}
          height={size.height}
          left={scale.x(0)}
          label={range.label}
          tickLength={10}
          tickClassName={classes.tick}
          tickFormat={value => value}
          tickLabelProps={value => {
            const digits = value.toLocaleString().length || 1;

            return {
              ...tickLabelStyles,
              dy: 4,
              dx: -10 - digits * 5
            };
          }}
          hideZero={true}
          tickTextAnchor={'bottom'}
          tickValues={rowTickValues}
        />
        {includeArrows && (
          <Arrow direction="down" x={0} y={range.min} className={classes.arrow} scale={scale} />
        )}
        {includeArrows && (
          <Arrow direction="up" x={0} y={range.max} className={classes.arrow} scale={scale} />
        )}
        {range.axisLabel && (
          <text x={scale.x(0)} y={-10} textAnchor="middle">
            {range.axisLabel}
          </text>
        )}
      </React.Fragment>
    );
  }
}
const YAxis = withStyles(axisStyles)(RawYAxis);

export default class Axes extends React.Component {
  static propTypes = AxisPropTypes;
  static defaultProps = AxisDefaultProps;
  render() {
    return (
      <React.Fragment>
        <XAxis {...this.props} />
        <YAxis {...this.props} />
      </React.Fragment>
    );
  }
}
