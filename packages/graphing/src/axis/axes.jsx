import React from 'react';
import { Axis } from '@vx/axis';
import { types, utils } from '@pie-lib/plot';
import PropTypes from 'prop-types';
import Arrow from './arrow';
import { withStyles } from '@material-ui/core';
import isEqual from 'lodash/isEqual';
import { getTickValues } from '../utils';

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
  },
  axisLabelHolder: {
    padding: 0,
    margin: 0,
    textAlign: 'center',
    '* > *': {
      margin: 0,
      padding: 0
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
    const columnTicksValues = getTickValues({ ...domain, step: domain.labelStep });

    return (
      <React.Fragment>
        <Axis
          axisLineClassName={classes.line}
          scale={scale.x}
          top={scale.y(0)}
          left={0}
          label={domain.label}
          tickClassName={classes.tick}
          tickFormat={value => value}
          tickLabelProps={label => ({
            ...tickLabelStyles,
            y: 25,
            dx: label === '0' ? 6 : -4
          })}
          // Having 0 as a number in columnTicksValues does not make 0 to show up
          // so we use this trick:
          tickValues={['0', ...columnTicksValues]}
        />
        {includeArrows && (
          <Arrow direction="left" x={domain.min} y={0} className={classes.arrow} scale={scale} />
        )}
        {includeArrows && (
          <Arrow direction="right" x={domain.max} y={0} className={classes.arrow} scale={scale} />
        )}
        {domain.axisLabel && (
          <foreignObject x={size.width + 10} y={scale.y(0) - 10} width={100} height={20}>
            <div dangerouslySetInnerHTML={{ __html: domain.axisLabel }} />
          </foreignObject>
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
    const rowTickValues = getTickValues({ ...range, step: range.labelStep });

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
              dx: -8 - digits * 5
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
          <foreignObject x={scale.x(0) - 50} y={-25} width="100" height="20">
            <div
              dangerouslySetInnerHTML={{ __html: range.axisLabel }}
              className={classes.axisLabelHolder}
            />
          </foreignObject>
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
