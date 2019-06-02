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
import { Label } from '../common/label';

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
    showLabel: PropTypes.bool,
    changeLabel: PropTypes.func,
    onComponentClick: PropTypes.func,
    onClick: PropTypes.func
  };

  static defaultProps = {
    onClick: () => ({})
  };

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
      correctness,
      graphProps,
      changeLabel,
      onComponentClick,
      showLabel
    } = this.props;
    const { draggedCenter, draggedOuter, isCircleDrag } = this.state;

    log('[render] draggedCenter: ', draggedCenter, 'center: ', center);

    outerPoint = outerPoint || center;
    const c = draggedCenter || center;
    const o = draggedOuter || outerPoint;
    const radius = getRadius(c, o);

    const common = { graphProps };
    return (
      <g onClick={onComponentClick}>
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
          onClick={this.clickBg}
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
          onClick={this.clickOuter}
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
          onClick={this.clickCenter}
          {...common}
        />
        <Label
          disabled={building || disabled}
          correctness={correctness}
          onChange={changeLabel}
          x={o.x}
          y={o.y}
          showLabel={showLabel}
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

  changeLabel = label => {
    const { mark, onChange } = this.props;

    const m = { ...mark, label, showLabel: !(label === undefined) };
    onChange(mark, m);
  };

  render() {
    const { mark, onDragStart, onDragStop, graphProps, onComponentClick, onClick } = this.props;
    return (
      <BaseCircle
        {...mark}
        onChange={this.change}
        onDragStart={onDragStart}
        onDragStop={onDragStop}
        onClick={onClick}
        graphProps={graphProps}
        onComponentClick={onComponentClick}
        changeLabel={this.changeLabel}
      />
    );
  }
}
