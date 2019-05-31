import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ToolPropTypeFields } from '../types';
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
    center: types.PointType,
    disabled: PropTypes.bool,
    outerPoint: types.PointType,
    onChange: PropTypes.func.isRequired,
    onDragStart: PropTypes.func,
    onDragStop: PropTypes.func,
    graphProps: types.GraphPropsType.isRequired,
    onClick: PropTypes.func
  };

  static defaultProps = {
    onClick: () => ({})
  };

  dragCenter = center => {
    const { onChange } = this.props;
    const d = { center, outerPoint: this.props.outerPoint };

    onChange(d);
  };

  // dragCenter = draggedCenter => {
  //   log('[dragCenter] ', draggedCenter);
  //   this.setState({ draggedCenter });
  // };

  dragOuter = outerPoint => {
    const { onChange } = this.props;
    const d = { center: this.props.center, outerPoint };
    onChange(d);
  };

  // dragOuter = draggedOuter => {
  //   this.setState({ draggedOuter });
  // };

  // dragCircle = draggedCenter => {
  //   log(
  //     'dragCircle: ',
  //     draggedCenter,
  //     'center: ',
  //     this.props.center,
  //     ' outer: ',
  //     this.props.outerPoint
  //   );

  //   const diff = point(this.props.center).sub(point(draggedCenter));

  //   const draggedOuter = point(this.props.outerPoint).sub(diff);

  //   this.setState({ draggedCenter, draggedOuter, isCircleDrag: true });
  // };

  dragCircle = center => {
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

  clickCenter = data => {
    const { onClick } = this.props;
    onClick(data);
  };

  clickOuter = data => {
    const { onClick } = this.props;
    onClick(data);
  };

  clickBg = data => {
    const { onClick } = this.props;
    onClick(data);
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
      onClick,
      correctness,
      graphProps
    } = this.props;

    const common = { onDragStart, onDragStop, graphProps, onClick };

    outerPoint = outerPoint || center;

    const radius = getRadius(center, outerPoint);

    return (
      <g>
        <BgCircle
          disabled={building || disabled}
          correctness={correctness}
          className={classNames(building && classes.bgCircleBuilding)}
          x={center.x}
          y={center.y}
          radius={radius}
          onDrag={this.dragCircle}
          onMove={this.moveCircle}
          {...common}
        />
        <BasePoint
          disabled={building || disabled}
          correctness={correctness}
          x={outerPoint.x}
          y={outerPoint.y}
          onDrag={this.dragOuter}
          {...common}
        />
        <BasePoint
          disabled={building || disabled}
          correctness={correctness}
          x={center.x}
          y={center.y}
          className={classes.center}
          onDrag={this.dragCenter}
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
    ...ToolPropTypeFields,
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
    const { mark, onDragStart, onDragStop, onClick, graphProps } = this.props;
    return (
      <BaseCircle
        {...mark}
        onChange={this.change}
        onDragStart={onDragStart}
        onDragStop={onDragStop}
        onClick={onClick}
        graphProps={graphProps}
      />
    );
  }
}
