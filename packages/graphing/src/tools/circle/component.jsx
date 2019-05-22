import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ToolPropType } from '../types';
import debug from 'debug';
import { BasePoint } from '../common/point';
import BgCircle from './bg-circle';
import { point } from '../../utils';
import classNames from 'classnames';
import { types } from '@pie-lib/plot';

const log = debug('pie-lib:graphing:circle');

const opacityPulsate = opacity => ({
  '0%': { opacity: '0.0' },
  '50%': { opacity },
  '100%': { opacity: '0.0' }
});

export const PointType = {
  x: PropTypes.number,
  y: PropTypes.number
};

const getRadius = (center, outer) => {
  const c = point(center);
  return c.dist(point(outer));
};

export class RawBaseCircle extends React.Component {
  static propTypes = {
    building: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    correctness: PropTypes.string,
    center: PropTypes.shape(PointType),
    disabled: PropTypes.bool,
    outerPoint: PropTypes.shape(PointType),
    onChange: PropTypes.func.isRequired,
    onDragStart: PropTypes.func,
    onDragStop: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      draggedCenter: undefined
    };
  }

  moveCenter = center => {
    const { onChange } = this.props;
    const d = { center, outerPoint: this.props.outerPoint };

    this.setState({ draggedCenter: undefined }, () => {
      onChange(d);
    });
  };

  dragCenter = draggedCenter => {
    log('[dragCenter] ', draggedCenter);
    this.setState({ draggedCenter });
  };

  moveOuter = outerPoint => {
    const { onChange } = this.props;
    const d = { center: this.props.center, outerPoint };
    this.setState({ draggedOuter: undefined }, () => {
      onChange(d);
    });
  };

  dragOuter = draggedOuter => {
    this.setState({ draggedOuter });
  };

  dragCircle = draggedCenter => {
    log(
      'dragCircle: ',
      draggedCenter,
      'center: ',
      this.props.center,
      ' outer: ',
      this.props.outerPoint
    );

    const diff = point(this.props.center).sub(point(draggedCenter));

    const draggedOuter = point(this.props.outerPoint).sub(diff);

    this.setState({ draggedCenter, draggedOuter, isCircleDrag: true });
  };

  moveCircle = center => {
    const { onChange } = this.props;
    const diff = point(this.props.center).sub(point(center));
    const outerPoint = point(this.props.outerPoint).sub(diff);
    const d = { center, outerPoint };
    this.setState(
      {
        draggedCenter: undefined,
        draggedOuter: undefined,
        isCircleDrag: false
      },
      () => {
        onChange(d);
      }
    );
  };

  render() {
    let {
      center,
      outerPoint,
      disabled,
      classes,
      building,
      onDragStart,
      onDragStop,
      correctness,
      graphProps
    } = this.props;
    const { draggedCenter, draggedOuter, isCircleDrag } = this.state;

    log('[render] draggedCenter: ', draggedCenter, 'center: ', center);

    outerPoint = outerPoint || center;
    const c = draggedCenter || center;
    const o = draggedOuter || outerPoint;
    const radius = getRadius(c, o);

    const common = { graphProps };
    return (
      <g>
        <BgCircle
          disabled={building || disabled}
          correctness={correctness}
          className={classNames(building && classes.bgCircleBuilding)}
          x={isCircleDrag ? center.x : c.x}
          y={isCircleDrag ? center.y : c.y}
          radius={radius}
          onDrag={this.dragCircle}
          onMove={this.moveCircle}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          {...common}
        />
        <BasePoint
          disabled={building || disabled}
          correctness={correctness}
          x={isCircleDrag ? o.x : outerPoint.x}
          y={isCircleDrag ? o.y : outerPoint.y}
          onMove={this.moveOuter}
          onDrag={this.dragOuter}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          {...common}
        />
        <BasePoint
          disabled={building || disabled}
          correctness={correctness}
          x={isCircleDrag ? c.x : center.x}
          y={isCircleDrag ? c.y : center.y}
          className={classes.center}
          onMove={this.moveCenter}
          onDrag={this.dragCenter}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          {...common}
        />
      </g>
    );
  }
}

export const BaseCircle = withStyles(theme => ({
  outerLine: {
    fill: 'rgb(0,0,0,0)',
    stroke: theme.palette.primary.light,
    strokeWidth: 4,
    '&:hover': {
      strokeWidth: 6,
      stroke: theme.palette.primary.dark
    }
  },
  center: {},
  bgCircleBuilding: {
    stroke: theme.palette.secondary.light,
    animation: 'opacityPulse 2s ease-out',
    animationIterationCount: 'infinite',
    opacity: 1
  },
  '@keyframes opacityPulse': opacityPulsate('0.3')
}))(RawBaseCircle);

export default class Component extends React.Component {
  static propTypes = {
    ...ToolPropType,
    graphProps: types.GraphPropsType.isRequired
  };

  constructor(props) {
    super(props);
  }

  change = d => {
    const { onChange } = this.props;
    const m = {
      ...this.props.mark,
      center: d.center,
      outerPoint: d.outerPoint
    };
    onChange(this.props.mark, m);
  };

  render() {
    const { mark, onDragStart, onDragStop, graphProps } = this.props;
    return (
      <BaseCircle
        {...mark}
        onChange={this.change}
        onDragStart={onDragStart}
        onDragStop={onDragStop}
        graphProps={graphProps}
      />
    );
  }
}
